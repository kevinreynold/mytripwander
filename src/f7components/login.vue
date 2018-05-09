<template>
  <f7-login-screen id="login-screen" :opened='shown' @loginscreen:opened="backHome">
    <f7-view id="login">
      <f7-pages>
        <f7-page class="login-screen-self bg" theme="teal">
          <f7-login-screen-title class="app-title">Trip Wander</f7-login-screen-title>

          <form_input_self :inputs="inputs" fontColor="white" lineColor="teal">
          </form_input_self>

          <div class="forgot" @click="forgotPassword">Forgot Password?</div>

          <f7-block style="clear: both;">
            <f7-button fill v-on:click="doLogin">Sign In</f7-button>
          </f7-block>

          <div class="sign-up" @click="register">Don't have an account yet? Sign Up.</div>

          <f7-grid>
             <f7-col width="45"><hr></f7-col>
             <f7-col width="10"><img class="or" src="../assets/OR.png"></f7-col>
             <f7-col width="45"><hr></f7-col>
          </f7-grid>

          <f7-block>
            <a class="button-fill button btn-social-media" v-on:click="closeLoginScreen" href="#">
              <f7-grid>
                <f7-col width="10"><f7-icon fa="facebook"></f7-icon></f7-col>
                <f7-col width="90">Sign in With Facebook</f7-col>
              </f7-grid>
            </a>
            <p><a class="button-fill button btn-social-media" v-on:click="closeLoginScreen" href="#">
              <f7-grid>
                <f7-col width="10"><f7-icon fa="google-plus"></f7-icon></f7-col>
                <f7-col width="90">Sign in With Google+</f7-col>
              </f7-grid>
            </a></p>
          </f7-block>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-login-screen>
</template>

<script>
import form_input_self from '../components/form-input-self'
import plan_trip from "../js/plantrip"
import store from "../js/store"

let self;

export default {
  name: "login",
  components: {
    form_input_self
  },
  data: () => ({
    // Form Input
    inputs: [
      {
        name: 'email',
        title: 'Email Address',
        type: 'email',
        value: '',
        req: true
      },
      {
        name: 'password',
        title: 'Password',
        type: 'password',
        value: '',
        req: true
      }
    ]
  }),
  props:{
    shown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    doLogin() {
      let email = self.inputs[0].value;
      let password = self.inputs[1].value;

      console.log(email);
      console.log(password);

      plan_trip.doLogin(self, email, password);
    },
    closeLoginScreen() {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.closeModal('#login-screen', true);
      }, 1000);
    },
    forgotPassword(){
      window.f7.showPreloader();
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.load({url: '/forgotpass/'});
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.closeModal('#login-screen', true);
      }, 200);
    },
    register(){
      plan_trip.goSignUp();
    },
    backHome() {
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.back();
    }
  },
  created(){
    self = this;
  }
}
</script>

<style scoped>
  .login-screen-self {
    font-family: 'Roboto';
    color: white;
  }

  /* Warna Background*/
  .bg{
    /*background: #18bc9c;*/
    background: #2C3E50;
  	/*background: -webkit-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), linear-gradient(to bottom,  rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(180deg,  #2c3e50 0%,#18bc9c 75%);*/
  }

  .app-title{
    margin-top: 12%;
  }

  .forgot {
    margin: -5% 5% 3% 0%;
    overflow: hidden;
    text-align: right;
    color: #ffffff;
    float: right;
  }

  .sign-up {
    margin-top: -4%;
    margin-bottom: 3%;
    text-align: center;
    color: #ffffff;
  }

  .or{
    width: 100%;
  }

  .btn-social-media {
    width: inherit;
  	height: inherit;
  	padding: 15px 20px 15px 20px;
  	background: rgba(0, 0, 0, 0.3) !important;
  	border: 1px solid #fff;
  	font-size: 16px;
    font-weight: 300;
    line-height: 16px;
    color: #fff;
    border-radius: 4px;
  }

  .btn-social-media:active {
    outline: 0;
    opacity: 0.6;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
  }
</style>
