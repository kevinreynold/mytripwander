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

    <div class="list-block hotel-city-search-result">
      <slot v-if="hotel_city_search_result.length > 0">
        <hotel_card class="dynamic-component" v-for="hotel_detail in hotel_city_search_result" :key="hotel_detail.id" :hotel_detail="hotel_detail"/>
      </slot>
      <slot v-else-if="hotel_city_search_result.length == 0">
        <f7-block class="not-found" inner>
          Not found any hotels. Please try another filter :)
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
              <f7-list-item radio name="my-radio-popularity" value="1" title="Popularity" @click="sortBy('popularity')"></f7-list-item>
              <f7-list-item radio name="my-radio-guest-rating" value="2" title="Guest Rating" @click="sortBy('guest_rating')"></f7-list-item>
              <f7-list-item radio name="my-radio-star-rating" value="3" title="Star Rating" @click="sortBy('star_rating')"></f7-list-item>
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

        <div class="filter-title"><span>Guest Rating</span></div>
        <div class="filter-box">
          <input type="text" id="guest_rating_filter" name="guest_rating_filter" value="" />
        </div>

        <div class="filter-title"><span>Star Rating</span></div>
        <div class="filter-box">
          <f7-list class="no-margin sort-filter" form inner no-hairlines>
            <f7-list-item checkbox name="my-checkbox-5-stars" value="0" title="5 Stars" @click="starFilter(5)"></f7-list-item>
            <f7-list-item checkbox name="my-checkbox-4-stars" value="1" title="4 Stars" @click="starFilter(4)"></f7-list-item>
            <f7-list-item checkbox name="my-checkbox-3-stars" value="2" title="3 Stars" @click="starFilter(3)"></f7-list-item>
            <f7-list-item checkbox name="my-checkbox-2-stars" value="3" title="2 Stars" @click="starFilter(2)"></f7-list-item>
            <f7-list-item checkbox name="my-checkbox-1-stars" value="4" title="1 Stars" @click="starFilter(1)"></f7-list-item>
            <f7-list-item checkbox name="my-checkbox-0-stars" value="5" title="Unrated" @click="starFilter(0)"></f7-list-item>
          </f7-list>
        </div>
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

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>
  </f7-page>
</template>

<script>
import hotel_card from '../components/hotel-card'
import store from '../js/store'

import ion_rangeslider from 'ion-rangeslider'
import ion_rangeslider_CSS from 'ion-rangeslider/css/ion.rangeSlider.css'
import ion_rangeslider_CSS_flat from '../css/ion.rangeSlider.skinCustom.css'

let self;

function doInfiniteScroll(items_per_load = 3){
  //INFINITE SCROLL
  var $$ = window.Dom7;
  // Loading flag
  var loading = false;
  // Last loaded index
  var lastIndex = $$('.hotel-city-search-result .dynamic-component').length;
  // console.log(lastIndex);
  var maxItems = self.hotel_city_search_result_full.length;
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
          $$(".hotel-city-search-result").append("<div style='width: 100%;height: 30px;'></div>");
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
          self.hotel_city_search_result.push(self.hotel_city_search_result_full[i]);
        }
      }, 750);

      // Update last loaded index
      lastIndex = $$('.hotel-city-search-result .dynamic-component').length;
      // console.log("l :" + lastIndex);
    });
  }
  else{
    window.f7.detachInfiniteScroll($$('.infinite-scroll'));
    $$('.infinite-scroll-preloader').remove();
  }
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

function refreshPage(){
  self.scrollUp();
  window.f7.showPreloader();
  setTimeout(function () {
    store.hotel_sort_by = self.sort_by;
    store.hotel_price_filter.from = self.price_filter.from;
    store.hotel_price_filter.to = self.price_filter.to;

    store.guest_rating_filter.from = self.guest_rating_filter.from;
    store.guest_rating_filter.to = self.guest_rating_filter.to;

    // store.hotel_star_filter = self.hotel_star_filter;

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
    store.hotel_city_search_result = copy(store.original_hotel_city_search_result);
    store.hotel_sort_by = "popularity";
    store.hotel_price_filter = {
      from: 0,
      to: 0
    };
    store.guest_rating_filter = {
      from: 0,
      to: 10
    };

    store.hotel_star_filter = [true, true, true, true, true, true];

    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    window.f7.closeModal("#popup-filter", true);
    window.f7.closeModal("#popup-sort", true);
    window.f7.hidePreloader();
    window.f7.addNotification({
        message: store.hotel_city_search_result.length + ' tickets found.',
        hold: 1500
    });
  }, 1500);
}

function sortSearchResult(){
  if (self.sort_by === "price") {
    self.hotel_city_search_result_full.sort((a,b) => a.minPriceTotal - b.minPriceTotal);
  }
  else if (self.sort_by === "popularity") {
    self.hotel_city_search_result_full.sort((a,b) => b.popularity - a.popularity);
  }
  else if (self.sort_by === "guest_rating") {
    self.hotel_city_search_result_full.sort((a,b) => b.rating - a.rating);
  }
  else if (self.sort_by === "star_rating") {
    self.hotel_city_search_result_full.sort((a,b) => b.stars - a.stars);
  }
  store.hotel_city_search_result = self.hotel_city_search_result_full;
}

