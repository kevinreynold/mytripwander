<template>
  <f7-page>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <div id="scroll-to-top"/>
    <flight_card v-for="flight_detail in flight_search_result" :key="flight_detail.url" :flight_detail="flight_detail"/>

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>
  </f7-page>
</template>

<script>
import flight_card from '../components/flight-card'
import store from '../js/store'

let self;

export default {
  components: {
    flight_card
  },
  data: () => ({
    flight_search_result : [],
    flight_data : []
  }),
  computed: {
    title(){
      var depart_date = new Date(self.flight_data[0].date);
      var title = "";
      title += self.flight_data[0].origin + " - " + self.flight_data[0].destination;
      title += " (" + depart_date.getDate() + "." + (depart_date.getMonth()+1) + ")";
      if (self.flight_data.length > 1) {
        var return_date = new Date(self.flight_data[1].date);
        title += " | ";
        // title += self.flight_data[1].origin + " - " + self.flight_data[1].destination;
        title += " (" + depart_date.getDate() + "." + (depart_date.getMonth()+1) + ")";
      }
      return title;
    }
  },
  mounted() {
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.flight_search_result = store.flight_search_result;
    self.flight_data = store.flight_booking_data;
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
    // console.log(self.flight_data);
    console.log(self.flight_search_result);
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    },
    clearData(){
      store.flight_search_result = [];
      store.flight_booking_data = [];
    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }
</style>
