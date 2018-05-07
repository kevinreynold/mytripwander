<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-back" back></f7-link>
      </f7-nav-left>
      <f7-nav-center>Choose Currency</f7-nav-center>
    </f7-navbar>

    <f7-list>
      <f7-list-item v-for="currency in list_currency" :key="currency.id" link="#" :title="currency.id + ' - ' + currency.name + ' ('+ currency.symbol +')'" @click="chooseCurrency(currency.id)"/>
    </f7-list>


  </f7-page>
</template>

<script>
import form_input_self from '../components/form-input-self'
import plan_trip from "../js/plantrip"
import store from "../js/store"

export default {
  name: "register",
  components: {
    form_input_self
  },
  data: () => ({
    list_currency: store.list_currency
  }),
  methods: {
    chooseCurrency(id){
      plan_trip.changeCurrency(id);
    },
    doSignUp() {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.back();
      }, 1000);
    }
  }
}
</script>

<style scoped>
</style>
