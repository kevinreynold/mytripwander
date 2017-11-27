<template>
  <f7-page infinite-scroll data-distance="100">
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <div id="scroll-to-top"/>
    <!-- <flight_card v-for="flight_detail in flight_search_result" :key="flight_detail.url" :flight_detail="flight_detail"/> -->

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>

    <div class="list-block isi">
      <f7-card class="coba-scroll" v-for="i in test" :title="'Item - ' + i" content="Card Content" footer="Card Footer"></f7-card>
      <!-- <div class="item-inner coba-scroll"  v-for="i in 20">
        <div class="item-title">Item {{i}}</div>
      </div> -->
    </div>

    <!-- <div class="list-block coba">
    <ul>
      <li class="item-content" v-for="i in 20">
        <div class="item-inner">
          <div class="item-title">Item {{i}}</div>
        </div>
      </li>
    </ul>
    </div> -->

    <!-- <div class="infinite-scroll-preloader">
      <div class="preloader"></div>
    </div> -->
  </f7-page>
</template>

<script>
import flight_card from '../components/flight-card'
import store from '../js/store'
import Vue from 'vue'

let self;

function doInfiniteScroll(){
  var aa = store.flight_search_result.length;
  console.log(aa);
  //INFINITE SCROLL
  var $$ = window.Dom7;
  // Loading flag
  var loading = false;
  // Last loaded index
  // var lastIndex = $$('.coba li').length;
  var lastIndex = $$('.isi .coba-scroll').length;
  console.log(lastIndex);
  // Max items to load
  var maxItems = 60;
  // Append items per load
  var itemsPerLoad = 5;
  // Attach 'infinite' event handler
  $$('.infinite-scroll').on('infinite', function () {

    // Exit, if loading in progress
    if (loading) return;

    // Set loading flag
    loading = true;

    // Emulate 1s loading
    setTimeout(function () {
      // Reset loading flag
      loading = false;

      if (lastIndex >= maxItems) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        window.f7.detachInfiniteScroll($$('.infinite-scroll'));
        // Remove preloader
        $$('.infinite-scroll-preloader').remove();
        return;
      }

      // Generate new items HTML
      var html = '';
      for (var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
        self.test.push(i);
        // var text = "Items - " + i;
        // var child_component = '<f7-card class="coba-scroll" title="' + text + '" content="Card Content" footer="Card Footer"></f7-card>';
        // html += child_component;
        // html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
        // html += '<div class="item-inner coba-scroll"><div class="item-title">Item ' + i + '</div></div>';
      }

      // Append new items
      // var element = $$('.isi').append(html);
      // Vue.compile(element.get(0));

    }, 1000);

    // Update last loaded index
    lastIndex = $$('.isi .coba-scroll').length;
    console.log("l :" + lastIndex);
  });
}

export default {
  components: {
    flight_card
  },
  data: () => ({
    flight_search_result : [],
    flight_data : [],
    test: [1,2,3,4,5]
  }),
  computed: {
    title(){
      var depart_date = new Date(self.flight_data[0].date);
      var title = "";
      title += self.flight_data[0].origin + " - " + self.flight_data[0].destination;
      title += " (" + depart_date.getDate() + "." + (depart_date.getMonth()+1) + ")";
      if (self.flight_data.length > 1) {
        var return_date = new Date(self.flight_data[1].date);
        title += " | ";
        // title += self.flight_data[1].origin + " - " + self.flight_data[1].destination;
        title += " (" + return_date.getDate() + "." + (return_date.getMonth()+1) + ")";
      }
      return title;
    }
  },
  mounted() {
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
    doInfiniteScroll();
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.flight_search_result = store.flight_search_result;
    self.flight_data = store.flight_booking_data;
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
    // console.log(self.flight_data);
    console.log(self.flight_search_result);
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    },
    clearData(){
      store.flight_search_result = [];
      store.flight_booking_data = [];
    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }

  .infinite-scroll-preloader {
    margin-top:-20px;
    margin-bottom: 10px;
    text-align: center;
  }
  .infinite-scroll-preloader .preloader {
    width:34px;
    height:34px;
  }
</style>
