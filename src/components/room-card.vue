<template>
  <f7-card style="border: 1.5px solid #009688; border-radius: 1%;">
    <f7-card-header>
      <div class="agency"><img class="carrier-logo" :src="agency_logo_url"></div>
      <div class="room-price">${{room_deal.total}}</div>
    </f7-card-header>
    <f7-card-content>
      <div class="room-display">
        <div class="room-desc">{{room_deal.desc}}</div>
        <div class="room-detail">
          <div>
            <ul>
              <li v-for="d in room_detail" :key="d.key"><span><f7-icon fa="check"/></span> {{d}}</li>
            </ul>
          </div>
        </div>
      </div>
    </f7-card-content>
    <f7-card-footer>
      <div></div>
      <div class="empty"></div>
      <slot></slot>
      <div class="room-book-now" v-on:click="showDeal(room_deal)">Book Now</div>
    </f7-card-footer>
  </f7-card>
</template>

<script>
import store from "../js/store"

let self;

export default {
  name: "room-card",
  props:{
    room_deal: { type: Object },
  },
  data: () => ({
    options: {},
    room_detail: []
  }),
  computed: {
    agency_logo_url(){
      return "https://pics.avs.io/hl_gates/200/200/" + self.room_deal.agencyId + ".png";
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.options = self.room_deal.options;
    self.setFacility();
  },
  methods: {
    setFacility(){
      for(let propName in self.options) {
          if(self.options.hasOwnProperty(propName)) {
            if(propName === "deposit" && self.options[propName]){
              self.room_detail.push("Pay now");
            }
            else if(propName === "deposit" && !self.options[propName]){
              self.room_detail.push("Pay at the hotel");
            }
            else if(propName === "freeWifi" && self.options[propName]){
              self.room_detail.push("Free Wi-Fi");
            }
            else if(propName === "refundable" && self.options[propName]){
              self.room_detail.push("Refundable");
            }
            else if(propName === "refundable" && !self.options[propName]){
              self.room_detail.push("Non-refundable");
            }
            else if(propName === "breakfast" && self.options[propName]){
              self.room_detail.push("Breakfast");
            }
            // console.log(propName + ": " + self.options[propName]);
          }
      }
      self.room_detail.sort();
      // "deposit": false	-> true (pay now) | false (pay at the hotel)
      // "freeWifi": true,
      // "refundable": false
      // "breakfast": false,
    },
    showDeal(room_deal) {
      let url = room_deal.fullBookingURL;
      let url_redirect = String(url);
      window.open(url_redirect, '_blank');
    }
  }
}
</script>

<style scoped>
  .room-price{
    width: 50%;
    height: 100%;
    font-size: 1.35em;
    font-weight: bold;
    color: rgb(72,139,248);
    /* color: black; */
    text-align: right;
  }

  .agency{
    width: 50%;
    overflow: auto;
    /*margin-top: -40px;*/
    text-align: left;
  }

  .agency img{
    width: 30%;
    height: auto;
  }

  .agency-logo{
    width: 50%;
  }

  .room-display{
    width: 100%;
    overflow: auto;
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

  .empty{
    width: 46%;
  }

  .book-slot{
    width: 27%;
  }
  .room-book-now{
    width: 27%;
    padding: 4px;
    overflow: auto;
    background-color: #009688;
    border: 1px solid #009688;
    color: white;
    text-align: center;
    border-radius: 3px;
    font-size: 0.9em;
  }

</style>
