<template>
  <f7-page>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>

    <div id="scroll-to-top"/>

    <div class="list-room-deals">
      <room_card v-for="room_deal in list_room_deals" :key="room_deal.bookingURL" :room_deal="room_deal"/>
    </div>

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>
  </f7-page>
</template>

<script>
import room_card from '../components/room-card'
import store from '../js/store'

let self;

export default {
  components: {
    room_card
  },
  data: () => ({
    hotel_booking_data : [],
    list_room_deals: []
  }),
  computed: {
    title(){
      let checkin = new Date(self.hotel_booking_data.checkin);
      let checkout = new Date(self.hotel_booking_data.checkout);
      let mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      let checkin_day = checkin.getDate();
      let checkin_month = mon[checkin.getMonth()];

      let checkout_day = checkout.getDate();
      let checkout_month = mon[checkout.getMonth()];

      return checkin_day + " " + checkin_month + " - " + checkout_day + " " + checkout_month;
    }
  },
  mounted() {
  },
  created() {
    //do something after creating vue instance
    self = this;
    self.hotel_booking_data = store.hotel_booking_data;
    self.list_room_deals = store.list_room_deals;

    window.f7.addNotification({
        message: self.list_room_deals.length + ' deals found.',
        hold: 3500
    });
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    },
    clearData(){
      store.list_room_deals = [];
    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }

  .list-room-deals{
    overflow: auto;
    margin-bottom: 75px;
  }
</style>
