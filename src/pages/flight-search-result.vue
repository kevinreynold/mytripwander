<template>
  <f7-page infinite-scroll>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <div id="filter-box">
      <f7-grid>
        <f7-col width="10"></f7-col>
        <f7-col width="35">
          <div @click="showFilter"><f7-icon f7="filter" size="180%"/></div>
        </f7-col>
        <f7-col width="10"><div class="separator"></div></f7-col>
        <f7-col width="35">
          <div @click="showSort"><f7-icon f7="sort" size="180%"/></div>
        </f7-col>
        <f7-col width="10"></f7-col>
      </f7-grid>
    </div>

    <div id="scroll-to-top"/>

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>

    <div class="list-block flight-search-result">
      <slot v-if="flight_search_result.length > 0">
        <flight_card class="dynamic-component" v-for="flight_detail in flight_search_result" :key="flight_detail.url" :flight_detail="flight_detail"/>
      </slot>
      <slot v-else-if="flight_search_result.length == 0">
        <f7-block class="not-found" inner>
          Not found any tickets. Please try another filter :)
        </f7-block>
      </slot>
    </div>

    <f7-popup id="popup-sort">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Sort</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup="#popup-sort"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

        <div class="modal-container">
          <div class="filter-title"><span>Sort By</span></div>
          <div class="filter-box">
            <f7-list class="no-margin sort-filter" form inner no-hairlines>
              <f7-list-item radio name="my-radio-price" value="0" title="Price" @click="sortBy('price')"></f7-list-item>
              <f7-list-item radio name="my-radio-o-d" value="1" title="Outbond Departure Time" @click="sortBy('outbond_departure')"></f7-list-item>
              <f7-list-item radio name="my-radio-o-a" value="2" title="Outbond Arrival Time" @click="sortBy('outbond_arrival')"></f7-list-item>
              <slot v-if="flight_data.length > 1">
                <f7-list-item radio name="my-radio-r-d" value="1" title="Return Departure Time" @click="sortBy('return_departure')"></f7-list-item>
                <f7-list-item radio name="my-radio-r-a" value="2" title="Return Arrival Time" @click="sortBy('return_arrival')"></f7-list-item>
              </slot>
              <f7-list-item radio name="my-radio-duration" value="3" title="Duration" @click="sortBy('duration')"></f7-list-item>
            </f7-list>
          </div>
        </div>
      </f7-navbar>
    </f7-popup>

    <f7-popup id="popup-filter">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Filter</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup="#popup-filter"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <div class="modal-container">
        <div class="filter-title"><span>Price</span></div>
        <div class="filter-box">
          <input type="text" id="price_filter" name="price_filter" value="" />
        </div>

        <div class="filter-title"><span>Outbond Departure, {{flight_data[0].origin_name}}</span></div>
        <div class="filter-box">
          <input type="text" id="outbond_departure" name="outbond_departure" value="" />
        </div>
        <div class="filter-title"><span>Outbond Arrival, {{flight_data[0].destination_name}}</span></div>
        <div class="filter-box">
          <input type="text" id="outbond_arrival" name="outbond_arrival" value="" />
        </div>

        <slot v-if="flight_data.length > 1">
          <div class="filter-title"><span>Return Departure, {{flight_data[1].origin_name}}</span></div>
          <div class="filter-box">
            <input type="text" id="return_departure" name="return_departure" value="" />
          </div>
          <div class="filter-title"><span>Return Arrival, {{flight_data[1].destination_name}}</span></div>
          <div class="filter-box">
            <input type="text" id="return_arrival" name="return_arrival" value="" />
          </div>
        </slot>
      </div>
      <f7-block class="button-margin" inner no-hairlines>
        <f7-grid>
          <f7-col width="75">
            <f7-button fill color="teal" @click="doFilter">Apply Filters</f7-button>
          </f7-col>
          <f7-col width="25">
            <f7-button fill color="teal" @click="resetFilter">Reset</f7-button>
          </f7-col>
        </f7-grid>
      </f7-block>
    </f7-popup>
  </f7-page>
</template>

<script>
import flight_card from '../components/flight-card'
import store from '../js/store'

import ion_rangeslider from 'ion-rangeslider'
import ion_rangeslider_CSS from 'ion-rangeslider/css/ion.rangeSlider.css'
import ion_rangeslider_CSS_flat from '../css/ion.rangeSlider.skinCustom.css'

let self;

