<template>
  <f7-page>
    <f7-navbar :title="'$'+flight_details.price" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <f7-block-title class="doubled-size">Get this ticket from <span>{{flight_details.host_name}}</span> !!!</f7-block-title>
    <flight_detail :flight_details="flight_details"/>
    <div class="fixed-bottom">
      <f7-button fill big v-on:click="buyTicket">Search and Buy</f7-button>
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
    // console.log(self.flight_details);
  },
  methods: {
    clearData(){
      store.flight_details = [];
    },
    buyTicket(){
      travelpayouts.searchBuyAgain();
      // var mainView = Dom7('#main-view')[0].f7View;
      // mainView.router.load({url: '/flight-redirect/'});
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
   font-size: 1.4em;
   padding-bottom: 5px;
 }

 .doubled-size span{
   font-size: 1.1em;
   color: #009688;
 }
</style>
