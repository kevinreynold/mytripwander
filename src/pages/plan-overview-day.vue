<template>
  <f7-page>
    <f7-navbar title="Sunday, 16 April 2018" back-link="Back" sliding no-shadow></f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab1" tab-link active text="Table View"></f7-link>
      <f7-link href="#tab2" tab-link text="Map View"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab1" active>
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

    <f7-popup id="popup-list-place">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>{{searchTitle}}</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup="#popup-list-place"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-searchbar
      cancel-link="Cancel"
      search-list="#search-place-list"
      :placeholder="'Search ' + searchTitle"
      :clear-button="true"
      ></f7-searchbar>

      <f7-list class="searchbar-not-found">
        <f7-list-item title="Nothing found"></f7-list-item>
      </f7-list>

      <f7-list class="searchbar-found" id="search-place-list" media-list>
        <!-- <f7-list-item v-for="item in list_search" :key="item.place_id" :title="item.name" subtitle="Item Subtitle" text="Text" :media="imageURL(item.place_id)" @click="choosePlace(item)">
        </f7-list-item> -->
        <div style="margin: 0;" class="list-block media-list">
          <ul>
            <li v-for="item in list_search" :key="item.place_id">
              <a @click="choosePlace(item)" href="#" class="item-link">
                <div class="item-content">
                  <div class="item-media">
                    <img style="border-radius:100%; object-fit:cover;" :src="imageURL(item.place_id)" :alt="item.place_id" width="50px" height="50px">
                  </div>
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title custom-item-title">{{item.name}}</div>
                    </div>
                    <div class="item-text custom-item-text">
                      <div class="type-list">
                        <!-- <f7-chip v-for="type in getTypes(item.types)" :key="type.key" :text="type"></f7-chip> -->
                        <span v-if="type !== 'food'" v-for="type in getTypes(item)" :key="type.key">{{type}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </f7-list>
    </f7-popup>

  </f7-page>
</template>

<script>
import store from "../js/store"
import plan_trip from "../js/plantrip"

let self;
var mySearchbar;

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
    cur_city: "TPE",
    list_place: [],
    list_place_original: [],
    list_food: [],
    list_search: [],
    place_mode: "attraction" // attraction | must_see | culture | nature | recreation | food
  }),
  computed: {
    totalDaysTrip(){
      return "test";
    },
    searchTitle(){
      if(self.place_mode === 'attraction'){
        return 'Tourist Attractions';
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
    mySearchbar = window.Dom7('.searchbar')[0].f7Searchbar;
  },
  created() {
    self = this;
    self.list_place_original = store.list_attraction;
    self.list_place = copy(self.list_place_original);
    self.list_food = store.list_food;
    // console.log(self.list_place);
    // console.log(self.list_food);
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
      // console.log(self.list_search);
      mySearchbar.clear();
      setTimeout(function(){
        window.f7.popup("#popup-list-place", true);
        window.f7.hidePreloader();
      }, 500);
    },
    imageURL(place_id){
      let url = store._url + '/assets/place/' + place_id + '.jpg';
      // return '<img style="border-radius:100%; object-fit:cover;" src="' + url +'" alt="' + place_id + '" width="50px" height="50px">';
      return url;
    },
    getTypes(item){
      let list_types = item.types.split(';');
      let list_interests = item.interests.split(';');
      let res = [];
      for (var i = 0; i < list_interests.length - 1; i++) {
        if(list_interests[i] !== 'food'){
          res.push(list_interests[i].replace(/_/g," "));
        }
      }
      for (var i = 0; i < list_types.length - 1; i++) {
        res.push(list_types[i].replace(/_/g," "));
      }
      return res;
    },
    choosePlace(item){
      window.f7.showPreloader();
      window.f7.closeModal("#popup-list-place", true);
      store.place_details = item;
      setTimeout(function(){
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/place-result/'});
        window.f7.hidePreloader();
      }, 500);
    }
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .custom-item-title{
    font-size: 0.9em;
    word-wrap: break-word;
    white-space: normal;
  }

  .custom-item-text{
    max-height: 50px;
  }

  .type-list{
    line-height: 1.8;
  }

  .type-list span{
    margin-right: 4px;
    margin-top: 10px;
    font-size: 0.85em;
    padding: 3px;
    border: 1px solid #009688;
    background: #009688;
    color: white;
    border-radius: 5px;
  }
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
