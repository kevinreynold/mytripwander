<template>
  <f7-page>
    <f7-navbar :title="currency_symbol + convertPrice(flight_details.unified_price)" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <f7-block-title class="doubled-size">Get this ticket from <span>{{flight_details.host_name}}</span> !!!</f7-block-title>
    <flight_detail :flight_details="flight_details"/>
    <div class="fixed-bottom">
      <slot v-if="flight_search_plan_mode === 'booking'">
        <f7-button fill big v-on:click="buyTicket">Buy Ticket</f7-button>
      </slot>
      <slot v-else-if="flight_search_plan_mode === 'search'">
        <f7-button fill big v-on:click="searchAgain">Search Again</f7-button>
      </slot>
      <slot v-else="flight_search_plan_mode === 'change'">
        <f7-grid>
          <f7-col width="70"><f7-button fill big v-on:click="buyTicket">Buy Ticket</f7-button></f7-col>
          <f7-col width="30"><f7-button fill big v-on:click="changeTicket">Change</f7-button></f7-col>
        </f7-grid>
      </slot>
    </div>
    <f7-button fill big color="white">Buy Ticket</f7-button>
  </f7-page>
</template>

<script>
import flight_detail from '../components/flight-detail'
import store from '../js/store'
import travelpayouts from '../js/flightsearch'

let self;

export default {
  components: {
    flight_detail
  },
  data: () => ({
    flight_details : [],
    flight_search_plan_mode: "",
    search_again_mode: false,
    currency_symbol: store.currency_symbol
  }),
  computed: {
    title(){
      return "title";
    }
  },
  mounted() {
  },
  created() {
    self = this;
    self.flight_details = store.flight_details;
    self.flight_search_plan_mode = store.flight_search_plan_mode;
    self.search_again_mode = store.search_again_mode;
    // console.log(self.flight_details);
  },
  methods: {
    convertPrice(price){
      let result = price * store.currency_rate;
      return result.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    clearData(){
      store.flight_details = [];
    },
    buyTicket(){
      travelpayouts.getRedirectLink(self.flight_details.url);
      // var mainView = Dom7('#main-view')[0].f7View;
      // mainView.router.load({url: '/flight-redirect/'});
    },
    searchAgain(){
      travelpayouts.searchAgain();
    },
    changeTicket(){
      travelpayouts.changeFlightPlan();
    }
  }
}
</script>

<style scoped>
  .fixed-bottom {
   position:fixed;
   left:0px;
   bottom:0px;
   width:100%;
   overflow: auto;
   z-index: 5000;
 }

 .fixed-bottom a{
   font-size: 1.35em;
 }

 .doubled-size{
   text-align: center;
   margin-top: 0px;
   margin-bottom: 10px;
   font-size: 1.25em;
   padding-bottom: 5px;
 }

 .doubled-size span{
   font-size: 1.1em;
   color: #009688;
 }
</style>
