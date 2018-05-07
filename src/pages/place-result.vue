<template>
  <!-- <f7-page infinite-scroll> -->
  <f7-page>
    <f7-navbar :title="place_details.name" back-link="Back" sliding @back-click="clearData"></f7-navbar>

    <f7-photo-browser ref="pb" :photos="photos" theme="dark" @open="onOpen" @close="onClose"/>
    <div class="place-photo" @click="openPhotoBrowser" :style="place_image_url">
    </div>

    <div class="place-desc-title">About</div>
    <div class="place-name">{{place_details.description}}</div>
    <div class="place-desc">
      <div class="type-list">
        <span v-if="type !== 'food'" v-for="type in getTypes(place_details)" :key="type.key">{{type}}</span>
      </div>
    </div>
    <div class="place-rating">
      <span :style="colorRating">{{place_details.rating.toFixed(1)}} Rating</span> |
      <span :style="reviewsRating">{{place_details.reviews}} Reviews</span>
    </div>

    <div class="place-location-title">Average Stay Duration</div>
    <div class="place-stay-dur">{{place_details.avg_dur}} min</div>

    <div class="place-location-title">Opening Hours</div>
    <div class="place-opening-hours">
      <div :class="{highlight: openingHoursStatus(index)}" v-for="open, index in setOpeningHours(place_details)" :key="open.day_name" class="open-hours">
        <div class="open-day">{{open.day_name}}</div>
        <div class="open-separator">:</div>
        <div class="open-hours-string">{{open.hours}}</div>
      </div>
    </div>

    <div class="place-location-title">Location</div>
    <div class="place-marker">
      <gmap-map :center="center" :zoom="13" style="width: 100%; height: 45vw;">
        <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="false" :draggable="false" @click="center=m.position"/>
      </gmap-map>
      <div class="place-location"><f7-icon fa="map-marker"/> {{place_details.address}}</div>
    </div>

    <div v-if="!view_place_mode" class="fixed-bottom">
        <f7-button fill big v-on:click="addPlace">Add Place</f7-button>
    </div>
    <f7-button fill big color="white">Blank Space</f7-button>
  </f7-page>
</template>

<script>
import store from '../js/store'
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

function changeListDestTripData(run_down){
  let country_index = store.trip_city_plan_data_index;
  let city_index = store.per_day_data.city_index;
  let day_index = store.per_day_data.day_index;
  store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].list_place = [];
  store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].list_place = copy(run_down);

  // console.log('PERUBAHAN');
  // console.log(country_index);
  // console.log(city_index);
  // console.log(day_index);
  // console.log(store.trip_city_plan_data[country_index].cities[city_index].list_dest_trip[day_index].list_place);
  // console.log('');
}

