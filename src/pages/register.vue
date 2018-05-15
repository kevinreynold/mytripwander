<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-back" open-login-screen></f7-link>
      </f7-nav-left>
      <f7-nav-center>Register</f7-nav-center>
    </f7-navbar>

    <form id="register-form" class="list-block">
      <ul>
        <!-- Text inputs -->
        <li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">Username</div>
              <div class="item-input">
                <input type="text" name="username" placeholder="Username">
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">Email Address</div>
              <div class="item-input">
                <input type="email" name="email" placeholder="Email">
              </div>
            </div>
          </div>
        </li>

        <!-- Select -->
        <li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">Currency</div>
              <div class="item-input">
                <select name="currency">
                  <option v-for="currency in list_currency" :key="list_currency.id">{{currency.id}} - {{currency.name}}</option>
                  <!-- <option>IDR - Indonesian Rupiah</option>
                  <option>AUD - Australian Dollar</option>
                  <option>CAD - Canadian Dollar</option>
                  <option>CNY - Chinese Yuan</option>
                  <option>EUR - Euro</option>
                  <option>HKD - Hong Kong Dollar</option>
                  <option>INR - Indian Rupee</option>
                  <option>JPY - Japanese Yen</option>
                  <option>KPW - North Korean Won</option>
                  <option>KRW - South Korean Won</option>
                  <option>MYR - Malaysian Ringgit</option>
                  <option>PHP - Philippine Peso</option>
                  <option>RUB - Russian Ruble</option>
                  <option>SGD - Singapore Dollar</option>
                  <option>TWD - New Taiwan Dollar</option>
                  <option>USD - United States Dollar</option> -->
                </select>
              </div>
            </div>
          </div>
        </li>

        <li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">Password</div>
              <div class="item-input">
                <input type="password" name="password" placeholder="Password">
              </div>
            </div>
          </div>
        </li>

        <li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title label">Confirmation Password</div>
              <div class="item-input">
                <input type="password" name="cpassword" placeholder="Password">
              </div>
            </div>
          </div>
        </li>

      </ul>
    </form>

    <!-- <form_input_self :inputs="inputs" fontColor="black" lineColor="teal"/> -->
    <f7-block>
      <f7-button fill v-on:click="doSignUp">Sign Up</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import form_input_self from '../components/form-input-self'
import plan_trip from "../js/plantrip"
import store from "../js/store"

function getDeviceToken(){
  window.FirebasePlugin.onTokenRefresh(function(token) {
      // save this server-side and use it to push notifications to this device
      store.device_token = token;
  }, function(error) {
      console.log(error);
  });
}

export default {
  name: "register",
  components: {
    form_input_self
  },
  data: () => ({
    inputs: [
      {
        name: "username",
        title: "Username",
        type: "text",
        value: "",
        req: true
      },
      {
        name: "currency",
        title: "Currency",
        type: "text",
        value: "",
        req: true
      },
      {
        name: "email",
        title: "Email Address",
        type: "email",
        value: "",
        req: true
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        value: "",
        req: true
      },
      {
        name: "confirm_password",
        title: "Confrim Password",
        type: "password",
        value: "",
        req: true
      }
    ],
    list_currency: store.list_currency
  }),
  methods: {
    doSignUp() {
      let formData = window.f7.formToData('#register-form');
      formData.currency = formData.currency.split('-')[0].trim();

      getDeviceToken();
      plan_trip.doSignUp(formData);

      // window.f7.showPreloader();
      // setTimeout(function () {
      //   window.f7.hidePreloader();
      //   var mainView = Dom7('#main-view')[0].f7View;
      //   mainView.router.back();
      // }, 1000);
    }
  }
}
</script>

<style scoped>
</style>
