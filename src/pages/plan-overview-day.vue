<template>
  <f7-page>
    <f7-navbar title="Sunday, 16 April 2018" back-link="Back" sliding no-shadow></f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab1" tab-link active text="Table View"></f7-link>
      <f7-link href="#tab2" tab-link text="Map View"></f7-link>
    </f7-toolbar>

    <!-- <f7-tabs animated swipeable> -->
    <f7-tabs animated>
      <f7-tab id="tab1" active>
        <div class='toggle-sort-menu'>
          <a href="#" :class="{'sort-not-active': !sorting, 'sort-active': sorting}" data-sortable=".sortable-place" class="toggle-sortable">TOGGLE SORT PLACE</a>
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
                            <div @click="changeDuration"  class='place-action-button'>Duration</div>
                            <div @click="showNearby"class='place-action-button'>Nearby</div>
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
                            <div @click="changeDuration"  class='place-action-button'>Duration</div>
                            <div @click="showNearby"class='place-action-button'>Nearby</div>
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
                            <div @click="changeDuration"  class='place-action-button'>Duration</div>
                            <div @click="showNearby"class='place-action-button'>Nearby</div>
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
                <li v-for="item in modified_run_down" :key="item.key">
                    <div class="item-content">
                      <div class="item-media">
                        <img style="border-radius:100%; object-fit:cover;" :src="imageURL(item.place.place_id)" :alt="item.place.place_id" width="50px" height="50px">
                      </div>
                      <div class="item-inner">
                        <div class="item-title-row">
                          <div class="item-title custom-item-title">{{item.place.name}}</div>
                          <div v-if="!item.is_open" class="item-after"><f7-icon f7="info" color="red" size="150%"/></div>
                        </div>
                        <div v-if="item.humanize !== 'none'" class="item-subtitle custom-item-subtitle">Travel Time : {{item.humanize}}</div>
                        <div class="item-text custom-item-text">
                          <div class='place-time'>{{item.string_format.split(' | ')[1]}}</div>
                          <div class='place-duration'>{{item.duration}} min</div>
                          <div class='place-open'>Open Time : {{item.string_format.split(' | ')[2]}}</div>
                          <div class='place-action'>
                            <div @click="changeDuration"  class='place-action-button'>Duration</div>
                            <div @click="showNearby"class='place-action-button'>Nearby</div>
                            <div @click="showInfo(item.place)"  class='place-action-button'>Info</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="sortable-handler"></div>
                </li>
              </ul>
            </div>
          </f7-list>
        </div>

        <f7-button fill big color="white">Blank Space</f7-button>

        <f7-fab-speed-dial>
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
      <f7-tab id="tab2">
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
    </f7-tabs>

  </f7-page>
</template>

<script>
import store from "../js/store"
import plan_trip from "../js/plantrip"
import moment from "moment";

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

export default {
  components: {
  },
  data: () => ({
    cur_city: "TNN",
    hotel_before: {},
    hotel_now: {},
    airport_arrival:{},
    airport_go_back:{},
    is_change_city: false,
    airport_mode: 'none', //arrival | go_back | none
    cur_date: new Date(),
    cur_day: 0,
    original_modified_run_down: [],
    modified_run_down: [],
    airport_arrival_run_down: [],
    airport_go_back_run_down: [],
    hotel_before_run_down: [],
    hotel_now_run_down: [],
    sorting: false,
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
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.is_change_city = store.is_change_city;
    self.airport_mode = store.airport_mode;

    self.original_modified_run_down = copy(store.coba_modified_run_down);
    console.log(self.original_modified_run_down);
    self.modified_run_down = self.original_modified_run_down.filter(x => x.can_sort);

    self.airport_arrival_run_down = self.original_modified_run_down.filter(x => x.type === 'airport_arrival');
    self.airport_go_back_run_down = self.original_modified_run_down.filter(x => x.type === 'airport_go_back');
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

    self.cur_date = new Date(); //SUNDAY
    self.cur_day = self.cur_date.getDay(); //0
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
    showNearby(){
      console.log('nearby');
    },
    changeDuration(){
      console.log('duration');
    },

    onOpen: function () {
      self.sorting = !self.sorting;
    },
    onClose: function () {
      self.sorting = !self.sorting;
    },
    onSort: function (event, indexes) {
      console.log(indexes);
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
    margin: 2.5%;
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
    margin: 2.5%;
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
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
