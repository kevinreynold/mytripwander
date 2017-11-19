<template>
  <f7-page>
    <f7-navbar title="Flight Search Results" back-link="Back" sliding></f7-navbar>
    <div id="scroll-to-top"/>
    <flight_card v-for="flight_detail in flight_search_result" :flight_detail="flight_detail"/>

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
  }),
  mounted() {
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.flight_search_result = store.flight_search_result;
    // self.flight_search_result = self.flight_search_result.slice(0, 10);
    console.log(self.flight_search_result);
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }
</style>
