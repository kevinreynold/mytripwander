<template>
  <f7-page>
    <!-- <f7-navbar :title="list_destination.country_name + ' | ' + totalDaysTrip + ' Days'" back-link="Back" sliding no-shadow></f7-navbar> -->
    <f7-navbar sliding no-shadow>
      <f7-nav-left>
        <f7-link @click="backToCountry"><f7-icon f7="arrow_left"/></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        {{list_destination.country_name + ' | ' + totalDaysTrip + ' Days'}}
      </f7-nav-center>
    </f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab11" tab-link active text="Overview"></f7-link>
      <f7-link href="#tab22" tab-link text="Hotel"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab11" active>

        <div class="list-day">

          <slot v-if="trip_city_plan_data_one.already_open" v-for="city, city_index in trip_city_plan_data_one.cities">
            <f7-card v-for="day, day_index in city.list_dest_trip" :key="day.key" class='city-card'>
              <!-- <f7-card-header class="city-card-header">
                <div>{{city_index}} - {{day_index}}</div>
              </f7-card-header> -->
              <f7-card-content :inner="false">
                <div class="city-display" :style="city_image_url" valign="bottom">
                  <div class="overlay">
                    <div class="city-day">Day - {{getCurrentDay(city_index, day_index)}}</div>
                    <div class="city-info">
                      <div class="city-info-img"><img src="../assets/hotel-icon/location-white.png" alt="adult" width="30px"></div>
                      <div class="city-info-value">{{day.list_place.length}}</div>
                    </div>
                    <div class="city-title">{{city.city_name}}</div>
                    <div class="city-date">{{getTripDate(city.booking_data.checkin, day_index)}}</div>
                    <div class="city-clicked" @click="showDayRoute(city_index, day_index)"><f7-icon f7="chevron_down" color="white" size="125%"></f7-icon></div>
                  </div>
                </div>
              </f7-card-content>
            </f7-card>
          </slot>

        </div>

        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab22">
        <div class="change-city">
          <f7-button fill @click="showOrderCity">Change City and Day</f7-button>
        </div>
        <div class="list-hotel">
          <f7-card v-if="city.hotel" v-for="city, index in new_cities" :key="city.id">
            <f7-card-header class="hotel-card-header">
              <div class="hotel-city">{{city.city_name}} ({{city.day}} D)</div>
              <div class="hotel-price">${{city.hotel.rooms[0].total.toFixed(0)}}</div>
            </f7-card-header>
            <f7-card-content>
              <div class="hotel-name">{{city.hotel.name}} <span>{{(city.hotel.rating/10).toFixed(1)}}</span></div>
              <div class="room-display">
                <div class="room-desc">{{city.hotel.rooms[0].desc}}</div>
                <div class="room-detail">
                  <div>
                    <ul>
                      <li v-for="d in setFacility(city.hotel.rooms[0].options)" :key="d.key"><span><f7-icon fa="check"/></span> {{d}}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="hotel-last-search">Last Search : {{city.search_at}}</div>
            </f7-card-content>
            <f7-card-footer>
              <div class="empty"></div>
              <div class="hotel-change" @click="changeHotelBooking(city.hotel, index)">Change</div>
              <div class="hotel-desc" @click="showHotelDetail(city.hotel, index)">Detail</div>
            </f7-card-footer>
          </f7-card>
        </div>
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
    </f7-tabs>


    <f7-popup id="popup-choose-city">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Choose City</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link v-if="trip_city_plan_data_one.already_open" @click="closeChooseCity"><f7-icon f7="close"/></f7-link>
          <f7-link v-else-if="!trip_city_plan_data_one.already_open" @click="closeChooseCityFirst"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <div class="modal-container">
        <div class="choose-city-top">
          <div class="choose-city-top-title">
            Total Days: {{totalDaysTrip}}
          </div>
          <div class="choose-city-top-sort">
            <a href="#" data-sortable=".sortable-city" class="toggle-sortable"><f7-icon f7="bars"/></a>
            &nbsp;&nbsp;&nbsp;<span @click="addCity"><f7-icon style="color:#009688;" f7="add"/></span>
          </div>
        </div>

        <f7-list class="sortable-city" sortable media-list @sortable:sort="onSort" @sortable:open="onOpen" @sortable:close="onClose">
          <f7-list-item swipeout v-for="city, index in cities" :key="city.id" :title="city.city_name" :after="city.day + ' Days'" @click="changeStayDuration(city)" @swipeout:deleted="deleteCity(city)">
            <f7-swipeout-actions>
              <f7-swipeout-button delete><f7-icon f7="close"/></f7-swipeout-button>
            </f7-swipeout-actions>
            <div slot="inner">
            </div>
          </f7-list-item>
        </f7-list>

        <div class="fixed-bottom">
          <f7-button fill big @click="saveListCity">Done</f7-button>
        </div>
      </div>
    </f7-popup>

    <f7-popup id="popup-city">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>List City</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup="#popup-city"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-searchbar
      cancel-link="Cancel"
      search-list="#search-country-list"
      placeholder="Search City"
      :clear-button="true"
      ></f7-searchbar>

      <f7-list class="searchbar-not-found">
        <f7-list-item title="Nothing found"></f7-list-item>
      </f7-list>

      <f7-list class="searchbar-found" id="search-country-list">
        <f7-list-item v-for="item in list_city_available" :key="item.city_code" :title="item.city_name" @click="chooseCity(item)"></f7-list-item>
      </f7-list>
    </f7-popup>

    <f7-picker-modal id="picker-modal-city-day" theme="teal" overlay>
      <f7-navbar>
        <f7-nav-left>
          <f7-link>{{city_counter}}</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-picker="picker-modal-city-day"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-block class="modal-container" inner no-hairlines>
        <div class="stay-dur">
          <div class="stay-duration-title">Stay duration :</div>
          <div class="stay-duration">
            <div class="duration-counter">
              <div class="counter-dec" v-on:click="counter > 1 ? counter -= 1 : 1">-</div>
              <div class="counter-desc">{{counter}}</div>
              <div class="counter-inc" v-on:click="counter < 10 ? counter += 1 : 10">+</div>
            </div>
          </div>
        </div>

        <f7-button fill @click="doneChangeStay">Change</f7-button>
      </f7-block>
    </f7-picker-modal>
  </f7-page>
