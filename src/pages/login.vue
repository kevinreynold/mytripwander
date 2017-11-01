<template>
  <!-- <f7-views> -->
    <f7-view id="login">
      <f7-pages>
        <f7-page class="login-screen-self bg" theme="teal">
          <f7-login-screen-title class="app-title">Trip Wander</f7-login-screen-title>

          <div class="login-input">
            <div class="field-wrap">
              <label>
                Email Address<span class="req">*</span>
              </label>
              <input type="email"/>
            </div>
            <div class="field-wrap">
              <label>
                Password<span class="req">*</span>
              </label>
              <input type="password"/>
            </div>
            <p class="forgot">Forgot Password?</p>
          </div>

          <f7-block>
            <f7-button fill v-on:click="loginapp">Sign In</f7-button>
          </f7-block>

          <f7-grid>
             <f7-col width="45"><hr></f7-col>
             <f7-col width="10"><img class="or" src="../assets/OR.png"></f7-col>
             <f7-col width="45"><hr></f7-col>
          </f7-grid>

          <f7-block>
            <a class="button-fill button btn-social-media" v-on:click="loginapp" href="#">
              <f7-grid>
                <f7-col width="10"><f7-icon fa="facebook"></f7-icon></f7-col>
                <f7-col width="90">Sign in With Facebook</f7-col>
              </f7-grid>
            </a>
            <p><a class="button-fill button btn-social-media" v-on:click="loginapp" href="#">
              <f7-grid>
                <f7-col width="10"><f7-icon fa="google-plus"></f7-icon></f7-col>
                <f7-col width="90">Sign in With Google+</f7-col>
              </f7-grid>
            </a></p>
          </f7-block>
        </f7-page>
      </f7-pages>
    </f7-view>
  <!-- </f7-views> -->
</template>

<script>
export default {
  name: "login",
  data: () => ({

  }),
  methods: {
    loginapp: function () {
      window.f7.showPreloader();
      setTimeout(function () {
        window.f7.hidePreloader();
        var mainView = Dom7('#login')[0].f7View;
        mainView.router.load({url: '/home/'});
      }, 1000);
    }
  },
  created(){
    $(document).ready(function(){
      $('.login-input').find('input').on('keyup blur focus', function (e) {
        var $this = $(this),
            label = $this.prev('label');

      	  if (e.type === 'keyup') {
      			if ($this.val() === '') {
                label.removeClass('active highlight');
              } else {
                label.addClass('active highlight');
              }
          } else if (e.type === 'blur') {
          	if( $this.val() === '' ) {
          		label.removeClass('active highlight');
      			} else {
      		    label.removeClass('highlight');
      			}
          } else if (e.type === 'focus') {

            if( $this.val() === '' ) {
          		label.removeClass('highlight');
      			}
            else if( $this.val() !== '' ) {
      		    label.addClass('highlight');
      			}
          }
      });
    });
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

  .login-input {
    width: 90%;
    margin: auto;
    margin-top: 10%;
  }

  label {
    position: absolute;
    left: 10px;
    -webkit-transform: translateY(6px);
            transform: translateY(6px);
    color: rgba(255, 255, 255, 0.4);
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
    -webkit-backface-visibility: hidden;
    pointer-events: none;
    font-size: 18px;
  }

  label .req {
    margin: 2px;
    color: #009688;
  }

  label.active {
    -webkit-transform: translateY(-15px);
            transform: translateY(-15px);
    left: 2px;
    font-size: 14px;
  }

  label.active .req {
    opacity: 0;
  }

  label.highlight {
    color: #ffffff;
  }

  input, textarea {
    font-size: 22px;
    display: block;
    width: 96%;
    height: 100%;
    padding: 7px 7px;
    background: none;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid #a0b3b0;
    color: #ffffff;
    border-radius: 0;
    -webkit-transition: border-color .25s ease, box-shadow .25s ease;
    transition: border-color .25s ease, box-shadow .25s ease;
  }

  input:focus {
    outline: 0;
    border-color: #1ab188;
  }

  .field-wrap {
    position: relative;
    margin-bottom: 9%;
  }

  .forgot {
    margin-top: -4%;
    text-align: right;
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
