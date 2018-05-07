<template>
  <f7-page>
    <f7-navbar sliding no-shadow>
      <f7-nav-left>
        <f7-link @click="backToCity"><f7-icon f7="arrow_left"/></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        {{perDayTitle}}
      </f7-nav-center>
    </f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab-day-1" tab-link active text="Table View"></f7-link>
      <f7-link href="#tab-day-2" tab-link text="Map View"></f7-link>
    </f7-toolbar>

    <!-- <f7-tabs animated swipeable> -->
    <f7-tabs animated>
      <f7-tab id="tab-day-1" active>
        <div class='toggle-sort-menu'>
          <a href="#" :class="{'sort-not-active': !sorting, 'sort-active': sorting}" data-sortable=".sortable-place" class="toggle-sortable">TOGGLE SORT PLACE</a>
        </div>
        <div v-if="airport_arrival_run_down.length == 0" class='toggle-sort-menu'>
          <div :class="{'sort-not-active': !change_start_hour, 'sort-active': change_start_hour}" @click="openChangeStartHour">CHANGE START HOUR</div>
        </div>
        <div class="run-down">
          <f7-list class="list-pre-run-down" media-list>
            <div class="list-block media-list">
              <ul>
                <!-- Airport Arrival -->
                <li v-if="airport_arrival_run_down.length > 0">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(airport_arrival_run_down[0].place.place_id)" :alt="airport_arrival_run_down[0].place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{airport_arrival_run_down[0].place.name}}</div>
                          <div class="item-after"><f7-icon f7="lock_fill" color="teal" size="125%"/></div>
                        </div>
                        <div v-if="airport_arrival_run_down[0].humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{airport_arrival_run_down[0].humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{airport_arrival_run_down[0].string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{airport_arrival_run_down[0].duration}} min</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(airport_arrival_run_down[0])"  class='place-action-button'>Duration</div>
                            <div @click="showInfo(airport_arrival_run_down[0].place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </li>
                <!-- Hotel Before -->
                <li v-if="hotel_before_run_down.length > 0">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(hotel_before_run_down[0].place.place_id)" :alt="hotel_before_run_down[0].place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{hotel_before_run_down[0].place.name}}</div>
                          <div class="item-after"><f7-icon f7="lock_fill" color="teal" size="125%"/></div>
                        </div>
                        <div v-if="hotel_before_run_down[0].humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{hotel_before_run_down[0].humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{hotel_before_run_down[0].string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{hotel_before_run_down[0].duration}} min</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(hotel_before_run_down[0])"   class='place-action-button'>Duration</div>
                            <div @click="showInfo(hotel_before_run_down[0].place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </li>
                <!-- Hotel Now -->
                <li v-if="hotel_now_run_down.length > 0">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(hotel_now_run_down[0].place.place_id)" :alt="hotel_now_run_down[0].place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{hotel_now_run_down[0].place.name}}</div>
                          <div class="item-after"><f7-icon f7="lock_fill" color="teal" size="125%"/></div>
                        </div>
                        <div v-if="hotel_now_run_down[0].humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{hotel_now_run_down[0].humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{hotel_now_run_down[0].string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{hotel_now_run_down[0].duration}} min</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(hotel_now_run_down[0])"   class='place-action-button'>Duration</div>
                            <div @click="showNearby(hotel_now_run_down[0].place)" class='place-action-button'>Nearby</div>
                            <div @click="showInfo(hotel_now_run_down[0].place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </li>
              </ul>
            </div>
          </f7-list>

          <f7-list class="sortable-place list-run-down" sortable media-list @sortable:sort="onSort" @sortable:open="onOpen" @sortable:close="onClose">
            <div class="list-block media-list">
              <ul>
                <li class="swipeout" v-for="item in modified_run_down" :key="item.key" @swipeout:deleted="deletePlace(item)">
                <!-- <li v-for="item in modified_run_down" :key="item.key"> -->
                  <div class="swipeout-content">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(item.place.place_id)" :alt="item.place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{item.place.name}}</div>
                          <div v-if="!item.is_open" class="item-after">
                            <span @click="showHelp('popover-place-close', 'place-close')" id="place-close"><f7-icon f7="info" color="red" size="150%"/></span>
                          </div>
                        </div>
                        <div v-if="item.humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{item.humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{item.string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{item.duration}} min</div>
                          <div class='place-open'>Open Time : {{item.string_format.split(' | ')[2]}}</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(item)"  class='place-action-button'>Duration</div>
                            <div @click="showNearby(item.place)" class='place-action-button'>Nearby</div>
                            <div @click="showInfo(item.place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="swipeout-actions-right">
                      <a href="#" class="swipeout-delete" data-confirm=" " data-confirm-title="Are you sure want to delete this place?" data-close-on-cancel="true"><f7-icon f7="close"/></a>
                    </div>
                  </div>
                  <div class="sortable-handler"></div>
                </li>
              </ul>
            </div>
          </f7-list>

          <f7-list class="list-pre-run-down" media-list>
            <div class="list-block media-list">
              <ul>
                <!-- Hotel Go Back -->
                <li v-if="hotel_go_back_run_down.length > 0">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(hotel_go_back_run_down[0].place.place_id)" :alt="hotel_go_back_run_down[0].place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{hotel_go_back_run_down[0].place.name}}</div>
                          <div class="item-after"><f7-icon f7="lock_fill" color="teal" size="125%"/></div>
                        </div>
                        <div v-if="hotel_go_back_run_down[0].humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{hotel_go_back_run_down[0].humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{hotel_go_back_run_down[0].string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{hotel_go_back_run_down[0].duration}} min</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(hotel_go_back_run_down[0])"  class='place-action-button'>Duration</div>
                            <div @click="showNearby(hotel_go_back_run_down[0].place)" class='place-action-button'>Nearby</div>
                            <div @click="showInfo(hotel_go_back_run_down[0].place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </li>
                <!-- Airport Go Back -->
                <li v-if="airport_go_back_run_down.length > 0">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(airport_go_back_run_down[0].place.place_id)" :alt="airport_go_back_run_down[0].place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{airport_go_back_run_down[0].place.name}}</div>
                          <div class="item-after">
                            <span v-if="is_late" @click="showHelp('popover-go-back-warning', 'go-back-warning')" id="go-back-warning"><f7-icon f7="info" color="red" size="150%"/>&nbsp;&nbsp;</span>
                            <f7-icon f7="lock_fill" color="teal" size="125%"/>
                          </div>
                        </div>
                        <div v-if="airport_go_back_run_down[0].humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{airport_go_back_run_down[0].humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{airport_go_back_run_down[0].string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{airport_go_back_run_down[0].duration}} min</div>
                          <div class='place-open'>Boarding Time : {{per_day_data.go_back_time}}</div>
                          <div class='place-action'>
                            <div @click="openChangeDuration(airport_go_back_run_down[0])"  class='place-action-button'>Duration</div>
                            <div @click="showInfo(airport_go_back_run_down[0].place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </li>
              </ul>
            </div>
          </f7-list>
        </div>

        <!-- <div class="airport-goback-menu">
          <div class="overlay">
            <div class="airport-goback-menu-title">Click here to go to airport</div>
            <div class="airport-goback-menu-image"><img src="../assets/flight-icon/departures-gray.png" alt="Departure" width="50px"></div>
          </div>
        </div> -->

        <f7-button fill big color="white">Blank Space</f7-button>
        <f7-button fill big color="white">Blank Space</f7-button>

        <f7-fab-speed-dial v-if="can_add_place">
          <!-- Actions -->
          <f7-fab-actions>
            <f7-fab-action @click="searchPlace('attraction')" close-speed-dial><img src="../assets/place-icon/eiffel.png" alt="attraction" width="25"></f7-fab-action>
            <f7-fab-action @click="searchPlace('food')" close-speed-dial><img src="../assets/place-icon/food.png" alt="food" width="15"></f7-fab-action>
            <f7-fab-action @click="searchPlace('must_see')" close-speed-dial><img src="../assets/interest-icon/must_see1.png" alt="must_see" width="20"></f7-fab-action>
            <f7-fab-action @click="searchPlace('culture')" close-speed-dial><img src="../assets/interest-icon/culture1.png" alt="culture" width="20"></f7-fab-action>
            <f7-fab-action @click="searchPlace('nature')" close-speed-dial><img src="../assets/interest-icon/nature1.png" alt="nature" width="20"></f7-fab-action>
            <f7-fab-action @click="searchPlace('recreation')" close-speed-dial><img src="../assets/interest-icon/recreation1.png" alt="recreation" width="20"></f7-fab-action>
          </f7-fab-actions>
          <!-- FAB -->
          <f7-fab @click="resetSearchBarQuery">
            <!-- First icon to open Actions -->
            <f7-icon icon="icon-plus"></f7-icon>
            <!-- Second icon to close Actions -->
            <f7-icon icon="icon-close"></f7-icon>
          </f7-fab>
        </f7-fab-speed-dial>
      </f7-tab>
      <f7-tab id="tab-day-2">
        <div id="map"></div>
      </f7-tab>
    </f7-tabs>

    <f7-popover id="popover-place-close">
      <div class="popover-body">
        <p>This place is close right now.</p>
      </div>
    </f7-popover>

    <f7-popover id="popover-go-back-warning">
      <div class="popover-body">
        <p>Please pay attention at the boarding time.</p>
      </div>
    </f7-popover>

    <f7-picker-modal id="picker-modal-duration" theme="teal" overlay>
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Select Duration</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-picker="picker-modal-duration"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-block class="modal-container" inner no-hairlines>
        <div class="stay-dur">
          <div class="stay-dur-row stay-dur-action">
            <div class="stay-dur-col text-green" v-on:click="temp_duration.h < 9 ? temp_duration.h += 1 : 9">+</div>
            <div class="stay-dur-col text-green" v-on:click="temp_duration.m < 9 ? temp_duration.m += 1 : 9">+</div>
            <div class="stay-dur-col text-green" v-on:click="temp_duration.s < 9 ? temp_duration.s += 1 : 9">+</div>
          </div>
          <div class="stay-dur-row">
            <div class="stay-dur-col border-side">{{temp_duration.h}}</div>
            <div class="stay-dur-col border-side">{{temp_duration.m}}</div>
            <div class="stay-dur-col border-side">{{temp_duration.s}}</div>
          </div>
          <div class="stay-dur-row stay-dur-action">
            <div class="stay-dur-col text-red" v-on:click="temp_duration.h > 0 ? temp_duration.h -= 1 : 0">-</div>
            <div class="stay-dur-col text-red" v-on:click="temp_duration.m > 0 ? temp_duration.m -= 1 : 0">-</div>
            <div class="stay-dur-col text-red" v-on:click="temp_duration.s > 0 ? temp_duration.s -= 1 : 0">-</div>
          </div>
        </div>
        <div class="stay-dur-button">
          <f7-button fill @click="doneChangeDuration">Change</f7-button>
        </div>
      </f7-block>
    </f7-picker-modal>

    <f7-picker-modal id="picker-modal-start-hour" theme="teal" overlay>
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Select Start Hour</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-picker="picker-modal-start-hour" @click="change_start_hour = !change_start_hour"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-block class="modal-container" inner no-hairlines>
        <div class="start-hour">
          <div class="start-hour-row start-hour-action">
            <div class="start-hour-col text-green" v-on:click="add_start_hour('h1')">+</div>
            <div class="start-hour-col text-green" v-on:click="add_start_hour('h2')">+</div>
            <div class="start-hour-col no-border text-white">:</div>
            <div class="start-hour-col text-green" v-on:click="add_start_hour('m1')">+</div>
            <div class="start-hour-col text-green" v-on:click="add_start_hour('m2')">+</div>
          </div>
          <div class="start-hour-row">
            <div class="start-hour-col border-side">{{temp_start_hour.h1}}</div>
            <div class="start-hour-col border-side">{{temp_start_hour.h2}}</div>
            <div class="start-hour-col no-border">:</div>
            <div class="start-hour-col border-side">{{temp_start_hour.m1}}</div>
            <div class="start-hour-col border-side">{{temp_start_hour.m2}}</div>
          </div>
          <div class="start-hour-row start-hour-action">
            <div class="start-hour-col text-red" v-on:click="minus_start_hour('h1')">-</div>
            <div class="start-hour-col text-red" v-on:click="minus_start_hour('h2')">-</div>
            <div class="start-hour-col no-border text-white">:</div>
            <div class="start-hour-col text-red" v-on:click="minus_start_hour('m1')">-</div>
            <div class="start-hour-col text-red" v-on:click="minus_start_hour('m2')">-</div>
          </div>
        </div>
        <div class="start-hour-button">
          <f7-button fill @click="doneChangeStartHour">Change</f7-button>
        </div>
      </f7-block>
    </f7-picker-modal>

  </f7-page>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxrMcKXjC6BwEOqQr_jpITTcGgAh1w4KI"></script>
