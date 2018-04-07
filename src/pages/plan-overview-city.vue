<template>
  <f7-page>
    <f7-navbar title="Hongkong | 5 Days" back-link="Back" sliding no-shadow></f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab11" tab-link active text="Overview"></f7-link>
      <f7-link href="#tab22" tab-link text="Hotel"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab11" active>
        <div class="list-day">
          <f7-card v-for="d,index in day" :key="d.key">
            <f7-card-header class="city-card-header">
              <div class="city-day">Day - {{d}}</div>
              <div class="remove-day">
                <span v-if="index > 0"><f7-icon f7="close"/></span>
              </div>
            </f7-card-header>
            <f7-card-content>
              <div class="city-card-content"></div>
            </f7-card-content>
          </f7-card>
        </div>
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab22">
        <div class="list-hotel">
          <f7-card v-if="city.hotel" v-for="city in new_cities" :key="city.id">
            <f7-card-header class="hotel-card-header">
              <div class="hotel-city">{{city.city_name}}</div>
              <div class="hotel-price">${{city.hotel.minPriceTotal.toFixed(0)}}</div>
            </f7-card-header>
            <f7-card-content>
              <div class="hotel-name">{{city.hotel.name}} <span>{{(city.hotel.rating/10).toFixed(1)}}</span></div>
              <div class="room-display">
                <div class="room-desc">{{city.hotel.rooms[0].desc}}</div>
                <div class="room-detail">
                  <div>
                    <ul>
                      <li v-for="d in room_detail" :key="d.key"><span><f7-icon fa="check"/></span> {{d}}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="hotel-last-search">Last Search : 2018-04-05</div>
            </f7-card-content>
            <f7-card-footer>
              <div class="empty"></div>
              <div class="hotel-change">Change</div>
              <div class="hotel-desc">Detail</div>
            </f7-card-footer>
          </f7-card>
        </div>
        <div class="change-city">
          <f7-button fill @click="showOrderCity">Change City</f7-button>
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
          <f7-button fill @click="saveListCity">Done</f7-button>
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

let self;

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
    day: [1,2,3,4,5],
    room_detail: [],
    trip_city_plan_data_one: [],
    //UNTUK HOTEL
    cities: [
      {
        id: 0,
        city_name: 'Kaohsiung',
        city_code: 'KHH',
        zone_id: 371,
        hotel_city_id: 5806,
        day: 1,
        hotel: null
      },
      {
        id: 1,
        city_name: 'Tainan',
        city_code: 'TNN',
        zone_id: 371,
        hotel_city_id: 5809,
        day: 3,
        hotel: null
      },
      {
        id: 2,
        city_name: 'Hsinchu',
        city_code: 'HSZ',
        zone_id: 371,
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
    }
  },
  mounted() {
    plan_trip.getAllCity();
    setTimeout(function () {
      self.list_city_all = copy(store.list_city_all);
      self.list_city_all = self.list_city_all.filter((x) => x.country_code === self.country_code)[0].cities;
      self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));

      if(!self.trip_city_plan_data_one.already_open){
        window.f7.popup("#popup-choose-city", true);
      }
    }, 1000);
  },
  created() {
    self = this;
    self.trip_city_plan_data_one = copy(store.trip_city_plan_data[store.trip_city_plan_data_index]);
    console.log(self.trip_city_plan_data_one);

    self.cities = self.trip_city_plan_data_one.cities;
    self.new_cities = copy(self.cities);
    self.last_city_id = self.cities[self.cities.length-1].id + 1;
    self.room_detail.push("Pay now");
    self.room_detail.push("Pay at the hotel");
    self.room_detail.push("Free Wi-Fi");
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
      let temp = {
        id: self.last_city_id,
        city_name: item.city_name,
        city_code: item.city_code,
        zone_id: item.last_zone_id,
        hotel_city_id: item.hotel_city_id,
        day: 1,
        hotel: undefined
      };
      self.new_cities.push(temp);
      self.cities.push(temp);
      self.last_city_id = self.last_city_id + 1;

      self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));

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
        // console.log(JSON.stringify(city));
        // console.log(JSON.stringify(self.new_cities));
        // console.log(self.cur_new_idx);
        // console.log("");
        // console.log(JSON.stringify(self.cities));
        // console.log(self.cur_old_idx);

        self.counter = self.new_cities[self.cur_new_idx].day;
        self.city_counter = self.new_cities[self.cur_new_idx].city_name;
        window.f7.pickerModal("#picker-modal-city-day", true);
      }
    },
    doneChangeStay(){
      self.is_change = true;
      self.new_cities[self.cur_new_idx].day = self.counter;
      self.cities[self.cur_old_idx].day = self.counter;
      window.f7.closeModal("#picker-modal-city-day", true);
    },
    deleteCity(city){
      self.is_change = true;
      let index = self.new_cities.findIndex((x) => x.id === city.id);
      self.new_cities.splice(index, 1);

      self.list_city_available = self.list_city_all.filter(x => !self.new_cities.some(x2 => x.city_code === x2.city_code));
    },
    onOpen: function () {
      self.sorting = !self.sorting;
    },
    onClose: function () {
      self.sorting = !self.sorting;
    },
    onSort: function (event, indexes) {
      self.is_change = true;
      console.log(indexes);
      let start_index = indexes.startIndex;
      let new_index = indexes.newIndex;

      let temp = self.new_cities.splice(start_index, 1)[0];
      console.log(temp);
      self.new_cities.splice(new_index, 0, temp);

      console.log(JSON.stringify(self.new_cities));
    },
    closeChooseCity(){
      if(self.is_change){
        window.f7.confirm('Your change may not be saved.<br>Do you want to exit ?', 'Confirmation',
        function () {
          window.f7.closeModal("#popup-choose-city",true);
          setTimeout(function () {
            var mainView = Dom7('#main-view')[0].f7View;
            mainView.router.refreshPage();
          }, 1500);
        });
      }
      else{
        window.f7.closeModal("#popup-choose-city",true);
      }
    },
    saveListCity(){
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
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .city-card-header{
    min-height: 35px;
    background-color: #009688;
    color: white;
  }

  .city-day{
    width: 50%;
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
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
