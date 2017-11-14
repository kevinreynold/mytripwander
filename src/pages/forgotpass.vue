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
  methods: {
    doForgot() {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.alert('A link has been sent to your email. If no email has arrived, check your spam folder.', 'Password Reset Request Sent', function () {
            window.f7.loginScreen();
        });
      }, 1000);
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
