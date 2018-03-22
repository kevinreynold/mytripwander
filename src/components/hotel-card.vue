<template>
  <f7-card class="hotel-result">
    <f7-card-header>
      <div class="hotel-header">
        <div class="hotel-name">{{hotel_detail.name}}</div>
        <div class="hotel-address">{{hotel_detail.address}}</div>
      </div>
      <div class="hotel-guest-rating"><span>{{guest_rating}}</span></div>
    </f7-card-header>
    <f7-card-content :inner="false">
      <div class="hotel-display" :style="hotel_image_url" valign="bottom">
        <div class="hotel-price">
            <div class="hotel-price-from">From</div>
            <div class="hotel-price-value">${{hotel_detail.minPriceTotal.toFixed(0)}}</div>
        </div>
      </div>
    </f7-card-content>
    <f7-card-footer>
      <div class="hotel-star-rating">
        <f7-icon :class="{ checked: stars[0] }" fa="star"></f7-icon>
        <f7-icon :class="{ checked: stars[1] }" fa="star"></f7-icon>
        <f7-icon :class="{ checked: stars[2] }" fa="star"></f7-icon>
        <f7-icon :class="{ checked: stars[3] }" fa="star"></f7-icon>
        <f7-icon :class="{ checked: stars[4] }" fa="star"></f7-icon>
      </div>
      <div class="hotel-clicked" v-on:click="showHotelDetail(hotel_detail)"><f7-icon f7="chevron_down" size="150%"></f7-icon></div>
    </f7-card-footer>
  </f7-card>
</template>

<script>
import store from "../js/store"

let self;

export default {
  name: "hotel-card",
  props:{
    hotel_detail: { type: Object },
  },
  data: () => ({
    stars: [false,false,false,false,false],
    guest_rating: 0
  }),
  computed: {
    hotel_image_url(){
      return ("background-image:url(https://photo.hotellook.com/image_v2/limit/h" + self.hotel_detail.id + "_0/640/480.jpg);");
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.setStarRating(self.hotel_detail.stars);
    self.guest_rating = (self.hotel_detail.rating/10).toFixed(1);
  },
  methods: {
    setStarRating(star){
      for(let i=0; i<star; i++){
        self.stars[i] = true;
      }
    },
    showHotelDetail(hotel_detail) {
      // console.log(hotel_detail.name);
      store.hotel_details = hotel_detail;
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/hotel-hotel-result/'});
    }
  }
}
</script>

<style scoped>
  .checked{
    color:orange;
  }

  .hotel-guest-rating{
    width: 15%;
    height: 100%;
    font-size: 1.35em;
    font-weight: bold;
    color: #2C3E50;
    text-align: right;
  }

  .hotel-guest-rating span{
    margin-left: 4px;
    font-size: 1em;
    padding: 5px;
    padding-left: 7px;
    padding-right: 7px;
    border: 1px solid #009688;
    background: #009688;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }

  .hotel-header{
    width: 85%;
    overflow: auto;
    /*margin-top: -40px;*/
    text-align: left;
    padding-bottom: 5px;
  }

  .hotel-name{
    font-size: 0.9em;
    font-weight: 500;
  }

  .hotel-address{
    font-size: 0.75em;
    color: rgba(0,0,0,0.7);
  }

  .hotel-display{
    width: 100%;
    overflow: auto;
    height: 50vw;
    background-size: cover;
    background-position: center;
  }

  .hotel-price{
    position: relative;
    top: 64%;
    left: 71%;
    width: 22%;
    height: 24%;
    padding: 2%;
    background-color: rgba(0,0,0,0.6);
    color: white;
    text-align: center;
    font-size: 1.1em;
    border-radius: 10%;
  }

  .hotel-price-from{
    text-align: left;
    font-size: 0.65em;
  }

  .hotel-price-value{
    margin-top: 1%;
    font-size: 1.2em;
    font-weight: bold;
  }

  .hotel-destination{
    width: 42.5%;
    overflow: auto;
    text-align: left;
    float: left;
  }

  .hotel-duration{
    width: 17.5%;
    overflow: auto;
    margin-top: 3%;
    font-weight: bold;
    color: rgba(0,0,0,0.5);
    text-align: left;
    float: left;
  }

  .hotel-etc{
    width: 40%;
    overflow: auto;
    text-align: right;
    float: left;
  }

  .hotel-star-rating{
    width: 70%;
    overflow: auto;
    /*margin-top: -40px;*/
    text-align: left;
  }

  .hotel-clicked{
    width: 30%;
    text-align: right;
  }

</style>