export default {
  components: {
  },
  data: () => ({
    place_details: {},
    center: {lat:22.324587, lng:114.173473},
    markers: [],
    photos: [],
    cur_day: 3,
    view_place_mode: false
  }),
  computed: {
    title(){
      return 'hai';
    },
    place_image_url(){
      return ("background-image:url(" + self.photos[0].url + ");");
    },
    colorRating(){
      return "color: rgb(72,139,248); font-weight:500;"
    },
    reviewsRating(){
      return "color: rgb(10,178,24); font-weight:500;"
    }
  },
  mounted() {
  },
  created() {
    //do something after creating vue instance
    self = this;
    let cur_date = new Date(store.per_day_data.cur_date);
    self.cur_day = cur_date.getDay();

    self.place_details = store.place_details;
    self.view_place_mode = store.view_place_mode;
    // console.log(self.place_details);

    self.center.lat = parseFloat(self.place_details.latitude);
    self.center.lng = parseFloat(self.place_details.longitude);
    self.setPhotos();
    self.setMarker();
  },
  methods: {
    setPhotos(){
      let img_url = store._url + "/assets/place/" + self.place_details.place_id + ".jpg";
      let temp = {
        url: img_url
      };
      self.photos.push(temp);
      // console.log(self.photos);
    },
    setMarker(){
      let position = {
        position: {lat: self.center.lat, lng: self.center.lng}
      };
      self.markers.push(position);
      // console.log(self.markers);
    },
    setOpeningHours(item){
      let res = [];
      for (var i = 0; i < item.opening_hours.day.length; i++) {
        let day = "";
        if(i==0){day = 'Sunday';}
        else if(i==1){day = 'Monday';}
        else if(i==2){day = 'Tuesday';}
        else if(i==3){day = 'Wednesday';}
        else if(i==4){day = 'Thursday';}
        else if(i==5){day = 'Friday';}
        else if(i==6){day = 'Saturday';}

        let string_hours = "";
        if(item.opening_hours.day[i] !== 'Closed'){
          let split_string = item.opening_hours.day[i].split('-');
          let open = split_string[0].slice(0,2) + ":" + split_string[0].slice(2,4);
          let close = split_string[1].slice(0,2) + ":" + split_string[1].slice(2,4);
          string_hours = open + ' - ' + close;
        }
        else{
          string_hours = 'Closed';
        }

        let temp = {
          day_name : day,
          hours: string_hours
        };

        res.push(temp);
      }
      // console.log(res);
      return res;
    },
    openingHoursStatus(day){
      return self.cur_day === day;
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
    openPhotoBrowser(){
        self.$refs.pb.open();
    },
    onOpen(){
      // console.log('Photo Browser is opened');
    },
    onClose(){
      // console.log(active_idx);
    },
    clearData(){
      store.place_details = [];
      window.f7.popup("#popup-list-place", true);
    },
    addPlace(){
      console.log('add place');
      let item = copy(self.place_details);
      let temp = {
        place: item,
        duration: item.avg_dur,
        id: 99
      }
      store.coba_run_down.push(temp);
      changeListDestTripData(store.coba_run_down);
      plan_trip.addSchedule(true, false);
    }
  }
}
</script>

<style scoped>
  .sub-title{
    font-size: 0.9em;
    font-weight: bold;
    /* color: rgba(0,0,0,0.9); */
  }

  .place-photo{
    width: 100%;
    overflow: auto;
    height: 50vw;
    background-size: cover;
    background-position: center;
  }

  .place-desc-title{
    overflow: auto;
    margin: 10px;
    font-weight: bold;
    margin-bottom: 0px;
  }

  .place-name{
    overflow: auto;
    margin: 10px;
    margin-bottom: 0px;
    margin-top: 0px;
    font-size: 1.05em;
  }

  .place-desc{
    overflow: auto;
    margin: 10px;
    margin-top: 0px;
    padding-bottom: 5px;
    margin-bottom: 15px;
    border-bottom: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
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

  .place-rating{
    overflow: auto;
    margin: 10px;
    margin-top: -5px;
    padding-bottom: 5px;
    margin-bottom: 10px;
    font-size: 1.05em;
    border-bottom: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
  }

  .place-location-title{
    overflow: auto;
    margin: 10px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .place-opening-hours{
    width: 95%;
    margin: auto;
    margin-bottom: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    overflow: auto;
    border-bottom: 1px solid black;
    border-color: rgba(0,0,0,0.25);
  }

  .place-stay-dur{
    width: 95%;
    margin: auto;
    margin-bottom: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    overflow: auto;
    border-bottom: 1px solid black;
    border-color: rgba(0,0,0,0.25);
  }

  .open-day{
    width: 30%;
    float:left;
  }
  .open-separator{
    width: 5%;
    float:left;
  }
  .open-hours-string{
    width: 50%;
    float:left;
  }

  .place-marker{
    width: 95%;
    margin: auto;
    margin-bottom: 10px;
    padding-bottom: 5px;
    overflow: auto;
    border-bottom: 1px solid black;
    border-color: rgba(0,0,0,0.25);
  }

  .place-location{
    margin-top: 5px;
    color: rgba(0,0,0,0.55);
  }

  .hotel-amenities{
    overflow: auto;
    margin: 10px;
    border-bottom: 1px solid black;
    border-color: rgba(0,0,0,0.25);
  }

  .hotel-amenities ul{
    font-size: 0.8em;
    margin-top: -2px;
    margin-left: -7%;
    list-style-type: none;
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
  }

  .hotel-amenities ul li{
    padding-bottom: 5px;
  }

  .hotel-amenities ul li:first-child{
    padding-top: 5px;
  }

  .hotel-amenities ul li span{
    color: orange;
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
    color: rgba(0, 0, 0, 0.255);
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

  .room-more-deals{
    width: 25%;
    padding: 4px;
    overflow: auto;
    color: #009688;
    border: 1px solid #009688;
    text-align: center;
    border-radius: 3px;
    font-size: 0.9em;
  }

  .fixed-bottom {
     position:fixed;
     left:0px;
     bottom:0px;
     width:100%;
     overflow: auto;
     z-index: 5000;
  }

  .highlight{
    font-weight: bold;
    color: #009688;
  }
</style>
