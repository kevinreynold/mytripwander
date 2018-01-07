<template>
  <f7-page infinite-scroll>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <div id="scroll-to-top"/>

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>

    <div class="list-block flight-search-result">
      <flight_card class="dynamic-component" v-for="flight_detail in flight_search_result" :key="flight_detail.url" :flight_detail="flight_detail"/>
    </div>
  </f7-page>
</template>

<script>
import flight_card from '../components/flight-card'
import store from '../js/store'

let self;

function doInfiniteScroll(items_per_load = 5){
  //INFINITE SCROLL
  var $$ = window.Dom7;
  // Loading flag
  var loading = false;
  // Last loaded index
  var lastIndex = $$('.flight-search-result .dynamic-component').length;
  // console.log(lastIndex);
  var maxItems = store.flight_search_result.length;
  // Append items per load
  var itemsPerLoad = items_per_load;
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
        $$(".flight-search-result").append("<div style='width: 100%;height: 30px;'></div>");
        // Remove preloader
        $$('.infinite-scroll-preloader').remove();
        return;
      }

      // Generate new items HTML
      var html = '';
      // Check itemsPerLoad
      itemsPerLoad = (maxItems - lastIndex) < itemsPerLoad ? (maxItems - lastIndex) : itemsPerLoad;
      // console.log("IIII : " + itemsPerLoad);
      for (var i = lastIndex; i <= lastIndex + itemsPerLoad - 1; i++) {
        // console.log(i);
        self.flight_search_result.push(store.flight_search_result[i]);
      }
    }, 750);

    // Update last loaded index
    lastIndex = $$('.flight-search-result .dynamic-component').length;
    // console.log("l :" + lastIndex);
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
    self.flight_data = store.flight_booking_data;

    // store.flight_search_result = store.flight_search_result.slice(0,23);
    self.flight_search_result = store.flight_search_result;
    // self.flight_search_result = self.flight_search_result.slice(0, 5);

    // console.log(self.flight_data);
    // console.log(store.flight_search_result);
    // console.log(self.flight_search_result);
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
</style>