function doInfiniteScroll(items_per_load = 5){
  //INFINITE SCROLL
  var $$ = window.Dom7;
  // Loading flag
  var loading = false;
  // Last loaded index
  var lastIndex = $$('.flight-search-result .dynamic-component').length;
  // console.log(lastIndex);
  var maxItems = self.flight_search_result_full.length;
  // Append items per load
  var itemsPerLoad = items_per_load;
  // Attach 'infinite' event handler
  if(maxItems > items_per_load){
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
          self.flight_search_result.push(self.flight_search_result_full[i]);
        }
      }, 750);

      // Update last loaded index
      lastIndex = $$('.flight-search-result .dynamic-component').length;
      // console.log("l :" + lastIndex);
    });
  }
  else{
    window.f7.detachInfiniteScroll($$('.infinite-scroll'));
    $$('.infinite-scroll-preloader').remove();
  }
}

function resetInfiniteScroll(type){
  self.scrollUp();
  window.f7.showPreloader();
  setTimeout(function () {
    if(type === "sort"){
      store.sort_by = self.sort_by;
    }
    else{
      store.price_filter.from = self.price_filter.from;
      store.price_filter.to = self.price_filter.to;

      store.outbond_departure.from = self.outbond_departure.from;
      store.outbond_departure.to = self.outbond_departure.to;
      store.outbond_arrival.from = self.outbond_arrival.from;
      store.outbond_arrival.to = self.outbond_arrival.to;

      store.return_departure.from = self.return_departure.from;
      store.return_departure.to = self.return_departure.to;
      store.return_arrival.from = self.return_arrival.from;
      store.return_arrival.to = self.return_arrival.to;
    }
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    window.f7.closeModal("#popup-filter", true);
    window.f7.closeModal("#popup-sort", true);
    window.f7.hidePreloader();
  }, 1500);
}

function resetFilters(){
  self.scrollUp();
  window.f7.showPreloader();
  setTimeout(function () {
    store.flight_search_result = copy(store.original_flight_search_result);
    store.sort_by = "price";
    store.price_filter = {
      from: 0,
      to: 0
    };
    store.outbond_departure = {
      from : 0,
      to: 48
    };
    store.outbond_arrival = {
      from : 0,
      to: 48
    };
    store.return_departure = {
      from : 0,
      to: 48
    };
    store.return_arrival = {
      from : 0,
      to: 48
    };
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    window.f7.closeModal("#popup-filter", true);
    window.f7.closeModal("#popup-sort", true);
    window.f7.hidePreloader();
    window.f7.addNotification({
        message: store.flight_search_result.length + ' tickets found.',
        hold: 2500
    });
  }, 1500);
}

function get24Hours(interval = 30){
  let start = 0;
  let result = [];

  for(let i=0; i < Math.floor(60/interval)*24; i++ ){
    let hours = Math.floor(start / 60);
    let minutes = start % 60;

    let temp = ("00" + hours).slice(-2) + ":" +("00" + minutes).slice(-2);
    result.push(temp);

    start += interval;
  }
  result.push("23:59");
  return result;
}

function sortSearchResult(){
  if (self.sort_by === "price") {
    self.flight_search_result_full.sort((a,b) => a.unified_price - b.unified_price);
  }
  else if (self.sort_by === "outbond_departure") {
    self.flight_search_result_full.sort((a,b) => new Date('1970/01/01 ' + a.display[0].departure_airport.time) - new Date('1970/01/01 ' + b.display[0].departure_airport.time));
  }
  else if (self.sort_by === "outbond_arrival") {
    self.flight_search_result_full.sort((a,b) => new Date('1970/01/01 ' + a.display[0].arrival_airport.time) - new Date('1970/01/01 ' + b.display[0].arrival_airport.time));
  }
  else if (self.sort_by === "return_departure") {
    self.flight_search_result_full.sort((a,b) => new Date('1970/01/01 ' + a.display[1].departure_airport.time) - new Date('1970/01/01 ' + b.display[1].departure_airport.time));
  }
  else if (self.sort_by === "return_arrival") {
    self.flight_search_result_full.sort((a,b) => new Date('1970/01/01 ' + a.display[1].arrival_airport.time) - new Date('1970/01/01 ' + b.display[1].arrival_airport.time));
  }
  else if (self.sort_by === "duration") {
    self.flight_search_result_full.sort((a,b) => a.total_duration - b.total_duration);
  }

  store.flight_search_result = self.flight_search_result_full;
}

