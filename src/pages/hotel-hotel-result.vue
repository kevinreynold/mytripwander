<template>
  <!-- <f7-page infinite-scroll> -->
  <f7-page>
    <f7-navbar :title="title" back-link="Back" sliding @back-click="clearData"></f7-navbar>

    <div id="scroll-to-top"/>

    <f7-fab color="teal" @click="scrollUp">
      <f7-icon f7="arrow_up" size="250%"/>
    </f7-fab>
  </f7-page>
</template>

<script>
import flight_card from '../components/flight-card'
import store from '../js/store'

import ion_rangeslider from 'ion-rangeslider'
import ion_rangeslider_CSS from 'ion-rangeslider/css/ion.rangeSlider.css'
import ion_rangeslider_CSS_flat from '../css/ion.rangeSlider.skinCustom.css'

let self;

export default {
  components: {
  },
  data: () => ({
    hotel_city_search_result: [],
    title: "Hello"
  }),
  computed: {
  },
  mounted() {
  },
  created() {
    //do something after creating vue instance
    self = this;
  },
  methods: {
    scrollUp() {
      $('.page-content').animate({
        scrollTop: $("#scroll-to-top").offset().top
      }, 1500);
    },
    clearData(){
      store.hotel_city_search_result = [];
    }
  }
}
</script>

<style scoped>
  #scroll-to-top{
    display: none;
  }

  #filter-box{
    z-index: 5000;
  	position:fixed;
  	width:30%;
  	height:40px;
  	top:70px;
  	left:35%;
  	background-color: rgba(0, 150, 135, 0.75);
  	color:#FFF;
  	border-radius:50px;
  	text-align:center;
  	box-shadow: 1px 1px 2px #999;
    padding-top: 15px;
  }

  .separator{
    width: 0px;
    height: 20px;
    border: 1px solid white;
  }

  .not-found{
    padding-top: 60px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
  }

  .modal-container{
    margin-top: 0;
  }

  .modal-container div{
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .no-margin{
    margin: 0;
  }

  .less-margin{
    margin: 0;
    margin-top: -5%;
  }

  .button-margin{
    margin:0;
  }

  .sort-filter{
    font-size: 1em;
  }

  .filter-title{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.135);
    margin-bottom: 10px;
    color: #009688;
    font-size: 1.3em;
  }

  .filter-title span{
    margin-left: 16px;
  }

  .filter-box{
    width: 85%;
    margin:auto;
    margin-top: -10px;
  }

</style>
