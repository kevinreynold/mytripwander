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
      <f7-button fill v-on:click="doChangePassword">Submit</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import form_input_self from '../components/form-input-self'
import plan_trip from "../js/plantrip"
import store from "../js/store"

let self;

export default {
  name: "register",
  components: {
    form_input_self
  },
  data: () => ({
    inputs: [
      {
        name: "old_password",
        title: "Old Password",
        type: "password",
        value: "",
        req: true
      },
      {
        name: "new_password",
        title: "New Password",
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
    ]
  }),
  created() {
    //do something after creating vue instance
    self = this;
  },
  methods: {
    doChangePassword() {
      let old_password = self.inputs[0].value;
      let new_password = self.inputs[1].value;
      let conf_password = self.inputs[2].value;
      plan_trip.changePassword(self, old_password, new_password, conf_password);
    }
  }
}
</script>

<style scoped>
</style>
