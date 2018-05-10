<template>
  <f7-page>
    <!-- <f7-navbar title="Plan Overview" back-link="Back" sliding no-shadow>
      <f7-nav-right>
        <f7-link><f7-icon f7="more_vertical"/></f7-link>
      </f7-nav-right>
    </f7-navbar> -->
    <f7-navbar sliding no-shadow>
      <f7-nav-left>
        <f7-link @click="backToMainMenu"><f7-icon f7="arrow_left"/></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Plan Overview
      </f7-nav-center>
      <f7-nav-right>
        <f7-link @click="printPDFData"><f7-icon f7="download"/></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab-country-1" tab-link active text="Overview"></f7-link>
      <f7-link href="#tab-country-2" tab-link text="Flight"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab-country-1" active>
        <div class="trip-display">
            <div class="passenger-trip">
              <div class="passenger-img"><img src="../assets/flight-icon/adult-white.png" alt="adult" width="15px"></div>
              <div>{{trip_plan_data.passenger.adults}}</div>
              <div class="passenger-img"><img src="../assets/flight-icon/child-white.png" alt="child" width="15px"></div>
              <div>{{trip_plan_data.passenger.children}}</div>
            </div>
            <div class="day-trip">{{totalDaysTrip}} Days Trip</div>
            <div class="country-trip">{{destTitle}}</div>
            <div class="from-trip">From</div>
            <div class="from-trip">{{trip_plan_data.first_city}}</div>
            <div class="from-trip">{{trip_plan_data.start_date}}</div>
            <div class="returned-trip" v-if="trip_plan_data.return_here">* returned to hometown</div>
            <div class="budget-trip"><f7-icon fa="plane"/> {{currency_symbol}}{{totalBudget}}</div>
        </div>

        <div class="list-countries">
          <f7-card v-for="country, index in trip_plan_data.list_destination" :key="country.country_code">
            <f7-card-content :inner="false">
              <div class="country-display" :style="country_image_url(country.country_code)" valign="bottom" @click="cityDetail(index)">
                <div class="overlay">
                  <div class="country-title">{{country.country_name}}</div>
                  <div class="country-list-city">- {{getListCity(index)}} -</div>
                  <div class="country-days">({{country.stay}} Days)</div>
                  <div class="country-hotel-budget"><f7-icon fa="hotel"/> {{currency_symbol}}{{convertPrice(getHotelPrice(index))}}</div>
                </div>
              </div>
            </f7-card-content>
          </f7-card>
        </div>

        <div v-if="plan_trip_mode !== 'past'" class="fixed-bottom">
          <f7-button fill big @click="saveToDB">Save Changes</f7-button>
        </div>
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab-country-2">
        <div class="list-flight">
          <f7-card v-for="(flight_detail, index) in flight_plan" :key="flight_detail.url">
            <f7-card-header>
              <div class="flight-title">{{flight_detail.display[0].departure_airport.airport.city}} | {{flight_detail.display[0].departure_airport.airport.code}}&nbsp;<f7-icon fa="arrow-right"/> {{flight_detail.display[0].arrival_airport.airport.city}} | {{flight_detail.display[0].arrival_airport.airport.code}}</div>
              <div class="flight-price">{{currency_symbol}}{{convertPrice(flight_detail.unified_price)}}</div>
            </f7-card-header>
            <f7-card-content>
              <div class="flight-display">
                <div class="flight-detail">
                  <div class="flight-destination">D {{flight_detail.display[0].departure_airport.date}} | {{flight_detail.display[0].departure_airport.time}}</div>
                  <div class="flight-destination">A {{flight_detail.display[0].arrival_airport.date}} | {{flight_detail.display[0].arrival_airport.time}}</div>
                </div>
                <div class="flight-etc">
                  <div class="flight-transit">
                    <span v-if="flight_detail.display[0].transit.length > 1">{{flight_detail.display[0].transit.length}} Transits</span>
                    <span v-else-if="flight_detail.display[0].transit.length == 1">1 Transit</span>
                    <span v-else-if="flight_detail.display[0].transit.length == 0">No Transit</span>
                  </div>
                  <div class="flight-transit-list">
                    <span v-for="transit in flight_detail.display[0].transit">{{transit}}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="flight-last-search">Last Search : {{flight_detail.search_at}}</div> -->
            </f7-card-content>
            <f7-card-footer>
              <div class="empty"></div>
              <div v-if="plan_trip_mode === 'edit'" class="flight-change" @click="changeFlightTicket(flight_detail, index)">Change</div>
              <div class="flight-desc" @click="showFlightDetail(flight_detail, index)">Detail</div>
            </f7-card-footer>
          </f7-card>
        </div>
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
    </f7-tabs>

  </f7-page>
