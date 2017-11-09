<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-back" back></f7-link>
      </f7-nav-left>
      <f7-nav-center>Change Password</f7-nav-center>
    </f7-navbar>
    <form_input_self :inputs="inputs" fontColor="black" lineColor="teal"/>
    <f7-block>
      <f7-button fill v-on:click="doSignUp">Submit</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import form_input_self from '../components/form-input-self'

export default {
  name: "register",
  components: {
    form_input_self
  },
  data: () => ({
    inputs: [
      {
        title: "Old Password",
        type: "password",
        req: true
      },
      {
        title: "New Password",
        type: "password",
        req: true
      },
      {
        title: "Confrim Password",
        type: "password",
        req: true
      }
    ]
  }),
  methods: {
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