</template>

<script>
import store from "../js/store"
import travelpayouts from "../js/flightsearch"
import hotel_api from "../js/hotelsearch"
import plan_trip from "../js/plantrip"
import moment from "moment"

let self;

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
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
  },
  data: () => ({
    cur_day: 0,
    list_destination: {},
    trip_city_plan_data_one: [],
    //UNTUK HOTEL
    cities_original: [],
    cities: [
      {
        id: 0,
        city_name: 'Kaohsiung',
        city_code: 'KHH',
        hotel_city_id: 5806,
        day: 1,
        hotel: null
      },
      {
        id: 1,
        city_name: 'Tainan',
        city_code: 'TNN',
        hotel_city_id: 5809,
        day: 3,
        hotel: null
      },
      {
        id: 2,
        city_name: 'Hsinchu',
        city_code: 'HSZ',
        hotel_city_id: 5805,
        day: 5,
        hotel: null
      },
    ],
    new_cities: [],
    is_change: false,
    sorting: false,
    last_city_id: 0,
    counter: 0,
    city_counter: "",
    cur_old_idx: 0,
    cur_new_idx: 0,
    list_city_all: [],
    list_city_available: [],
    country_code: "TW"
  }),
  computed: {
    totalDaysTrip(){
      let res = 0;
      for (var i = 0; i < self.new_cities.length; i++) {
        res += self.new_cities[i].day;
      }
      return res;
    },
    city_image_url(){
      return ("background-image:url('" + store._url + "/assets/bg_city.jpg')");
    }
  },
  mounted() {
    window.f7.showPreloader();
    if(!self.trip_city_plan_data_one.already_open){
      window.f7.popup("#popup-choose-city", true);
    }
    window.f7.hidePreloader();
  },
  created() {
    self = this;
    self.trip_city_plan_data_one = copy(store.trip_city_plan_data[store.trip_city_plan_data_index]);
    console.log(self.trip_city_plan_data_one);

    self.list_destination = copy(store.trip_plan_data.list_destination[store.trip_city_plan_data_index]);
    self.country_code = self.list_destination.country_code;
    console.log(self.country_code);
    self.cities = copy(self.trip_city_plan_data_one.cities);
    self.cities_original = copy(self.trip_city_plan_data_one.cities);
    self.new_cities = copy(self.cities);
    let temp_cities = copy(self.cities);
    temp_cities.sort((a,b) => b.id - a.id);
    console.log('temp_cities');
    console.log(temp_cities);
    self.last_city_id = temp_cities[0].id + 1;

    self.list_city_all = copy(store.list_city_all);
    self.list_city_all = self.list_city_all.filter((x) => x.country_code === self.country_code)[0].cities;
    self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));
  },
  methods: {
    showOrderCity(){
      window.f7.popup("#popup-choose-city", true);
    },
    addCity(){
      window.f7.popup("#popup-city", true);
    },
    chooseCity(item){
      self.is_change = true;
      let list_dest_trip = [];
      let day = {
        day: 1,
        start_hour: "08:00",
        hotel_data: undefined,
        hotel_before_duration: 0,
        hotel_now_duration: 0,
        to_another_city: false,
        list_place: []
      };
      list_dest_trip.push(day);

      let temp = {
        id: self.last_city_id,
        city_name: item.city_name,
        city_code: item.city_code,
        hotel_city_id: item.hotel_city_id,
        day: 1,
        hotel: undefined,
        hotel_data: undefined,
        booking_data: undefined,
        search_at: getDateAfterDays(0),
        list_dest_trip: list_dest_trip
      };
      self.new_cities.push(temp);
      self.cities.push(temp);

      //ubah to_another_city
      for (let i = 0; i < self.new_cities.length; i++) {
        for (let j = 0; j < self.new_cities[i].list_dest_trip.length; j++) {
          if(i == 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
          else if(j == 0 && i > 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = true;
          }
          else{
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
        }
      }

      self.last_city_id = self.last_city_id + 1;

      self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));

      console.log(self.trip_city_plan_data_one);

      window.f7.showPreloader();
      setTimeout(function(){
        window.f7.closeModal("#popup-city", true);
        window.f7.hidePreloader();
      }, 500);
    },
    changeStayDuration(city){
      if(!self.sorting){
        self.cur_old_idx = self.cities.findIndex((x) => x.id === city.id);
        self.cur_new_idx = self.new_cities.findIndex((x) => x.id === city.id);
        console.log('CITY');
        console.log(city);
        console.log('NEW CITY');
        console.log(self.new_cities);
        console.log(self.cur_new_idx);
        console.log("CITIES");
        console.log(self.cities);
        console.log(self.cur_old_idx);

        self.counter = self.new_cities[self.cur_new_idx].day;
        self.city_counter = self.new_cities[self.cur_new_idx].city_name;
        window.f7.pickerModal("#picker-modal-city-day", true);
      }
    },
    doneChangeStay(){
      self.is_change = true;
      let old_city = copy(self.new_cities[self.cur_new_idx]);
      self.new_cities[self.cur_new_idx].day = self.counter;
      self.cities[self.cur_old_idx].day = self.counter;

      //kalau hari berubah list_dest_trip nya berubah
      //cari indexnya dulu -> hati2 kan harinya berubah jam buka tutupnya juga bisa ganti
      if(old_city.day >= self.new_cities[self.cur_new_idx].day){
        console.log('AA');
        //kalau durasinya lebih kecil maka tinggal slice aja
        self.new_cities[self.cur_new_idx].list_dest_trip = self.new_cities[self.cur_new_idx].list_dest_trip.slice(0, self.counter);
      }
      else{
        //kalau durasinya lebih besar maka tambah hari baru
        console.log('BB');
        let last_day = old_city.day;
        console.log(last_day);
        console.log(self.new_cities[self.cur_new_idx].day);
        for (var i = last_day; i < self.new_cities[self.cur_new_idx].day; i++) {
          let day = {
            day: (i+1),
            start_hour: "08:00",
            hotel_data: undefined,
            hotel_before_duration: 0,
            hotel_now_duration: 0,
            to_another_city: false,
            list_place: []
          };
          self.new_cities[self.cur_new_idx].list_dest_trip.push(day);
        }
      }

      //ubah to_another_city
      for (let i = 0; i < self.new_cities.length; i++) {
        for (let j = 0; j < self.new_cities[i].list_dest_trip.length; j++) {
          if(i == 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
          else if(j == 0 && i > 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = true;
          }
          else{
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
        }
      }

      window.f7.closeModal("#picker-modal-city-day", true);
    },
    deleteCity(city){
      self.is_change = true;
      let index = self.new_cities.findIndex((x) => x.id === city.id);
      self.new_cities.splice(index, 1);

      //ubah to_another_city
      for (let i = 0; i < self.new_cities.length; i++) {
        for (let j = 0; j < self.new_cities[i].list_dest_trip.length; j++) {
          if(i == 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
          else if(j == 0 && i > 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = true;
          }
          else{
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
        }
      }

      self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));
    },
    onOpen: function () {
      self.sorting = true;
    },
    onClose: function () {
      self.sorting = false;
    },
    onSort: function (event, indexes) {
      self.is_change = true;
      console.log(indexes);
      let start_index = indexes.startIndex;
      let new_index = indexes.newIndex;

      let temp = self.new_cities.splice(start_index, 1)[0];
      console.log(temp);
      self.new_cities.splice(new_index, 0, temp);

      //ubah to_another_city
      for (let i = 0; i < self.new_cities.length; i++) {
        for (let j = 0; j < self.new_cities[i].list_dest_trip.length; j++) {
          if(i == 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
          else if(j == 0 && i > 0){
            self.new_cities[i].list_dest_trip[j].to_another_city = true;
          }
          else{
            self.new_cities[i].list_dest_trip[j].to_another_city = false;
          }
        }
      }

      console.log("CITIES");
      console.log(self.cities);
      console.log("NEW CITIES");
      console.log(self.new_cities);
    },
    closeChooseCityFirst(){
      if(self.is_change){
        window.f7.confirm('Your change may not be saved.<br>Do you want to exit ?', 'Confirmation',
        function () {
          window.f7.closeModal("#popup-choose-city",true);
          plan_trip.backRefresh();
        });
      }
      else{
        window.f7.closeModal("#popup-choose-city",true);
        plan_trip.backRefresh();
      }
    },
    closeChooseCity(){
      if(self.is_change){
        window.f7.confirm('Your change may not be saved.<br>Do you want to exit ?', 'Confirmation',
        function () {
          window.f7.showPreloader();
          window.f7.closeModal("#popup-choose-city",true);
          setTimeout(function () {
            var mainView = Dom7('#main-view')[0].f7View;
            mainView.router.refreshPage();
            window.f7.hidePreloader();
          }, 1500);
        });
      }
      else{
        window.f7.closeModal("#popup-choose-city",true);
      }
    },
    saveListCity(){
      if(self.new_cities.length > 0){
        if(!self.sorting){
          store.trip_city_plan_data[store.trip_city_plan_data_index].cities = copy(self.new_cities);
          console.log(store.trip_city_plan_data);
          hotel_api.getHotelPlan();
        }
        else{
          window.f7.addNotification({
              message: 'Please close sort toggle first.',
              hold: 2500
          });
        }
      }
      else{
        window.f7.addNotification({
            message: 'At least 1 city is chosen.',
            hold: 2500
        });
      }
    },
    setFacility(options){
      let hotel_options = [];
      for(let propName in options) {
          if(options.hasOwnProperty(propName)) {
            if(propName === "deposit" && options[propName]){
              hotel_options.push("Pay now");
            }
            else if(propName === "deposit" && !options[propName]){
              hotel_options.push("Pay at the hotel");
            }
            else if(propName === "freeWifi" && options[propName]){
              hotel_options.push("Free Wi-Fi");
            }
            else if(propName === "refundable" && options[propName]){
              hotel_options.push("Refundable");
            }
            else if(propName === "refundable" && !options[propName]){
              hotel_options.push("Non-refundable");
            }
            else if(propName === "breakfast" && options[propName]){
              hotel_options.push("Breakfast");
            }
            // console.log(propName + ": " + options[propName]);
          }
      }
      hotel_options.sort();
      return hotel_options;
    },
    showHotelDetail(hotel, index){
      store.hotel_search_plan_mode = "search";
      store.hotel_booking_data = store.trip_city_plan_data[store.trip_city_plan_data_index].cities[index].booking_data;
      store.hotel_details = hotel;
      store.hotel_plan_index = index;
      console.log(index);
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/hotel-hotel-result/'});
    },
    changeHotelBooking(hotel, index){
      store.hotel_plan_index = index;
      console.log(index);
      store.hotel_details = hotel;
      hotel_api.searchAgain(true);
    },
    getTripDate(date, day_after){
      let cur_date = new Date(date);
      let date_after = new Date(cur_date.getTime() + day_after * 24 * 60 * 60 * 1000);
      let date_after_string =  date_after.getFullYear() + "-" + ("00" + (date_after.getMonth()+1)).slice(-2) + "-" + ("00" + (date_after.getDate())).slice(-2);

      let result = moment(date_after_string).format('dddd, DD MMMM YYYY');
      return result;
    },
    showDayRoute(city_index, day_index){ //day itu list_dest_trip
      let cur_date = new Date(self.trip_city_plan_data_one.cities[city_index].booking_data.checkin);
      let date_after = new Date(cur_date.getTime() + day_index * 24 * 60 * 60 * 1000);
      let cur_date_string =  date_after.getFullYear() + "-" + ("00" + (date_after.getMonth()+1)).slice(-2) + "-" + ("00" + (date_after.getDate())).slice(-2);

      //run_down
      store.coba_run_down = copy(self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].list_place);

      store.per_day_data = {
        city_index: city_index,
        day_index: day_index,
        city_code: self.trip_city_plan_data_one.cities[city_index].city_code,
        cur_date: cur_date_string,
        start_hour: self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].start_hour
      };

      //airport_mode
      if(city_index == 0 && day_index == 0){
        store.airport_mode = 'arrival';
        store.airport_arrival_data = copy(self.trip_city_plan_data_one.arrival_airport);
        store.per_day_data.arrival_duration = self.trip_city_plan_data_one.arrival_duration;
        console.log(store.airport_arrival_data.name);
      }
      else if(city_index === self.trip_city_plan_data_one.cities.length - 1 && day_index === self.trip_city_plan_data_one.cities[self.trip_city_plan_data_one.cities.length-1].list_dest_trip.length - 1){
        if(self.trip_city_plan_data_one.go_back_airport){
          store.airport_mode = 'go_back';
          store.airport_go_back_data = copy(self.trip_city_plan_data_one.go_back_airport);
          store.per_day_data.go_back_duration = self.trip_city_plan_data_one.go_back_duration;
          store.per_day_data.hotel_go_back_duration = self.trip_city_plan_data_one.hotel_go_back_duration;
          store.per_day_data.go_back_time = self.trip_city_plan_data_one.go_back.departure_airport.time;
          console.log(store.airport_go_back_data.name);
        }
      }
      else{
        store.airport_mode = 'none';
      }

      store.is_change_city = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].to_another_city;

      console.log('AIRPORT MODE : ' + store.airport_mode);
      console.log('CHANGE CITY : ' + store.is_change_city);
      console.log(JSON.stringify(store.per_day_data));

      //hotel_now
      store.hotel_now_data = copy(self.trip_city_plan_data_one.cities[city_index].hotel_data);
      store.per_day_data.hotel_now_duration = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].hotel_now_duration;

      //hotel_before
      console.log(store.hotel_now_data.name);
      if(store.is_change_city){
        store.hotel_before_data = copy(self.trip_city_plan_data_one.cities[city_index-1].hotel_data);
        store.per_day_data.hotel_before_duration = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].hotel_before_duration;
        console.log(store.hotel_before_data.name);
      }

      plan_trip.goToPerDay();
    },
    backToCountry(){
      plan_trip.backRefresh();
    },
    getCurrentDay(city_index, day_index){
      let result = 0;
      for (let i = 0; i < city_index; i++) {
        result += self.trip_city_plan_data_one.cities[i].day;
      }
      result += (day_index + 1);
      return result;
    }
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .city-card{
    border: 2px solid #009688;
  }

  .city-card-header{
    min-height: 35px;
    /* background-color: #009688; */
    /* color: white; */
  }

  .city-day{
    overflow: auto;
    text-align: left;
  }

  .remove-day{
    width: 50%;
    overflow: auto;
    text-align: right;
  }

  .city-card-content{
    height: 25vw;
  }

  .hotel-card-header{
    min-height: 40px;
  }

  .hotel-city{
    font-size: 0.8em;
    font-weight: bold;
    color: rgba(0,0,0,0.7);
  }

  .hotel-price{
    text-align: right;
    font-weight: bold;
    color: #2C3E50;
  }

  .hotel-name{
    color: #009688;
    font-size: 1.1em;
  }

  .hotel-name span{
    margin-left: 2px;
    font-size: 1em;
    padding: 3px;
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #009688;
    background: #009688;
    color: white;
    font-size: 0.8em;
    border-radius: 5px;
  }

  /* ROOM DISPLAY */
  .room-display{
    width: 95%;
    padding: 2%;
    margin-top: 5px;
    padding-bottom: 4%;
    overflow: auto;
    border: 1.5px solid #009688;
    border-radius: 2px;
  }

  .room-desc{
    font-size: 1em;
    font-weight: 475;
  }

  .room-detail{
    overflow: auto;
    margin-top: 5px;
    margin-bottom: -17px;
  }

  .room-detail ul{
    font-size: 0.9em;
    margin-top: -2px;
    margin-left: -10%;
    list-style-type: none;
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
  }

  .room-detail ul li{
    padding-bottom: 5px;
  }

  .room-detail ul li:first-child{
    padding-top: 5px;
  }

  .room-detail ul li span{
    color: #009688;
  }

  /*      */
  .empty{
    width: 52%;
  }

  .hotel-change{
    width: 20%;
    padding-top: 4px;
    padding-bottom: 4px;
    overflow: auto;
    border: 1px solid #009688;
    color: #009688;
    text-align: center;
    border-radius: 3px;
    font-size: 0.9em;
  }

  .hotel-desc{
    width: 20%;
    padding-top: 4px;
    padding-bottom: 4px;
    overflow: auto;
    background-color: #009688;
    border: 1px solid #009688;
    color: white;
    text-align: center;
    border-radius: 3px;
    font-size: 0.9em;
  }

  .hotel-last-search{
    width: 100%;
    font-size: 0.85em;
    overflow: auto;
    margin-top: 18px;
    margin-bottom: -10px;
    text-align: left;
  }

  .change-city{
    margin: 8px;
  }

  .modal-container{
    margin: 2.5%;
    width: 95%;
    overflow: auto;
  }

  .sortable-city ul li{
    margin-bottom: 10px;
  }

  .stay-dur{
    width: 100%;
    overflow: auto;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .stay-duration-title{
    width: 40%;
    overflow: auto;
    text-align: left;
    margin-top: 2px;
    font-size: 1.2em;
    font-weight: 400;
    float: left;
  }

  .stay-duration{
    width: 60%;
    overflow: auto;
    margin: auto;
    text-align: right;
    text-align-last: center;
    font-size: 1.3em;
    font-weight: 400;
    color: #009688;
    float: left;
  }

  .duration-counter{
    width: 60%;
    overflow: auto;
    margin: auto;
  }

  .duration-counter div{
    width: 30%;
    height: 27px;
    border: 1.5px solid black;
    font-size: 1em;
    font-weight: 400;
    padding-top: 0;
    text-align: center;
    float: left;
  }

  .duration-counter .counter-dec{
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    color:red;
  }

  .duration-counter .counter-desc{
    border-left: none !important;
    border-right: none !important;
  }

  .duration-counter .counter-inc{
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    color:green;
  }

  .choose-city-top{
    width: 95%;
    overflow: auto;
    margin: 2.5%;
    font-size: 1.1em;
  }

  .choose-city-top-title{
    width: 50%;
    overflow: auto;
    float: left;
    text-align: left;
  }

  .choose-city-top-sort{
    width: 50%;
    overflow: auto;
    float: left;
    text-align: right;
  }

  .sortable-city{
    margin-top: 20px;
  }

  .fixed-bottom {
   position:fixed;
   left:0px;
   bottom:0px;
   width:100%;
   overflow: auto;
   z-index: 5000;
 }

 .city-display{
   position: relative;
   width: 100%;
   height: 47vw;
   background-size: cover;
   background-position: center;
 }

 .overlay {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0,0,0,0.5);
 }

 .city-day{
   position: absolute;
   top: 5px;
   left: 5px;
   color: white;
   font-size: 1.2em;
 }

 .city-info{
   position: absolute;
   top: 3px;
   right: 2px;
 }

 .city-info-img{
   width: 30px;
   padding-right: 0px;
   padding-top: 2px;
 }

 .city-info-value{
   width: 15px;
   padding-top: 5px;
   font-size: 1.1em;
 }

 .city-info div{
   overflow: auto;
   float: left;
   margin-right: 0px;
   color: white;
 }

 .city-title{
   position: absolute;
   top: 40%;
   left: 0%;
   width: 100%;
   text-align: center;
   color: white;
   transform: translateY(-50%);
   font-size: 1.7em;
 }

 .city-date{
   position: absolute;
   top: 60%;
   left: 0%;
   width: 100%;
   text-align: center;
   color: white;
   transform: translateY(-50%);
   font-size: 1.2em;
 }

 .city-clicked{
   position: absolute;
   text-align: center;
   bottom: -5px;
   right: 15px;
   color: white;
   transform: translateY(-50%);
   font-size: 1.2em;
 }
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