function filterSearchResult(x){
  let answer = false;
  if(x.minPriceTotal >= self.price_filter.from && x.minPriceTotal <= self.price_filter.to){
    answer = true;
  }
  else{
    return false;
  }

  if((x.rating/10) >= self.guest_rating_filter.from && (x.rating/10) <= self.guest_rating_filter.to){
    answer = true;
  }
  else{
    return false;
  }

  let star_answer = false;
  for(let i=0; i<6; i++){
    if(self.star_filter[i] === true && i === x.stars){
      star_answer = true;
      break;
    }
  }
  if(!star_answer){
    return false;
  }

  return answer;
}

export default {
  components: {
    hotel_card
  },
  data: () => ({
    hotel_booking_data: {},
    hotel_city_search_result: [],
    sort_by: "popularity",
    price: {
      min: 0,
      max: 0,
      value: 0
    },
    price_filter: {
      from: 0,
      to: 0
    },
    guest_rating_filter: {
      from: 0,
      to: 10
    },
    star_filter: [false, false, false, false, false, false]
  }),
  computed: {
    title(){
      let checkin = new Date(self.hotel_booking_data.checkin);
      let checkout = new Date(self.hotel_booking_data.checkout);
      let mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      let checkin_day = checkin.getDate();
      let checkin_month = mon[checkin.getMonth()];

      let checkout_day = checkout.getDate();
      let checkout_month = mon[checkout.getMonth()];

      return checkin_day + " " + checkin_month + " - " + checkout_day + " " + checkout_month;
    }
  },
  mounted() {
    doInfiniteScroll();

    self.sort_by = store.hotel_sort_by;
    if(self.sort_by === "price")
      $("input[name='my-radio-price']").prop("checked",true);
    else if(self.sort_by === "popularity")
      $("input[name='my-radio-popularity']").prop("checked",true);
    else if(self.sort_by === "guest_rating")
      $("input[name='my-radio-guest-rating']").prop("checked",true);
    else if(self.sort_by === "star_rating")
      $("input[name='my-radio-star-rating']").prop("checked",true);

    self.star_filter = store.hotel_star_filter;
    for(let i=0; i<6; i++){
      let element = "input[name='my-checkbox-" + i + "-stars']";
      $(element).prop("checked", self.star_filter[i]);
    }

    // filter data
    if(store.hotel_price_filter.from == 0){
      self.price_filter.from = self.price.min;
      self.price_filter.to = self.price.max;
    }
    else{
      self.price_filter.from = store.hotel_price_filter.from;
      self.price_filter.to = store.hotel_price_filter.to;
    }

    self.guest_rating_filter.from = store.guest_rating_filter.from;
    self.guest_rating_filter.to = store.guest_rating_filter.to;

    $(document).ready(function(){
      $("#price_filter").ionRangeSlider({
        type: "double",
        min: self.price.min,
        max: self.price.max,
        prefix: "$",
        from: self.price_filter.from,
        to: self.price_filter.to
      });
      $("#guest_rating_filter").ionRangeSlider({
        type: "double",
        min: 0,
        max: 10,
        step: 0.1,
        from: self.guest_rating_filter.from,
        to: self.guest_rating_filter.to
      });
    });
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.hotel_booking_data = store.hotel_booking_data;

    self.original_hotel_city_search_result = copy(store.original_hotel_city_search_result);
    self.hotel_city_search_result_full = copy(store.hotel_city_search_result);

    self.hotel_city_search_result = self.hotel_city_search_result_full.slice(0,3);

    let sort_data = copy(self.original_hotel_city_search_result);
    sort_data.sort((a, b) => a.minPriceTotal - b.minPriceTotal);

    self.price.min = sort_data[0].minPriceTotal;
    self.price.max = sort_data[sort_data.length-1].minPriceTotal;
    self.price.value = self.price.min;

    // console.log(self.original_hotel_city_search_result.length);
    // console.log(self.hotel_city_search_result_full.length);
    //
    // console.log(self.hotel_city_search_result_full);
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
      refreshPage();
    },
    starFilter(star){
      self.star_filter[star] = !self.star_filter[star];
    },
    doFilter(){
      let price_filter_data = $("#price_filter").data("ionRangeSlider");
      let guest_rating_filter_data = $("#guest_rating_filter").data("ionRangeSlider");

      self.price_filter.from = price_filter_data.result.from;
      self.price_filter.to = price_filter_data.result.to;

      self.guest_rating_filter.from = guest_rating_filter_data.result.from;
      self.guest_rating_filter.to = guest_rating_filter_data.result.to;

      self.hotel_city_search_result_full = self.original_hotel_city_search_result;
      self.hotel_city_search_result_full = self.hotel_city_search_result_full.filter(filterSearchResult);
      sortSearchResult();
      refreshPage();
      if(self.hotel_city_search_result_full.length > 0){
        window.f7.addNotification({
            message: self.hotel_city_search_result_full.length + ' hotels found.',
            hold: 1500
        });
      }
      else {
        window.f7.addNotification({
            message: '0 hotel found.',
            hold: 1500
        });
      }
    },
    resetFilter(){
      resetFilters();
    },
    clearData(){
      store.hotel_booking_data = [];
      store.original_hotel_city_search_result = [];
      store.hotel_city_search_result = [];
      store.hotel_sort_by = "popularity";
      store.hotel_star_filter = [true, true, true, true, true, true];
      store.hotel_price_filter = {
        from: 0,
        to: 0
      };
      store.guest_rating_filter = {
        from: 0,
        to: 10
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

  .hotel-city-search-result{
    margin-top: 75px;
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

  .checked{
    color:orange;
  }
</style>
