<template>
  <f7-page>
      <f7-navbar no-shadow>
        <f7-nav-left>
          <f7-link>{{searchTitle}}</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link @click="closeSearchPlace"><f7-icon f7="close"/></f7-link>
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
                      <div v-if="place_mode === 'nearby' "class="type-list">
                        ({{changeFormatDuration(item.travel_time)}})
                      </div>
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
  </f7-page>
</template>

<script>
import store from "../js/store"
import plan_trip from "../js/plantrip"

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

export default {
  components: {
  },
  data: () => ({
    list_search: [],
    place_mode: 'attraction'
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
      else if(self.place_mode === 'nearby'){
        return 'Nearby Places';
      }
      return 'Restaurants';
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.place_mode = store.place_mode;
    self.list_search = store.list_search;
  },
  methods: {
    closeSearchPlace(){
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.back();
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
      store.place_details = item;
      store.view_place_mode = false;
      setTimeout(function(){
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/place-result/'});
        window.f7.hidePreloader();
      }, 500);
    },
    changeFormatDuration(duration){
      var result = "";
      if(duration == 0){
        return "none";
      }

      if (duration > 3600) {
        result += ("00" + (Math.floor(duration / 3600))).slice(-2) + "h ";
        duration -= (Math.floor(duration / 3600)) * 3600;
        result += ("00" + (Math.floor(duration / 60))).slice(-2) + "m ";
        result += ("00" + (duration % 60)).slice(-2) + "s ";
      }
      else if (duration > 60) {
        result += ("00" + (Math.floor(duration/60))).slice(-2) + "m ";
        result += ("00" + (duration % 60)).slice(-2) + "s ";
      }
      else{
        result += ("00" + (duration)).slice(-2) + "s ";
      }
      return result;
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
    max-height: 75px;
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
