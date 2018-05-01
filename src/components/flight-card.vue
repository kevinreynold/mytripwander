<template>
  <f7-card class="ticket-result">
    <f7-card-header>
      <div class="ticket-carrier"><img class="carrier-logo" :src="flight_detail.image_url"></div>
      <div class="ticket-price">{{currency_symbol}}{{convertPrice(flight_detail.unified_price)}}</div>
    </f7-card-header>
    <f7-card-content>
      <div class="ticket-display" v-for="display in flight_detail.display">
        <div class="ticket-destination">
          <div class="flight-destination">{{display.departure_airport.airport.code}} - {{display.arrival_airport.airport.code}}</div>
          <div class="flight-time">{{display.departure_airport.time}} - {{display.arrival_airport.time}}</div>
        </div>
        <div class="ticket-duration">
          {{display.duration}}
        </div>
        <div class="ticket-etc">
          <div class="flight-transit">
            <span v-if="display.transit.length > 1">{{display.transit.length}} Transits</span>
            <span v-else-if="display.transit.length == 1">1 Transit</span>
            <span v-else-if="display.transit.length == 0">No Transit</span>
          </div>
          <div class="flight-transit-list"><span v-for="transit in display.transit">{{transit}}</span></div>
        </div>
      </div>
      <!-- <div class="ticket-display">
        <div class="ticket-destination">
          <div class="flight-destination">SUB - NRT</div>
          <div class="flight-time">06.00 - 11.25</div>
        </div>
        <div class="ticket-duration">
          27h20m
        </div>
        <div class="ticket-etc">
          <div class="flight-transit">2 Transits</div>
          <div class="flight-transit-list"><span>SIN</span><span>KHH</span></div>
        </div>
      </div> -->
    </f7-card-content>
    <f7-card-footer>
      <div class="ticket-host">{{flight_detail.host_name}}</div>
      <div class="ticket-clicked" v-on:click="showTicketDetail(flight_detail)"><f7-icon f7="chevron_down" size="150%"></f7-icon></div>
    </f7-card-footer>
  </f7-card>
</template>

<script>
import store from "../js/store"

export default {
  name: "flight-card",
  data: () => ({
    currency_symbol: store.currency_symbol
  }),
  props:{
    flight_detail: { type: Object },
  },
  mounted() {
  },
  created() {
  },
  methods: {
    convertPrice(price){
      let result = price * store.currency_rate;
      return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    showTicketDetail(flight_detail) {
      store.flight_details = flight_detail;
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/flight-detail/'});
    }
  }
}
</script>

<style scoped>
  .ticket-price{
    width: 50%;
    height: 100%;
    font-size: 1.35em;
    font-weight: bold;
    color: #2C3E50;
    text-align: right;
  }

  .ticket-carrier{
    width: 50%;
    overflow: auto;
    /*margin-top: -40px;*/
    text-align: left;
  }

  .ticket-carrier img{
    width: 35%;
    height: auto;
  }

  .carrier-logo{
    width: 50%;
  }

  .ticket-display{
    width: 100%;
    overflow: auto;
  }

  .ticket-display:first-child{
    margin-bottom: 2%;
  }

  .ticket-destination{
    width: 42%;
    overflow: auto;
    text-align: left;
    float: left;
  }

  .ticket-duration{
    width: 20%;
    overflow: auto;
    margin-top: 3%;
    font-weight: bold;
    color: rgba(0,0,0,0.5);
    text-align: left;
    float: left;
    font-size: 0.9em;
  }

  .ticket-etc{
    width: 38%;
    overflow: auto;
    text-align: right;
    float: left;
  }

  .ticket-clicked{
    width: 100%;
    text-align: right;
  }

  .flight-destination{
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
</style>
