<template>
  <f7-page>
    <!--
    change profile pict
    change password
    change name
    change currency
    allow push notif
    allow email notif
    -->
    <f7-navbar title="Settings" back-link="Back" sliding></f7-navbar>
    <f7-block-title>My Profile</f7-block-title>
    <f7-list form media-list>
      <!-- <f7-list-item link="/form/" link-view="#main-view" title="Change Profile Picture"></f7-list-item> -->
      <f7-list-item title="Username" :text="username"></f7-list-item>
      <f7-list-item title="Email" :text="email"></f7-list-item>
      <f7-list-item link="#" link-view="#main-view" title="Currency" :text="currency_id + ' - ' + currency_name" @click="chooseCurrency" />
      <f7-list-item link="/changepassword/" link-view="#main-view" title="Change Password"></f7-list-item>
    </f7-list>

    <!-- <f7-block-title class="margin-cut">Notifications</f7-block-title>
    <f7-list form media-list>
      <f7-list-item title="Allow Push Notifications">
        <f7-input type="switch"></f7-input>
      </f7-list-item>
      <f7-list-item title="Allow Email Notifications">
        <f7-input type="switch"></f7-input>
      </f7-list-item>
    </f7-list> -->

    <f7-block class="margin-button" inner no-hairlines>
      <p><f7-button fill round v-on:click="doLogOut">SIGN OUT</f7-button></p>
    </f7-block>
  </f7-page>
</template>

<script>
import plan_trip from "../js/plantrip"
import store from "../js/store"

let self;

export default {
  name: 'settings',
  data: () => ({
    username: store.user_name,
    email: store.email,
    currency_id: store.currency_id,
    currency_name: store.currency_name,
  }),
  created() {
    //do something after creating vue instance
    self = this;
    self.currency_id = store.currency_id;
    self.currency_name = store.currency_name;
  },
  methods: {
    chooseCurrency(){
      plan_trip.goChooseCurrency();
    },
    doLogOut() {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.loginScreen();
      }, 1000);
    }
  }
}
</script>

<style scoped>
  .margin-cut{
    margin-top: -7%;
  }
  .margin-button{
    margin-top: -10%;
  }
</style>
