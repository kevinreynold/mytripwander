<template>

  <f7-views>
    <f7-view id="main-view" navbar-through :dynamic-navbar="true" theme="teal" main>
      <!-- Pages -->
      <f7-pages>
        <f7-page>
          <!-- Material Theme Navbar -->
          <f7-navbar>
            <f7-nav-left>
              <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center sliding>Home</f7-nav-center>
            <f7-nav-right>
              <f7-link open-panel="right"><f7-icon f7="bell"/></f7-link>
              <!-- <f7-link open-panel="right"></f7-link> -->
            </f7-nav-right>
          </f7-navbar>
          <!-- Page Content -->
          <div class="slider-menu">
            <f7-swiper pagination>
              <f7-swiper-slide>
                <div class="slider-background" :style="country_image_url('TW')"></div>
              </f7-swiper-slide>
              <f7-swiper-slide>
                <div class="slider-background" :style="country_image_url('HK')"></div>
              </f7-swiper-slide>
              <f7-swiper-slide>
                <div class="slider-background" :style="country_image_url('KR')"></div>
              </f7-swiper-slide>
            </f7-swiper>
          </div>
          <div class="main-menu">
            <div class="my-trip menu-box" @click="goToMyTrip">
              <div class="menu-inside">
                <div class="menu-icon"><f7-icon fa="home" size="250%"/></div>
                <div class="menu-title">My Trip</div>
              </div>
            </div>
            <div class="plan-trip menu-box" @click="goTo('/createtrip/')">
              <div class="menu-inside">
                <div class="menu-icon"><f7-icon fa="map" size="250%"/></div>
                <div class="menu-title">Plan Trip</div>
              </div>
            </div>
            <div class="booking-flight menu-box" @click="goTo('/flight/')">
              <div class="menu-inside">
                <div class="menu-icon"><f7-icon fa="plane" size="250%"/></div>
                <div class="menu-title">Book Flight</div>
              </div>
            </div>
            <div class="booking-hotel menu-box" @click="goTo('/hotel/')">
              <div class="menu-inside">
                <div class="menu-icon"><f7-icon fa="hotel" size="250%"/></div>
                <div class="menu-title">Book Hotel</div>
              </div>
            </div>
          </div>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-views>
</template>

<script>
  import plan_trip from "../js/plantrip"
  import store from "../js/store"
  import jsPDF from "jspdf";

  export default {
    name: 'main-view',
    data () {
      return {

      }
    },
    mounted() {
      //do something after mounting vue instance
    },
    created () {
      // plan_trip.getCurrencyData(store.currency_id);
    },
    methods: {
      country_image_url(country_code){
        return ("background-image:url('" + store._url + "/assets/country/" + country_code + ".jpg')");
      },
      goTo(url_link){
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: url_link});
      },
      goToMyTrip(){
        plan_trip.goToMyTrip();
      }
    }
  }
</script>

<style scoped>
  .slider-menu{
    width: 100%;
    height: 30%;
  }

  .swiper-container{
    height: 100%;
  }

  .slider-background{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    background-size: cover;
    background-position: center;
  }

  .main-menu{
    position: relative;
    width: 100%;
    height: 70%;
  }

  .menu-box{
    background: #009688;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .my-trip{
    top: 3.5%;
    left: 5%;
    position: absolute;
    width: 42.5%;
    height: 65%;
  }

  .plan-trip{
    top: 71.5%;
    left: 5%;
    position: absolute;
    width: 90%;
    height: 25%;
  }

  .booking-flight{
    top: 3.5%;
    left: 52.5%;
    position: absolute;
    width: 42.5%;
    height: 31.5%;
  }

  .booking-hotel{
    top: 37%;
    left: 52.5%;
    position: absolute;
    width: 42.5%;
    height: 31.5%;
  }

  .menu-inside{
    position: relative;
    width: 100%;
    height: 100%;
  }

  .booking-hotel .menu-icon, .booking-flight .menu-icon{
    position: absolute;
    top: 40%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.3em;
  }

  .my-trip .menu-icon{
    position: absolute;
    top: 47.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.3em;
  }

  .plan-trip .menu-icon{
    position: absolute;
    top: 37.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.1em;
  }

  .booking-hotel .menu-title, .booking-flight .menu-title{
    position: absolute;
    top: 67.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.3em;
  }

  .my-trip .menu-title{
    position: absolute;
    top: 62.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.3em;
  }

  .plan-trip .menu-title{
    position: absolute;
    top: 72.5%;
    left: 0%;
    width: 100%;
    text-align: center;
    color: white;
    transform: translateY(-50%);
    font-size: 1.3em;
  }

</style>
