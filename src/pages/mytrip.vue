<template>
  <f7-page>
    <f7-navbar title="My Trip" back-link="Back" sliding no-shadow></f7-navbar>

    <f7-toolbar tabbar>
      <f7-link href="#tab-mytrip-1" tab-link active text="Upcoming in 2 Weeks" style="font-size:0.65em;"></f7-link>
      <f7-link href="#tab-mytrip-2" tab-link active text="Upcoming"></f7-link>
      <f7-link href="#tab-mytrip-3" tab-link text="Past"></f7-link>
    </f7-toolbar>

    <f7-tabs animated swipeable>
      <f7-tab id="tab-mytrip-1" active>
        <div v-for="trip in list_my_trip_upcoming_2_weeks" :key="trip.id" class="trip-card" @click="goToEditTrip(trip.id, 'edit-place')">
          <div class="trip-display">
              <div class="passenger-trip">
                <div class="passenger-img"><img src="../assets/flight-icon/adult-white.png" alt="adult" width="15px"></div>
                <div>{{trip.plan_data.passenger.adults}}</div>
                <div class="passenger-img"><img src="../assets/flight-icon/child-white.png" alt="child" width="15px"></div>
                <div>{{trip.plan_data.passenger.children}}</div>
              </div>
              <div class="day-trip">{{totalDaysTrip(trip.plan_data)}} Days Trip - {{trip.id}}</div>
              <div class="country-trip">{{destTitle(trip.plan_data)}}</div>
              <div class="from-trip">From</div>
              <div class="from-trip">{{trip.plan_data.first_city}}</div>
              <div class="from-trip">{{trip.plan_data.start_date}}</div>
              <div class="returned-trip" v-if="trip.plan_data.return_here">* returned to hometown</div>
              <div v-if="trip.total_budget > 0" class="budget-trip"><f7-icon fa="money"/> {{currency_symbol}}{{convertPrice(trip.total_budget)}}</div>
              <div v-else class="budget-trip">Automatic</div>
          </div>
          <div class="trip-footer">
            <div class="trip-created-at">Created at : {{getDateString(trip.created_at)}}</div>
            <!-- <div class="trip-click" @click="goToEditTrip(trip.id, 'edit')"><f7-icon f7="chevron_down" size="125%"></f7-icon></div> -->
          </div>
        </div>
        <f7-button color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab-mytrip-2">
        <div v-for="trip in list_my_trip_upcoming" :key="trip.id" class="trip-card" @click="goToEditTrip(trip.id, 'edit')">
          <div class="trip-display">
              <div class="passenger-trip">
                <div class="passenger-img"><img src="../assets/flight-icon/adult-white.png" alt="adult" width="15px"></div>
                <div>{{trip.plan_data.passenger.adults}}</div>
                <div class="passenger-img"><img src="../assets/flight-icon/child-white.png" alt="child" width="15px"></div>
                <div>{{trip.plan_data.passenger.children}}</div>
              </div>
              <div class="day-trip">{{totalDaysTrip(trip.plan_data)}} Days Trip - {{trip.id}}</div>
              <div class="country-trip">{{destTitle(trip.plan_data)}}</div>
              <div class="from-trip">From</div>
              <div class="from-trip">{{trip.plan_data.first_city}}</div>
              <div class="from-trip">{{trip.plan_data.start_date}}</div>
              <div class="returned-trip" v-if="trip.plan_data.return_here">* returned to hometown</div>
              <div v-if="trip.total_budget > 0" class="budget-trip"><f7-icon fa="money"/> {{currency_symbol}}{{convertPrice(trip.total_budget)}}</div>
              <div v-else class="budget-trip">Automatic</div>
          </div>
          <div class="trip-footer">
            <div class="trip-created-at">Created at : {{getDateString(trip.created_at)}}</div>
            <!-- <div class="trip-click" @click="goToEditTrip(trip.id, 'edit')"><f7-icon f7="chevron_down" size="125%"></f7-icon></div> -->
          </div>
        </div>
        <f7-button color="white">Blank Space</f7-button>
      </f7-tab>
      <f7-tab id="tab-mytrip-3">
        <div v-for="trip in list_my_trip_past" :key="trip.id" class="trip-card" @click="goToEditTrip(trip.id, 'past')">
          <div class="trip-display">
              <div class="passenger-trip">
                <div class="passenger-img"><img src="../assets/flight-icon/adult-white.png" alt="adult" width="15px"></div>
                <div>{{trip.plan_data.passenger.adults}}</div>
                <div class="passenger-img"><img src="../assets/flight-icon/child-white.png" alt="child" width="15px"></div>
                <div>{{trip.plan_data.passenger.children}}</div>
              </div>
              <div class="day-trip">{{totalDaysTrip(trip.plan_data)}} Days Trip - {{trip.id}}</div>
              <div class="country-trip">{{destTitle(trip.plan_data)}}</div>
              <div class="from-trip">From</div>
              <div class="from-trip">{{trip.plan_data.first_city}}</div>
              <div class="from-trip">{{trip.plan_data.start_date}}</div>
              <div class="returned-trip" v-if="trip.plan_data.return_here">* returned to hometown</div>
              <div v-if="trip.total_budget > 0" class="budget-trip"><f7-icon fa="money"/> {{currency_symbol}}{{convertPrice(trip.total_budget)}}</div>
              <div v-else class="budget-trip">Automatic</div>
          </div>
          <div class="trip-footer">
            <div class="trip-created-at">Created at : {{getDateString(trip.created_at)}}</div>
            <!-- <div class="trip-click" @click="goToEditTrip(trip.id, 'past')"><f7-icon f7="chevron_down" size="125%"></f7-icon></div> -->
          </div>
        </div>
        <f7-button color="white">Blank Space</f7-button>
      </f7-tab>
    </f7-tabs>

  </f7-page>
