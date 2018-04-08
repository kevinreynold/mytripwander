<template>
  <!-- <f7-page infinite-scroll> -->
  <f7-page>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>

    <f7-photo-browser ref="pb" :photos="photos" theme="dark" @open="onOpen" @close="onClose"/>
    <div class="hotel-photo" @click="openPhotoBrowser" :style="hotel_image_url">
      <div class="hotel-photo-count">{{img_idx+1}}/{{hotel_details.photoCount}}</div>
    </div>

    <div class="hotel-name">{{hotel_details.name}}</div>
    <div class="hotel-star-rating">
      <f7-icon :class="{ checked: stars[0] }" fa="star"></f7-icon>
      <f7-icon :class="{ checked: stars[1] }" fa="star"></f7-icon>
      <f7-icon :class="{ checked: stars[2] }" fa="star"></f7-icon>
      <f7-icon :class="{ checked: stars[3] }" fa="star"></f7-icon>
      <f7-icon :class="{ checked: stars[4] }" fa="star"></f7-icon>
    </div>
    <div class="hotel-guest-rating" :style="colorRating">{{guest_rating}} Guest Rating</div>

    <!-- <f7-grid>
      <f7-col width="50">
        <div class="hotel-guest border-right">
          <div class="hotel-guest-img"><img src="../assets/flight-icon/adult.png" alt="adult" width="30px"></div>
          <div class="hotel-guest-count">1</div>
        </div>
      </f7-col>
      <f7-col width="50">
        <div class="hotel-guest border-left">
          <div class="hotel-guest-img"><img src="../assets/flight-icon/adult.png" alt="adult" width="30px"></div>
          <div class="hotel-guest-count">1</div>
        </div>
      </f7-col>
    </f7-grid> -->

    <div class="hotel-best-deal">Best Deal</div>
    <room_card :room_deal=best_deal>
      <div v-if="hotel_search_plan_mode !== 'search'" class="room-more-deals" v-on:click="moreDeals">More Deals</div>
    </room_card>


    <div class="hotel-location-title">Location</div>
    <div class="hotel-marker">
      <gmap-map :center="center" :zoom="13" style="width: 100%; height: 45vw;">
        <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="false" :draggable="false" @click="center=m.position"/>
      </gmap-map>
      <div class="hotel-location"><f7-icon fa="map-marker"/> {{hotel_details.address}}</div>
    </div>

    <div class="hotel-amenities">
      <div class="sub-title">Staff Languages</div>
      <div>
        <ul>
          <li v-for="sl in staff_languages" :key="sl.key"><span><f7-icon fa="check"/></span> {{sl.name}}</li>
        </ul>
      </div>
    </div>

    <div class="hotel-amenities">
      <div class="sub-title">Room Amenities</div>
      <div>
        <ul>
          <li v-for="ra in room_amenities" :key="ra.key"><span><f7-icon fa="check"/></span> {{ra.name}}</li>
        </ul>
      </div>
    </div>

    <div class="hotel-amenities">
      <div class="sub-title">Hotel Amenities</div>
      <div>
        <ul>
          <li v-for="ha in hotel_amenities" :key="ha.key"><span><f7-icon fa="check"/></span> {{ha.name}}</li>
        </ul>
      </div>
    </div>

    <div v-if="hotel_search_plan_mode === 'search'" class="fixed-bottom">
        <f7-button fill big v-on:click="searchAgain">Search Again</f7-button>
    </div>
    <f7-button v-if="hotel_search_plan_mode === 'search'" fill big color="white">Blank Space</f7-button>
  </f7-page>
</template>

<script>
import room_card from '../components/room-card'
import store from '../js/store'
import hotel_api from "../js/hotelsearch"

let self;

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

