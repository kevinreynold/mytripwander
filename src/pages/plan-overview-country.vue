<template>
  <f7-page>
    <f7-navbar title="Plan Overview" back-link="Back" sliding no-shadow></f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab1" tab-link active text="Overview"></f7-link>
      <f7-link href="#tab2" tab-link text="Flight"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab1" active>
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
            <div class="budget-trip"><f7-icon fa="money"/> ${{totalBudget}}</div>
        </div>

        <div class="list-countries">
          <f7-card v-for="country in trip_plan_data.list_destination" :key="country.country_code">
            <f7-card-content :inner="false">
              <div class="country-display" :style="country_image_url(country.country_code)" valign="bottom">
                <div class="overlay">
                  <div class="country-title">{{country.country_name}}</div>
                  <div class="country-days">{{country.stay}} Days</div>
                </div>
              </div>
            </f7-card-content>
          </f7-card>
        </div>
        <f7-button fill big color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab2">
        <div class="list-flight">
          <f7-card v-for="flight_detail in flight_plan" :key="flight_detail.url">
            <f7-card-header>
              <div class="flight-title">{{flight_detail.display[0].departure_airport.airport.city}} | {{flight_detail.display[0].departure_airport.airport.code}}&nbsp;<f7-icon fa="arrow-right"/> {{flight_detail.display[0].arrival_airport.airport.city}} | {{flight_detail.display[0].arrival_airport.airport.code}}</div>
              <div class="flight-price">${{flight_detail.price}}</div>
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
              <div class="flight-last-search">Last Search : {{flight_detail.search_at}}</div>
            </f7-card-content>
            <f7-card-footer>
              <div class="empty"></div>
              <div class="flight-change">Change</div>
              <div class="flight-desc" @click="showFlightDetail(flight_detail)">Detail</div>
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

let self;

export default {
  components: {
  },
  data: () => ({
    test: [1,2,3],
    trip_plan_data: {},
    flight_plan: []
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
        res += self.flight_plan[i].price;
      }
      return Math.round(res * 100) / 100;
    }
  },
  mounted() {

  },
  created() {
    self = this;
    self.trip_plan_data = store.trip_plan_data;
    self.flight_plan = store.flight_plan;
  },
  methods: {
    country_image_url(country_code){
      return ("background-image:url('http://103.253.25.103/assets/country/" + country_code + ".jpg')");
    },
    showFlightDetail(flight_detail){
      store.flight_details = flight_detail;
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/flight-detail/'});
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
    background: url("../assets/bg/trip_overview.jpg");
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
    top: 45%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color:white;
    font-size: 2em;
  }

  .country-days{
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color:white;
    font-size: 1.5em;
  }

  /* FLIGHT PLAN CAD */

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
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
