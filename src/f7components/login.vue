<template>
  <f7-login-screen id="login-screen" :opened='shown'>
    <f7-view id="login">
      <f7-pages>
        <f7-page class="login-screen-self bg" theme="teal">
          <f7-login-screen-title class="app-title">Trip Wander</f7-login-screen-title>

          <form_input_self :inputs="inputs">
            <p class="forgot">Forgot Password?</p>
          </form_input_self>

          <f7-block>
            <f7-button fill v-on:click="doLogin">Sign In</f7-button>
          </f7-block>

          <p class="sign-up">Don't have an account yet? Sign Up.</p>

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

export default {
  name: "login",
  components: {
    form_input_self
  },
  data: () => ({
    // Form Input
    inputs: [
      {
        title: 'Email Address',
        type: 'email'
      },
      {
        title: 'Password',
        type: 'password'
      }
    ],
  }),
  props:{
    shown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    doLogin: function () {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.closeModal('#login-screen', true);
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/about/'});
        // this.$f7.mainView.router.load({url: '/about/'});
      }, 1000);
    },
    closeLoginScreen: function () {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.closeModal('#login-screen', true);
      }, 1000);
    }
  },
  created(){

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
    margin-top: -7%;
    text-align: right;
    color: #ffffff;
  }

  .sign-up {
    margin-top: -4%;
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