export default {
  components: {
    room_card
  },
  data: () => ({
    hotel_booking_data: {},
    hotel_details: {},
    best_deal: {},
    guest_rating: 0,
    center: {lat:22.324587, lng:114.173473},
    img_idx: 0,
    markers: [],
    photos:[],
    stars: [true,true,true,true,false],
    staff_languages: [],
    room_amenities: [],
    hotel_amenities: [],
    amenities: [],
    hotel_search_plan_mode: ""
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
    },
    hotel_image_url(){
      return ("background-image:url(" + self.photos[self.img_idx].url + ");");
    },
    colorRating(){
      return "color: rgb(72,139,248); font-weight:500;"
    }
  },
  mounted() {
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.hotel_search_plan_mode = store.hotel_search_plan_mode;
    self.hotel_booking_data = store.hotel_booking_data;
    self.hotel_details = store.hotel_details;

    self.guest_rating = (self.hotel_details.guestScore/10).toFixed(1);
    self.center.lat = self.hotel_details.location.lat;
    self.center.lng = self.hotel_details.location.lon;
    self.amenities = self.hotel_details.amenities;
    self.best_deal = self.hotel_details.rooms[0];
    // console.log(JSON.stringify(self.best_deal));

    self.setPhotos();
    self.setMarker();
    self.setStarRating(self.hotel_details.stars);
    self.setStaffLanguages();
    self.setRoomAmenities();
    self.setHotelAmenities();
  },
  methods: {
    setPhotos(){
      for (let i = 0; i < self.hotel_details.photoCount; i++) {
        let img_url = "https://photo.hotellook.com/image_v2/limit/h" + self.hotel_details.id + "_" + i +"/640/480.jpg";
        let temp = {
          url: img_url
        };
        self.photos.push(temp);
      }
    },
    setMarker(){
      let position = {
        position: {lat: self.center.lat, lng: self.center.lng}
      };
      self.markers.push(position);
    },
    setStaffLanguages(){
      let list_amenities = store.hotel_amenities;
      self.staff_languages = list_amenities.filter(x => self.amenities.some(x2 => x.id === x2.toString()));
      self.staff_languages = self.staff_languages.filter(x => x.groupName === "Staff languages");
      self.staff_languages.sort(compare);
    },
    setRoomAmenities(){
      let list_amenities = store.hotel_amenities;
      self.room_amenities = list_amenities.filter(x => self.amenities.some(x2 => x.id === x2.toString()));
      self.room_amenities = self.room_amenities.filter(x => x.groupName === "Room");
      self.room_amenities.sort(compare);
    },
    setHotelAmenities(){
      let list_amenities = store.hotel_amenities;
      self.hotel_amenities = list_amenities.filter(x => self.amenities.some(x2 => x.id === x2.toString()));
      self.hotel_amenities = self.hotel_amenities.filter(x => x.groupName !== "Room" && x.groupName !== "Staff languages");
      self.hotel_amenities.sort(compare);

      // console.log(self.amenities.length);
      // console.log(self.hotel_amenities.length);
      // console.log(JSON.stringify(self.hotel_amenities));
    },
    setStarRating(star){
      for(let i=0; i<star; i++){
        self.stars[i] = true;
      }
    },
    openPhotoBrowser(){
        self.$refs.pb.open();
    },
    onOpen(){
      // console.log('Photo Browser is opened');
    },
    onClose(){
      let active_idx = self.$refs.pb.f7PhotoBrowser.activeIndex;
      self.img_idx = active_idx;
      // console.log(active_idx);
    },
    clearData(){
      store.hotel_details = [];
    },
    moreDeals(){
      store.hotel_search_more_deal_mode = true;
      store.list_room_deals = self.hotel_details.rooms;
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/hotel-room-deals/'});
    },
    searchAgain(){
      hotel_api.searchAgain();
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

  .hotel-photo{
    width: 100%;
    overflow: auto;
    height: 50vw;
    background-size: cover;
    background-position: center;
  }

  .hotel-photo-count{
    position: relative;
    top: 77%;
    left: 82%;
    width: 11%;
    height: 10%;
    padding: 2%;
    background-color: rgba(0,0,0,0.6);
    color: white;
    text-align: center;
    font-size: 1em;
  }

  .hotel-name{
    overflow: auto;
    margin: 10px;
    font-size: 1.15em;
  }

  .hotel-star-rating{
    overflow: auto;
    margin: 10px;
    margin-top: -10px;
    padding-bottom: 5px;
    margin-bottom: 10px;
    font-size: 1.1em;
    border-bottom: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
  }

  .hotel-guest-rating{
    overflow: auto;
    margin: 10px;
    margin-top: -5px;
    padding-bottom: 5px;
    margin-bottom: 15px;
    font-size: 1.05em;
    border-bottom: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
  }

  .checked{
    color: orange;
  }

  .border-right{
    border-right: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
  }

  .border-left{

    border-left: 1px solid grey;
    border-color: rgba(0,0,0,0.25);
  }

  .hotel-guest{
    width: 100%;
    overflow: auto;
    margin: auto;
    margin-bottom: 10px;
    text-align: center;
    font-size: 1.5em;
  }

  .hotel-guest-img{
    margin-left: 35%;
    width: 10%;
    float: left;
  }
  .hotel-guest-count{
    width: 20%;
    float: left;
  }

  .hotel-best-deal{
    overflow: auto;
    margin: 10px;
    margin-bottom: -5px;
    font-weight: bold;
  }

  .hotel-location-title{
    overflow: auto;
    margin: 10px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .hotel-marker{
    width: 95%;
    margin-top: 10px;
    padding-bottom: 5px;
    margin: auto;
    overflow: auto;
    border-bottom: 1px solid black;
    border-color: rgba(0,0,0,0.25);
  }

  .hotel-location{
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
</style>