</template>

<script>
import store from "../js/store"
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

function getDiffDays(cur_date, end_date){
  cur_date.setHours(0,0,0,0);
  end_date.setHours(0,0,0,0);

  let timeDiff = Math.abs(end_date.getTime() - cur_date.getTime());
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
}

export default {
  components: {
  },
  data: () => ({
    list_my_trip: [],
    list_my_trip_upcoming: [],
    list_my_trip_upcoming_2_weeks: [],
    list_my_trip_past: [],
    currency_symbol: store.currency_symbol
  }),
  computed: {
    totalDaysTrips(){
      return "";
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.list_my_trip = copy(store.list_my_trip);
    self.list_my_trip_upcoming = self.list_my_trip.filter(x => new Date() < new Date(x.plan_data.start_date));

    self.list_my_trip_upcoming_2_weeks = copy(self.list_my_trip_upcoming);
    self.list_my_trip_upcoming_2_weeks = self.list_my_trip_upcoming_2_weeks.filter(x => getDiffDays(new Date(), new Date(x.plan_data.start_date)) <= 14);

    self.list_my_trip_upcoming  = self.list_my_trip_upcoming.filter(x => !self.list_my_trip_upcoming_2_weeks.some(x2 => x.id.toString() == x2.id.toString()));

    self.list_my_trip_past = self.list_my_trip.filter(x => new Date() >= new Date(x.plan_data.start_date));
  },
  methods: {
    convertPrice(price){
      let result = price * store.currency_rate;
      return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    totalDaysTrip(plan_data){
      let res = 0;
      for (var i = 0; i < plan_data.list_destination.length; i++) {
        res += plan_data.list_destination[i].stay;
      }
      return res;
    },
    destTitle(plan_data){
      let res = "";
      for (var i = 0; i < plan_data.list_destination.length; i++) {
        res += plan_data.list_destination[i].country_name;
        if(i !== plan_data.list_destination.length-1){
          res += ' - ';
        }
      }
      return res;
    },
    getDateString(cur_date){
      var date = new Date(cur_date);
      return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
    },
    goToEditTrip(id, mode){
      store.plan_trip_mode = mode;
      plan_trip.loadingTrip(id);
    }
  }
}
</script>

<style scoped>
  .less-margin{
    margin-top: -1.5%;
  }

  .trip-card{
    width: 93.5%;
    overflow: auto;
    margin: 2.5%;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    border: 2px solid #009688;
  }

  .trip-footer{
    position: relative;
    width: 100%;
    height: 20px;
    padding: 5px 0;
    /* padding: 5px 4%; */
    font-size: 0.9em;
  }

  .trip-created-at{
    position: absolute;
    top: 7px;
    left: 10px;
  }

  .trip-click{
    position: absolute;
    padding: 5px 10px 5px 35px;
    top: 2px;
    right: 10px;
  }

  .trip-display{
    position: relative;
    width: 100%;
    height: 50vw;
    background: url("http://103.253.25.103/assets/trip_overview.jpg");
    background-color: rgba(0,0,0,0.5);
    background-size: cover;
    background-position: center;
    border-bottom: 2.5px solid #009688;
    color: white;
  }

  .passenger-trip{
    position: absolute;
    top: 7px;
    left: 7px;
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

  .budget-trip .icon{
    padding-bottom: 3px;
  }
</style>

<style scoped child-component="f7-tabs">
  .tab{
    overflow:auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
