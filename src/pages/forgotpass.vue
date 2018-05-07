<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-back" open-login-screen></f7-link>
      </f7-nav-left>
      <f7-nav-center>Forgot Password</f7-nav-center>
    </f7-navbar>
    <f7-block-title class="forgot-title">Please Input Your Email Address : </f7-block-title>
    <form_input_self :inputs="inputs" fontColor="black" lineColor="teal"/>
    <f7-block>
      <f7-button fill v-on:click="doForgot">Submit</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import form_input_self from '../components/form-input-self'
import plan_trip from "../js/plantrip"
import store from "../js/store"

let self;

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default {
  name: "forgotpass",
  components: {
    form_input_self
  },
  data: () => ({
    inputs: [
      {
        name: "email",
        title: "",
        type: "email",
        value: "",
        req: false
      }
    ]
  }),
  created() {
    //do something after creating vue instance
    self = this;
  },
  methods: {
    doForgot() {
      let email = self.inputs[0].value;
      if(validateEmail(email)){
        plan_trip.forgotPassword(email);
      }
      else{
        window.f7.addNotification({
            message: 'Email address is not valid..',
            hold: 2500
        });
      }
    }
  }
}
</script>

<style scoped>
  .forgot-title{
    margin-left: 20px;
    margin-bottom: -10%;
  }
</style>