</template>

<script>
import store from "../js/store"
import travelpayouts from "../js/flightsearch"
import plan_trip from "../js/plantrip"
import jsPDF from "jspdf";

let self;

function convertPrice(price){
  let result = price * store.currency_rate;
  return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default {
  components: {
  },
  data: () => ({
    plan_trip_mode: "plan",
    trip_plan_data: {},
    trip_city_plan_data: [],
    flight_plan: [],
    currency_symbol: store.currency_symbol
  }),
  computed: {
    totalDaysTrip(){
      let res = 0;
      for (var i = 0; i < self.trip_plan_data.list_destination.length; i++) {
        res += self.trip_plan_data.list_destination[i].stay;
      }
      return res;
    },
    destTitle(){
      let res = "";
      for (var i = 0; i < self.trip_plan_data.list_destination.length; i++) {
        res += self.trip_plan_data.list_destination[i].country_name;
        if(i !== self.trip_plan_data.list_destination.length-1){
          res += ' - ';
        }
      }
      return res;
    },
    totalBudget(){
      let res = 0;
      for (var i = 0; i < self.flight_plan.length; i++) {
        res += self.flight_plan[i].unified_price;
      }
      let result = Math.round(res * 100) / 100;
      return convertPrice(result);
    }
  },
  mounted() {

  },
  created() {
    self = this;
    self.plan_trip_mode = store.plan_trip_mode;
    self.trip_plan_data = store.trip_plan_data;
    self.trip_city_plan_data = store.trip_city_plan_data;
    self.flight_plan = store.flight_plan;

    console.log('TRIP PLAN DATA');
    console.log(JSON.stringify(store.trip_plan_data));
    console.log('TRIP CITY PLAN DATA');
    console.log(JSON.stringify(store.trip_city_plan_data));
    console.log('FLIGHT PLAN');
    console.log(JSON.stringify(store.flight_plan));
  },
  methods: {
    convertPrice(price){
      let result = price * store.currency_rate;
      return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    country_image_url(country_code){
      return ("background-image:url('" + store._url + "/assets/country/" + country_code + ".jpg')");
    },
    getListCity(index){
      let res = "";
      for (var i = 0; i < store.trip_city_plan_data[index].cities.length; i++) {
        res += store.trip_city_plan_data[index].cities[i].city_name;
        if(i !== store.trip_city_plan_data[index].cities.length-1){
          res += ' - ';
        }
      }
      return res;
    },
    getHotelPrice(index){
      let result = 0;
      for (let i = 0; i < store.trip_city_plan_data[index].cities.length; i++) {
        if(store.trip_city_plan_data[index].cities[i].hotel){
          if(store.trip_city_plan_data[index].cities[i].hotel.rooms){
            result += store.trip_city_plan_data[index].cities[i].hotel.rooms[0].total;
          }
        }
      }
      return result;
    },
    showFlightDetail(flight_detail, index){
      store.flight_search_plan_mode = "search";
      store.flight_details = flight_detail;
      store.flight_plan_index = index;
      console.log(index);
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/flight-detail/'});
    },
    changeFlightTicket(flight_detail, index){
      // console.log(self.flight_plan);
      // console.log(store.flight_plan);
      store.flight_plan_index = index;
      console.log(index);
      store.flight_details = flight_detail;
      travelpayouts.searchAgain(true);
    },
    cityDetail(index){
      store.trip_city_plan_data_index = index;
      console.log(index);
      plan_trip.goToCityOverview();
    },
    saveToDB(){
      plan_trip.updateTrip();
    },
    backToMainMenu(){
      if(self.plan_trip_mode !== "past"){
        window.f7.confirm('', 'Your changes may not be saved.<br> Do you want to exit?',
        function () {
          if(self.plan_trip_mode === "plan"){
            window.f7.showPreloader();
            var mainView = Dom7('#main-view')[0].f7View;
            mainView.router.back();
            window.f7.hidePreloader();
          }
          else{
            plan_trip.backFromEditTrip();
          }
        },
        function () {
          console.log("nothing");
        });
      }
      else{
        plan_trip.backFromEditTrip();
      }
    },
    printPDFData(){
      plan_trip.makePDF();
    }
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .trip-display{
    position: relative;
    width: 100%;
    height: 50vw;
    background: url("http://103.253.25.103/assets/trip_overview.jpg");
    background-color: rgba(0,0,0,0.5);
    background-size: cover;
    background-position: center;
    color: white;
  }

  .passenger-trip{
    position: absolute;
    top: 3px;
    right: 2px;
  }

  .passenger-img{
    padding-right: 3px;
    padding-top: 2px;
  }

  .passenger-trip div{
    width: 15px;
    overflow: auto;
    float: left;
    margin-right: 2px;
  }

  .day-trip{
    padding-top: 6%;
    text-align: center;
    font-size: 1.1em;
  }

  .country-trip{
    padding-bottom: 5px;
    text-align: center;
    font-size: 1.1em;
  }

  .from-trip{
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 0.95em;
  }

  .returned-trip{
    position: absolute;
    bottom: 12px;
    left: 10px;
    font-size: 0.8em;
  }

  .budget-trip{
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 1.15em;
  }

  .country-display{
    position: relative;
    width: 100%;
    height: 45vw;
    background-size: cover;
    background-position: center;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }

  .country-title{
    position: absolute;
    top: 32.5%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color:white;
    font-size: 2em;
  }

  .country-list-city{
    position: absolute;
    top: 52.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.35em;
  }

  .country-days{
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color:white;
    font-size: 1.5em;
  }

  .country-hotel-budget{
    position: absolute;
    bottom: 5px;
    right: 10px;
    color: white;
    font-size: 1.1em;
  }

  /* FLIGHT PLAN CARD */

  .flight-title{
    width: 60%;
    height: 100%;
    text-align: left;
    font-size: 0.8em;
    font-weight: bold;
    color: rgba(0,0,0,0.7);
  }

  .flight-price{
    width: 40%;
    overflow: auto;
    /*margin-top: -40px;*/
    text-align: right;
    font-weight: bold;
    font-size: 0.9em;
    color: #2C3E50;
  }

  .carrier-logo{
    width: 50%;
  }

  .flight-display{
    width: 100%;
    overflow: auto;
  }

  .flight-display:first-child{
    margin-bottom: 2%;
  }

  .flight-detail{
    width: 60%;
    overflow: auto;
    text-align: left;
    float: left;
  }

  .flight-etc{
    width: 40%;
    overflow: auto;
    text-align: right;
    float: left;
  }

  .flight-clicked{
    width: 100%;
    text-align: right;
  }

  .flight-destination{
    margin-top: 2.5px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
  }

  .flight-transit{
    color: rgba(0, 0, 0, 0.5);
  }

  .flight-transit-list span{
    margin-left: 4px;
    font-size: 0.8em;
    padding: 2px;
    border: 1px solid #009688;
    background: #009688;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }

  .flight-last-search{
    width: 100%;
    font-size: 0.85em;
    overflow: auto;
    margin-top: 18px;
    margin-bottom: -10px;
    text-align: left;
  }

  .empty{
    width: 52%;
  }

  .flight-change{
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

  .flight-desc{
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