<script>
import store from "../js/store"
import plan_trip from "../js/plantrip"
import moment from "moment"

let self;
let mySearchbar;

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

function getDateAfter(cur_date, day){
  var date = new Date(cur_date.getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

function changeListDestTripData(run_down){
  let country_index = store.trip_city_plan_data_index;
  let city_index = store.per_day_data.city_index;
  let day_index = store.per_day_data.day_index;
  store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].list_place = [];
  store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].list_place = copy(run_down);
}

export default {
  components: {
  },
  data: () => ({
    per_day_data: {},
    last_time: "",
    is_late: false,
    cur_city: "TNN",
    cur_date: new Date(),
    cur_day: 0,
    cur_item_id: 0,
    hotel_before: {},
    hotel_now: {},
    airport_arrival:{},
    airport_go_back:{},
    is_change_city: false,
    airport_mode: 'none', //arrival | go_back | none
    run_down: [],
    new_run_down: [],
    original_modified_run_down: [],
    modified_run_down: [],
    airport_arrival_run_down: [],
    airport_go_back_run_down: [],
    hotel_go_back_run_down: [],
    hotel_before_run_down: [],
    hotel_now_run_down: [],
    sorting: false,
    change_start_hour: false,
    is_change: false,
    can_add_place: true,
    temp_duration: {
      h: 0,
      m: 1,
      s: 0
    },
    temp_start_hour: {
      h1: 0,
      h2: 0,
      m1: 0,
      m2: 0
    },
    counter: 0,
    cur_new_idx: 0,
    /***/
    list_place: [],
    list_place_original: [],
    list_food: [],
    list_search: [],
    place_mode: "attraction" // attraction | must_see | culture | nature | recreation | food
  }),
  computed: {
    searchTitle(){
      if(self.place_mode === 'attraction'){
        return 'Tourist Attractions - All';
      }
      else if(self.place_mode === 'must_see'){
        return 'Tourist Attracions - Must See';
      }
      else if(self.place_mode === 'culture'){
        return 'Tourist Attracions - Culture';
      }
      else if(self.place_mode === 'nature'){
        return 'Tourist Attracions - Nature';
      }
      else if(self.place_mode === 'recreation'){
        return 'Tourist Attracions - Recreation';
      }
      return 'Restaurants';
    },
    perDayTitle(){
      return moment(self.cur_date).format('dddd, DD MMMM YYYY');
    }
  },
  mounted() {
    $(document).ready(function(){
      var markers = [
          {
            "title": 'Soho, Hong Kong',
            "lat": '22.281572',
            "lng": '114.152845',

          }
        ,
          {
            "title": 'Man Mo Temple',
            "lat": '22.28395',
            "lng": '114.1501902',

          }
        ,
          {
            "title": 'Dr Sun Yat-sen Museum',
            "lat": '22.2819842',
            "lng": '114.1508136',
          }
        ,
          {
            "title": 'Hong Kong Museum of Medical Sciences',
            "lat": '22.2834468',
            "lng": '114.1486087',
          }
      ];
    });
  },
  created() {
    self = this;
    self.last_time = store.last_time;
    self.per_day_data = copy(store.per_day_data);
    self.cur_city = store.per_day_data.city_code;
    self.cur_date = new Date(store.per_day_data.cur_date);
    self.cur_day = self.cur_date.getDay();

    self.can_add_place = store.can_add_place;
    self.run_down = copy(store.coba_run_down);
    self.new_run_down = copy(store.coba_run_down);
    console.log("NEW RUN DOWN");
    self.new_run_down.forEach(function(element) {
      console.log(element.place.name);
    });

    self.is_change_city = store.is_change_city;
    self.airport_mode = store.airport_mode;

    self.original_modified_run_down = copy(store.coba_modified_run_down);
    console.log(self.original_modified_run_down);
    self.modified_run_down = self.original_modified_run_down.filter(x => x.can_sort);
    console.log(self.modified_run_down);

    self.airport_arrival_run_down = self.original_modified_run_down.filter(x => x.type === 'airport_arrival');
    self.airport_go_back_run_down = self.original_modified_run_down.filter(x => x.type === 'airport_go_back');
    self.hotel_go_back_run_down = self.original_modified_run_down.filter(x => x.type === 'hotel_go_back');
    self.hotel_before_run_down = self.original_modified_run_down.filter(x => x.type === 'hotel_before');
    self.hotel_now_run_down = self.original_modified_run_down.filter(x => x.type === 'hotel_now');

    // console.log(self.airport_arrival_run_down);
    // console.log(self.airport_go_back_run_down);
    // console.log(self.hotel_before_run_down);
    // console.log(self.hotel_now_run_down);

    self.list_place_original = copy(store.list_attraction);
    self.list_place = copy(self.list_place_original);
    self.list_food = copy(store.list_food);
    // console.log(self.list_place);
    // console.log(self.list_food);

    /***/
    self.hotel_before = store.coba_hotel1;
    self.hotel_now = store.coba_hotel2;

    self.airport_arrival = store.coba_airport;
    self.airport_go_back = store.coba_airport;

    /**/
    self.is_late = false;
    if(new Date('1970/01/01 ' + self.last_time) > new Date('1970/01/01 ' + self.per_day_data.go_back_time)){
      self.is_late = true;
    }
  },
  methods: {
    resetSearchBarQuery(){
      // console.log("Asd");
      // console.log(mySearchbar.active);
      // mySearchbar.search('');
    },
    searchPlace(mode){ //attraction | food
      window.f7.showPreloader();
      self.place_mode = mode;
      self.list_search = [];
      if(mode === 'attraction'){
        self.list_search = copy(self.list_place_original);
      }
      else if(mode === 'must_see'){
        self.list_search = copy(self.list_place_original);
        self.list_search = self.list_search.filter(x => x.interests.includes('must_see'));
      }
      else if(mode === 'culture'){
        self.list_search = copy(self.list_place_original);
        self.list_search = self.list_search.filter(x => x.interests.includes('culture'));
      }
      else if(mode === 'nature'){
        self.list_search = copy(self.list_place_original);
        self.list_search = self.list_search.filter(x => x.interests.includes('nature'));
      }
      else if(mode === 'recreation'){
        self.list_search = copy(self.list_place_original);
        self.list_search = self.list_search.filter(x => x.interests.includes('recreation'));
      }
      else{
        self.list_search = copy(self.list_food);
      }

      store.list_search = self.list_search;
      store.place_mode = self.place_mode;

      setTimeout(function(){
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/search-place/'});
        window.f7.hidePreloader();
      }, 500);
    },
    imageURL(place_id){
      let url = store._url + '/assets/place/' + place_id + '.jpg';
      // return '<img style="border-radius:100%; object-fit:cover;" src="' + url +'" alt="' + place_id + '" width="50px" height="50px">';
      return url;
    },
    showInfo(item){
      window.f7.showPreloader();
      store.place_details = item;
      store.view_place_mode = true;
      setTimeout(function(){
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/place-result/'});
        window.f7.hidePreloader();
      }, 500);
    },
    showNearby(place){
      // console.log(place.place_id);
      plan_trip.goToNearbyPlaces(place.place_id);
    },
    onOpen: function () {
      self.sorting = true;
    },
    onClose: function () {
      self.sorting = false;
      if(self.is_change){
        window.f7.confirm('', 'Are you sure with these changes?',
        function () {
          store.coba_run_down = self.new_run_down;
          changeListDestTripData(self.new_run_down);
          plan_trip.addSchedule(false, false);
        },
        function () {
          plan_trip.addSchedule(false, false);
        });
      }
    },
    onSort: function (event, indexes) {
      self.is_change = true;
      // console.log(indexes);

      let start_index = indexes.startIndex;
      let new_index = indexes.newIndex;

      let temp = self.new_run_down.splice(start_index, 1)[0];
      // console.log(temp);
      self.new_run_down.splice(new_index, 0, temp);

      console.log("RUN DOWN");
      self.run_down.forEach(function(element) {
        console.log(element.place.name);
      });
      console.log("");
      console.log("NEW RUN DOWN");
      self.new_run_down.forEach(function(element) {
        console.log(element.place.name);
      });
    },
    showHelp(popover, target){
      window.f7.popover("#"+popover, "#"+target, true);
    },
    deletePlace(item){
      console.log('delete');
      let index = self.new_run_down.findIndex((x) => x.id === item.id);
      self.new_run_down.splice(index, 1);

      store.coba_run_down = self.new_run_down;
      changeListDestTripData(self.new_run_down);
      plan_trip.addSchedule(false, false);
    },
    openChangeDuration(item){
      console.log(item.id);
      if(!self.sorting){
        self.cur_item_id = item.id;
        self.cur_new_idx = self.original_modified_run_down.findIndex((x) => x.id === item.id);
        self.counter = self.original_modified_run_down[self.cur_new_idx].duration;
        let string_duration = ("000" + self.counter).slice(-3);
        self.temp_duration.h = parseInt(string_duration[0]);
        self.temp_duration.m = parseInt(string_duration[1]);
        self.temp_duration.s = parseInt(string_duration[2]);
        window.f7.pickerModal("#picker-modal-duration", true);
      }
    },
    doneChangeDuration(){
      let new_duration = parseInt("" + self.temp_duration.h + self.temp_duration.m + self.temp_duration.s);
      console.log(new_duration);
      console.log(self.cur_item_id);

      let country_index = store.trip_city_plan_data_index;
      let city_index = store.per_day_data.city_index;
      let day_index = store.per_day_data.day_index;

      if(self.cur_item_id >= 0){
        let new_run_down_idx = self.new_run_down.findIndex((x) => x.id === self.cur_item_id);
        self.new_run_down[new_run_down_idx].duration = new_duration;
        store.coba_run_down = self.new_run_down;
        changeListDestTripData(self.new_run_down);
      }
      else if(self.cur_item_id === -1){ //hotel_now
        store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].hotel_now_duration = new_duration;
        store.per_day_data.hotel_now_duration = new_duration;
      }
      else if(self.cur_item_id === -2){ //hotel_before
        store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].hotel_before_duration = new_duration;
        store.per_day_data.hotel_before_duration = new_duration;
      }
      else if(self.cur_item_id === -3){ //airport_arrival
        store.trip_city_plan_data[country_index].arrival_duration = new_duration;
        store.per_day_data.arrival_duration = new_duration;
      }
      else if(self.cur_item_id === -4){ //hotel_go_back
        store.trip_city_plan_data[country_index].hotel_go_back_duration = new_duration;
        store.per_day_data.hotel_go_back_duration = new_duration;
      }
      else if(self.cur_item_id === -5){ //airport_go_back
        store.trip_city_plan_data[country_index].go_back_duration = new_duration;
        store.per_day_data.go_back_duration = new_duration;
      }

      window.f7.closeModal("#picker-modal-duration", true);
      plan_trip.addSchedule(false, false);
    },
    openChangeStartHour(){
      if(!self.change_start_hour){
        let string_duration = self.per_day_data.start_hour;
        self.temp_start_hour.h1 = parseInt(string_duration[0]);
        self.temp_start_hour.h2 = parseInt(string_duration[1]);
        self.temp_start_hour.m1 = parseInt(string_duration[3]);
        self.temp_start_hour.m2 = parseInt(string_duration[4]);

        self.change_start_hour = true;
        window.f7.pickerModal("#picker-modal-start-hour", true);
      }
    },
    doneChangeStartHour(){
      let new_start_hour = "" + self.temp_start_hour.h1 + self.temp_start_hour.h2 + ":" + self.temp_start_hour.m1 + self.temp_start_hour.m2;
      console.log(new_start_hour);

      let country_index = store.trip_city_plan_data_index;
      let city_index = store.per_day_data.city_index;
      let day_index = store.per_day_data.day_index;
      store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].start_hour = new_start_hour;
      store.per_day_data.start_hour = new_start_hour;

      window.f7.closeModal("#picker-modal-start-hour", true);
      self.change_start_hour = false;

      plan_trip.addSchedule(false, false);
    },
    add_start_hour(mode){
      if(mode === 'h1'){
        if(self.temp_start_hour.h1 < 2){
          self.temp_start_hour.h1 += 1;
        }
        else{
          self.temp_start_hour.h1 = 2;
        }

        if(self.temp_start_hour.h1 === 2){
          self.temp_start_hour.h2 = 0;
        }
      }
      else if(mode === 'h2'){
        if(self.temp_start_hour.h1 < 2){
          if(self.temp_start_hour.h2 < 9){
            self.temp_start_hour.h2 += 1;
          }
          else{
            self.temp_start_hour.h2 = 9;
          }
        }
        else{
          if(self.temp_start_hour.h2 < 3){
            self.temp_start_hour.h2 += 1;
          }
          else{
            self.temp_start_hour.h2 = 3;
          }
        }
      }
      else if(mode === 'm1'){
        if(self.temp_start_hour.m1 < 5){
          self.temp_start_hour.m1 += 1;
        }
        else{
          self.temp_start_hour.m1 = 5;
        }
      }
      else if(mode === 'm2'){
        if(self.temp_start_hour.m2 < 9){
          self.temp_start_hour.m2 += 1;
        }
        else{
          self.temp_start_hour.m2 = 9;
        }
      }
    },
    minus_start_hour(mode){
      if(mode === 'h1'){
        if(self.temp_start_hour.h1 > 0){
          self.temp_start_hour.h1 -= 1;
        }
        else{
          self.temp_start_hour.h1 = 0;
        }
      }
      else if(mode === 'h2'){
        if(self.temp_start_hour.h2 > 0){
          self.temp_start_hour.h2 -= 1;
        }
        else{
          self.temp_start_hour.h2 = 0;
        }
      }
      else if(mode === 'm1'){
        if(self.temp_start_hour.m1 > 0){
          self.temp_start_hour.m1 -= 1;
        }
        else{
          self.temp_start_hour.m1 = 0;
        }
      }
      else if(mode === 'm2'){
        if(self.temp_start_hour.m2 > 0){
          self.temp_start_hour.m2 -= 1;
        }
        else{
          self.temp_start_hour.m2 = 0;
        }
      }
    },
    backToCity(){
      plan_trip.backRefresh();
    }
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .toggle-sort-menu{
    width: 100%;
    overflow: auto;
  }

  .sort-not-active{
    display: block;
    width: 95%;
    overflow: auto;
    margin: 5px 2.5%;
    padding: 5px 0;
    background-color: white;
    border: 1px solid #009688;
    color: #009688;
    text-align: center;
    font-weight: bold;
    transition: 0.25s;
  }

  .sort-active{
    display: block;
    width: 95%;
    overflow: auto;
    margin: 5px 2.5%;
    padding: 5px 0;
    background-color: #009688;
    border: 1px solid #009688;
    color: white;
    text-align: center;
    font-weight: bold;
    transition: 0.25s;
  }

  .custom-item-title{
    font-size: 0.9em;
    word-wrap: break-word;
    white-space: normal;
  }

  .custom-item-subtitle{
    font-size: 0.7em;
    word-wrap: break-word;
    white-space: normal;
    color: #757575;
  }

  .custom-item-text{
    max-height: 150px;
  }

  .place-card{
    margin-bottom: 10px;
  }

  .place-time{
    width: 100%;
    overflow: auto;
    text-align: center;
    color: black;
    margin-top: 6px;
  }

  .place-open{
    width: 100%;
    overflow: auto;
    text-align: right;
    font-size: 0.85em;
    margin-top: 3px;
  }

  .place-duration{
    width: 100%;
    overflow: auto;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
    margin: 7px 0;
    color: #009688;
  }

  .place-action{
    width: 100%;
    overflow: auto;
    margin-top: 10px;
  }

  .place-action-button{
    width: 20%;
    padding: 2px 3.5px;
    margin-left: 5px;
    overflow: auto;
    background-color: white;
    border: 1px solid #009688;
    color: #009688;
    text-align: center;
    font-size: 0.8em;
    font-weight: bold;
    float: right;
  }

  .list-pre-run-down{
    margin-top: -32px;
    margin-bottom: 0px;
  }
  .list-run-down{
    margin-top: -32px;
  }

  .popover{
    margin-top: 20px;
  }

  .popover-body{
    padding: 5px;
  }

  .modal-container{
    margin-top: 5%;
  }

  .stay-dur{
    width: 100%;
    overflow: auto;
  }

  .stay-dur-row{
    width: 50%;
    overflow: auto;
    margin-left: 26%;
  }

  .stay-dur-col{
    width: 27%;
    overflow: auto;
    float:left;
    text-align: center;
    border: 1.5px solid black;
    margin-right: 4%;
    font-size: 1.25em;
    font-weight: bold;
  }

  .border-side{
    border-top: none;
    border-bottom: none;
  }

  .text-green{
    color: green;
  }

  .text-white{
    color: white;
  }

  .text-red{
    color: red;
  }

  .stay-dur-action .active-state{
    background-color: rgba(0,0,0,0.3);
  }

  .stay-dur-button{
    width: 48%;
    overflow: auto;
    margin-top: 5%;
    margin-left: 26%;
  }

  /***/
  .start-hour{
    width: 100%;
    overflow: auto;
  }

  .start-hour-row{
    /* width: 90%; */
    overflow: auto;
    margin-left: 18.5%;
  }

  .start-hour-col{
    width: 13%;
    overflow: auto;
    float:left;
    text-align: center;
    border: 1.5px solid black;
    margin-right: 4%;
    font-size: 1.25em;
    font-weight: bold;
  }

  .start-hour-action .active-state{
    background-color: rgba(0,0,0,0.3);
  }

  .start-hour-button{
    width: 76.5%;
    overflow: auto;
    margin-top: 5%;
    margin-left: 12.5%;
  }

  .no-border{
    border: none;
    margin: 0;
    margin-left: -4%;
  }
  /**/

  .airport-goback-menu{
    position: relative;
    top: 15px;
    width: 95%;
    height: 45vw;
    margin: 2.5%;
    margin-bottom: 15px;
    border: 1px solid #757575;
    border-radius: 2px;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .airport-goback-menu-title{
    position: absolute;
    top: 60%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: rgba(0,0,0,0.3);
    transform: translateY(-50%);
    font-size: 1.5em;
  }

  .airport-goback-menu-image{
    position: absolute;
    top: 40%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: rgba(0,0,0,0.3);
    transform: translateY(-50%);
    font-size: 1.5em;
  }

  #map {
    width: 100%;
    /* margin: 2.5%; */
    height: 100%;
    /* border: 1px solid black; */
  }
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