function filterSearchResult(x){
  let answer = false;
  if(x.price >= self.price_filter.from && x.price <= self.price_filter.to){
    answer = true;
  }
  else{
    return false;
  }

  if(new Date('1970/01/01 ' + x.display[0].departure_airport.time) >= new Date('1970/01/01 ' + self.outbond_departure.from_value) && new Date('1970/01/01 ' + x.display[0].departure_airport.time) <= new Date('1970/01/01 ' + self.outbond_departure.to_value)){
    answer = true;
  }
  else{
    return false;
  }

  if(new Date('1970/01/01 ' + x.display[0].arrival_airport.time) >= new Date('1970/01/01 ' + self.outbond_arrival.from_value) && new Date('1970/01/01 ' + x.display[0].arrival_airport.time) <= new Date('1970/01/01 ' + self.outbond_arrival.to_value)){
    answer = true;
  }
  else{
    return false;
  }

  if(self.flight_data.length > 1){
    if(new Date('1970/01/01 ' + x.display[1].departure_airport.time) >= new Date('1970/01/01 ' + self.return_departure.from_value) && new Date('1970/01/01 ' + x.display[1].departure_airport.time) <= new Date('1970/01/01 ' + self.return_departure.to_value)){
      answer = true;
    }
    else{
      return false;
    }

    if(new Date('1970/01/01 ' + x.display[1].arrival_airport.time) >= new Date('1970/01/01 ' + self.return_arrival.from_value) && new Date('1970/01/01 ' + x.display[1].arrival_airport.time) <= new Date('1970/01/01 ' + self.return_arrival.to_value)){
      answer = true;
    }
    else{
      return false;
    }
  }

  return answer;
}

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

