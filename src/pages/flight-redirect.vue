<template>
  <f7-page>
    <f7-navbar title="TICKET" back-link="Back" sliding @back-click="clearData"></f7-navbar>
    <iframe :src="ticket_url"></iframe>
  </f7-page>
</template>

<script>
import store from "../js/store"

export default {
  components: {
  },
  data: () => ({
    ticket_url : undefined
  }),
  methods: {
    clearData(){
      store.flight_ticket_url = [];
    }
  },
  mounted() {
    //do something after mounting vue instance
    $(document).ready(function(){
      $('iframe').ready(function(){
        window.f7.popup('#popup-loading',false,false);
        // window.f7.showPreloader();
        console.log("IFRAME DONE");
      });
      $('iframe').on('load', function(){
        setTimeout(function () {
          window.f7.closeModal('#popup-loading', true);
          window.f7.hidePreloader();
        }, 1000);
        console.log("IFRAME LOAD");
      });
    });
  },
  created() {
    //do something after creating vue instance
    self = this;
    // self.ticket_url = store.flight_ticket_url.url;
    self.ticket_url = 'https://m.tiket.com/order/add/flight?flight=347200588&date=2017-12-07';
    console.log(self.ticket_url);
  }
}
</script>

<style scoped>
  iframe{
    /*position: fixed;
    top: 0px;
    left: 0px;*/
    width: 100%;
    height: 100%;
  }
</style>