export default {
  components: {
    flight_card
  },
  data: () => ({
    original_flight_search_result : [],
    flight_search_result_full : [],
    flight_search_result : [],
    flight_data : [],
    price: {
      min: 0,
      max: 0,
      value: 0
    },
    sort_by: 'price',
    price_filter: {
      from: 0,
      to: 0
    },
    outbond_departure: {
      from : 0,
      to: 48,
      from_value : "00:00",
      to_value: "23:59"
    },
    outbond_arrival: {
      from : 0,
      to: 48,
      from_value : "00:00",
      to_value: "23:59"
    },
    return_departure: {
      from : 0,
      to: 48,
      from_value : "00:00",
      to_value: "23:59"
    },
    return_arrival: {
      from : 0,
      to: 48,
      from_value : "00:00",
      to_value: "23:59"
    }
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
    doInfiniteScroll();
    // sort data
    self.sort_by = store.sort_by;
    if(self.sort_by === "price")
      $("input[name='my-radio-price']").prop("checked",true);
    else if(self.sort_by === "outbond_departure")
      $("input[name='my-radio-o-d']").prop("checked",true);
    else if(self.sort_by === "outbond_arrival")
      $("input[name='my-radio-o-a']").prop("checked",true);
    else if(self.sort_by === "return_departure")
      $("input[name='my-radio-r-d']").prop("checked",true);
    else if(self.sort_by === "return_arrival")
      $("input[name='my-radio-r-a']").prop("checked",true);
    else if(self.sort_by === "duration")
      $("input[name='my-radio-duration']").prop("checked",true);

    // filter data
    if(store.price_filter.from == 0){
      self.price_filter.from = self.price.min;
      self.price_filter.to = self.price.max;
    }
    else{
      self.price_filter.from = store.price_filter.from;
      self.price_filter.to = store.price_filter.to;
    }

    self.outbond_departure.from = store.outbond_departure.from;
    self.outbond_departure.to = store.outbond_departure.to;
    self.outbond_arrival.from = store.outbond_arrival.from;
    self.outbond_arrival.to = store.outbond_arrival.to;

    self.return_departure.from = store.return_departure.from;
    self.return_departure.to = store.return_departure.to;
    self.return_arrival.from = store.return_arrival.from;
    self.return_arrival.to = store.return_arrival.to;

    //filter
    $(document).ready(function(){
      $("#price_filter").ionRangeSlider({
        type: "double",
        min: self.price.min,
        max: self.price.max,
        prefix: "$",
        from: self.price_filter.from,
        to: self.price_filter.to
      });
      $("#outbond_departure").ionRangeSlider({
        type: "double",
        grid: false,
        values: get24Hours(),
        from: self.outbond_departure.from,
        to: self.outbond_departure.to
      });
      $("#outbond_arrival").ionRangeSlider({
        type: "double",
        grid: false,
        values: get24Hours(),
        from: self.outbond_arrival.from,
        to: self.outbond_arrival.to
      });
      $("#return_departure").ionRangeSlider({
        type: "double",
        grid: false,
        values: get24Hours(),
        from: self.return_departure.from,
        to: self.return_departure.to
      });
      $("#return_arrival").ionRangeSlider({
        type: "double",
        grid: false,
        values: get24Hours(),
        from: self.return_arrival.from,
        to: self.return_arrival.to
      });
    });
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.flight_data = store.flight_booking_data;
    // console.log(store.original_flight_search_result);

    // console.log(store.sort_by);
    // console.log(store.price_filter);
    // console.log(store.outbond_departure);
    // console.log(store.outbond_arrival);
    // console.log(store.return_departure);
    // console.log(store.return_arrival);

    // store.flight_search_result = store.flight_search_result.slice(0,12);
    self.original_flight_search_result = copy(store.original_flight_search_result);
    self.flight_search_result_full = copy(store.flight_search_result);
    self.flight_search_result = copy(self.flight_search_result_full);

    // console.log(self.original_flight_search_result.length);
    // console.log(self.flight_search_result_full.length);

    self.price.min = self.original_flight_search_result[0].price;
    self.price.max = self.original_flight_search_result[self.original_flight_search_result.length-1].price;
    self.price.value = self.price.min;

    self.flight_search_result = self.flight_search_result.slice(0, 5);
    // console.log(JSON.stringify(self.flight_data));
    // console.log(JSON.stringify(store.flight_search_result[0]));
    // console.log(self.flight_search_result);
    // console.log(store.price_filter);
    // console.log(JSON.stringify(self.price));
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    },
    showFilter(){
      window.f7.popup("#popup-filter", true);
    },
    showSort(){
      window.f7.popup("#popup-sort", true);
    },
    sortBy(type){
      self.sort_by = type;
      sortSearchResult();
      resetInfiniteScroll("sort");
    },
    doFilter(){
      let price_filter_data = $("#price_filter").data("ionRangeSlider");
      let outbond_departure_data = $("#outbond_departure").data("ionRangeSlider");
      let outbond_arrival_data = $("#outbond_arrival").data("ionRangeSlider");
      self.price_filter.from = price_filter_data.result.from;
      self.price_filter.to = price_filter_data.result.to;

      self.outbond_departure.from = outbond_departure_data.result.from;
      self.outbond_departure.to = outbond_departure_data.result.to;
      self.outbond_departure.from_value = outbond_departure_data.result.from_value;
      self.outbond_departure.to_value = outbond_departure_data.result.to_value;

      self.outbond_arrival.from = outbond_arrival_data.result.from;
      self.outbond_arrival.to = outbond_arrival_data.result.to;
      self.outbond_arrival.from_value = outbond_arrival_data.result.from_value;
      self.outbond_arrival.to_value = outbond_arrival_data.result.to_value;

      if(self.flight_data.length > 1){
        let return_departure_data = $("#return_departure").data("ionRangeSlider");
        let return_arrival_data = $("#return_arrival").data("ionRangeSlider");

        self.return_departure.from = return_departure_data.result.from;
        self.return_departure.to = return_departure_data.result.to;
        self.return_departure.from_value = return_departure_data.result.from_value;
        self.return_departure.to_value = return_departure_data.result.to_value;

        self.return_arrival.from = return_arrival_data.result.from;
        self.return_arrival.to = return_arrival_data.result.to;
        self.return_arrival.from_value = return_arrival_data.result.from_value;
        self.return_arrival.to_value = return_arrival_data.result.to_value;
      }

      self.flight_search_result_full = self.original_flight_search_result;
      self.flight_search_result_full = self.flight_search_result_full.filter(filterSearchResult);
      sortSearchResult();
      resetInfiniteScroll("filter");
      if(self.flight_search_result_full.length > 0){
        window.f7.addNotification({
            message: self.flight_search_result_full.length + ' tickets found.',
            hold: 2500
        });
      }
      else {
        window.f7.addNotification({
            message: '0 ticket found.',
            hold: 2500
        });
      }
    },
    resetFilter(){
      resetFilters();
    },
    clearData(){
      store.flight_search_result = [];
      store.original_flight_search_result = [];
      store.flight_booking_data = [];
      store.sort_by =  "price";
      store.price_filter = {
        from: 0,
        to: 0
      };
      store.outbond_departure = {
        from : 0,
        to: 48
      };
      store.outbond_arrival = {
        from : 0,
        to: 48
      };
      store.return_departure = {
        from : 0,
        to: 48
      };
      store.return_arrival = {
        from : 0,
        to: 48
      };

    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }

  #filter-box{
    z-index: 5000;
  	position:fixed;
  	width:30%;
  	height:40px;
  	top:70px;
  	left:35%;
  	background-color: rgba(0, 150, 135, 0.75);
  	color:#FFF;
  	border-radius:50px;
  	text-align:center;
  	box-shadow: 1px 1px 2px #999;
    padding-top: 15px;
  }

  .separator{
    width: 0px;
    height: 20px;
    border: 1px solid white;
  }

  .not-found{
    padding-top: 60px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
  }

  .modal-container{
    margin-top: 0;
  }

  .modal-container div{
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .no-margin{
    margin: 0;
  }

  .less-margin{
    margin: 0;
    margin-top: -5%;
  }

  .button-margin{
    margin:0;
  }

  .sort-filter{
    font-size: 1em;
  }

  .filter-title{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.135);
    margin-bottom: 10px;
    color: #009688;
    font-size: 1.3em;
  }

  .filter-title span{
    margin-left: 16px;
  }

  .filter-box{
    width: 85%;
    margin:auto;
    margin-top: -10px;
  }

</style>
