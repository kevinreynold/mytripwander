<template>
  <f7-page>
    <f7-navbar title="Hotel Bookings" back-link="Back" @back-click="closePassenger" sliding no-shadow></f7-navbar>

    <f7-list form no-hairlines>
      <!-- Location -->
      <f7-list-item title="Where do you want to go?"></f7-list-item>
      <f7-list-item >
        <f7-icon slot="media"><img src="../assets/hotel-icon/location.png" alt="location" width="50px"></f7-icon>
        <f7-input type="text" class="location-finder" id="drop-down-locations"  placeholder="City, hotel or place name" v-model="new_location" @click="clearText" autocomplete="off"/>
      </f7-list-item>

      <f7-block class="less-margin" inner no-hairlines><hr></f7-block>

      <f7-grid class="flight-date">
        <f7-col width="50" class="left-col">
          <div class="col-date">
            <div class="col-title">Check-In</div>
            <div class="grid-head">
              <div class="grid-icon">
                <img src="../assets/flight-icon/depature_date.png" alt="Departure" width="30px">
              </div>
              <div class="grid-input">
                <input type="date" :min="today" :max="max_checkin" v-model="checkin_date"/>
              </div>
            </div>
          </div>
        </f7-col>
        <f7-col width="50" class="right-col">
            <div class="col-date" >
              <div class="col-title">Check-Out</div>
              <div class="grid-head">
                <div class="grid-icon">
                  <img src="../assets/flight-icon/return_date.png" alt="Departure" width="30px">
                </div>
                <div class="grid-input">
                  <input type="date" :min="min_checkout" v-model="checkout_date"/>
                </div>
              </div>
            </div>
        </f7-col>
      </f7-grid>

      <f7-block class="no-margin" inner no-hairlines><hr></f7-block>

      <f7-grid class="flight-user">
        <f7-col width="30"></f7-col>
        <f7-col width="40">
          <!-- <div class="col-date" v-on:click="changePassenger"> -->
          <div class="col-date">
            <div class="col-title" v-on:click="changePassenger">TRAVELERS</div>
            <div class="grid-head">
              <div class="grid-user">
                <div class="grid-passenger">
                  <div class="grid-image" ><img src="../assets/flight-icon/adult.png" alt="adult" width="20px"></div>
                  <!-- <span class="passenger-info">{{adults}}</span> -->
                  <div class="grid-counter">
                    <div class="counter-dec" v-on:click="passenger.adults > 1 ? passenger.adults -= 1 : 1">-</div>
                    <div class="counter-desc">{{passenger.adults}}</div>
                    <div class="counter-inc" v-on:click="passenger.adults < 4 ? passenger.adults += 1 : 4">+</div>
                  </div>
                </div>
                <div class="grid-passenger">
                  <!-- <img src="../assets/flight-icon/child.png" alt="child" width="20px"> -->
                  <!-- <span class="passenger-info">{{children}}</span> -->
                  <div class="grid-image" ><img src="../assets/flight-icon/child.png" alt="child" width="20px"></div>
                  <!-- <span class="passenger-info">{{adults}}</span> -->
                  <div class="grid-counter">
                    <div class="counter-dec" v-on:click="passenger.children > 0 ? passenger.children -= 1 : 0">-</div>
                    <div class="counter-desc">{{passenger.children}}</div>
                    <div class="counter-inc" v-on:click="passenger.children < 3 ? passenger.children += 1 : 3">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </f7-col>
        <f7-col width="30"></f7-col>
      </f7-grid>

    </f7-list>

    <div class="fixed-bottom">
      <f7-button fill big v-on:click="doSearch">Find Prices</f7-button>
    </div>
    <f7-button fill big color="white">Find Prices</f7-button>

    <f7-picker-modal id="picker-modal-passenger" theme="teal" overlay>
      <f7-navbar>
        <f7-nav-left>
          <f7-link>Travelers</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-picker="picker-modal-passenger"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-block class="modal-container" inner no-hairlines>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/adult.png" alt="adult" width="45px">
          </div>
          <div class="passenger-desc">
            Adult<br>
            <span>(above age 17)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="passenger.adults > 1 ? passenger.adults -= 1 : 1">-</div>
            <div class="counter-desc">{{passenger.adults}}</div>
            <div class="counter-inc" v-on:click="passenger.adults < 4 ? passenger.adults += 1 : 4">+</div>
          </div>
        </div>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/child.png" alt="child" width="45px">
          </div>
          <div class="passenger-desc">
            Child<br>
            <span>(age 0-17)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="passenger.children > 0 ? passenger.children -= 1 : 0">-</div>
            <div class="counter-desc">{{passenger.children}}</div>
            <div class="counter-inc" v-on:click="passenger.children < 3 ? passenger.children += 1 : 3">+</div>
          </div>
        </div>
      </f7-block>
    </f7-picker-modal>
  </f7-page>
</template>

<script>
import hotel_api from "../js/hotelsearch"
import store from "../js/store"

let self;

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

function getDateAfter(cur_date, day){
  var date = new Date(cur_date.getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

export default {
  components: {
  },
  data: () => ({
    location: {
      type : "",
      id : "",
      name : ""
    },
    new_location: '',
    today: getDateAfterDays(0),
    checkin_date: getDateAfterDays(7),
    checkout_date: getDateAfterDays(10),
    passenger: {
      adults: 1,
      children: 0
    },
    search_result: []
  }),
  computed: {
    adults(){
      return ("00" + self.passenger.adults).slice(-2);
    },
    children(){
      return ("00" + self.passenger.children).slice(-2);
    },
    max_checkin(){
      let split_checkout = self.checkout_date.split('-');
      let checkout_date = new Date(parseInt(split_checkout[0]), parseInt(split_checkout[1])-1, parseInt(split_checkout[2]));
      return getDateAfter(checkout_date, -1);
    },
    min_checkout(){
      let split_check_in = self.checkin_date.split('-');
      let check_in_date = new Date(parseInt(split_check_in[0]), parseInt(split_check_in[1])-1, parseInt(split_check_in[2]));
      return getDateAfter(check_in_date, 1);
    }
  },
  methods: {
    clearText(e){
      e.preventDefault();
      e.target.value='';
    },
    changePassenger(){
      window.f7.pickerModal("#picker-modal-passenger", true);
    },
    closePassenger(){
      window.f7.closeModal("#picker-modal-passenger", true);
    },
    doSearch(){
      //params
      if (self.location.id === "") {
        window.f7.addNotification({
            message: 'Please make sure that location is filled'
        });
      }
      else{
        var passenger_data = {
          adults: self.passenger.adults,
          children: self.passenger.children,
          checkin: self.checkin_date,
          checkout: self.checkout_date,
          type: self.location.type,
          place_id: self.location.id,
          name: self.location.name
        };

        // console.log(JSON.stringify(passenger_data));
        store.hotel_booking_data = passenger_data;
        hotel_api.hotelSearch(passenger_data);
        // hotel_api.hotelSeachLocal();
      }
    },
  },
  mounted() {
    //do something after mounting vue instance
    var autocompleteLocations = window.f7.autocomplete({
        input: '#drop-down-locations',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'results', //object's "value" property name
        textProperty: 'fullName', //object's "text" property name
        limit: 7, //limit to 20 results
        // dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: true, // expand input
        source: function (autocomplete, query, render) {
            var term = query;
            var default_url = store.service_url
            var url_request = default_url + '/autocomplete/hotels?q='+ term;

            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }

            setTimeout(function () {
              if (query != self.new_location) {
                  render(results);
                  return;
              }
              // Show Preloader
              autocomplete.showPreloader();
              // Do Ajax request to Autocomplete data
              window.Dom7.ajax({
                  url: url_request,
                  method: 'GET',
                  dataType: 'json',
                  success: function (data) {
                      for (var i = 0; i < data.length; i++) {
                          if (data[i].fullName.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                            data[i].results = data[i].fullName + ' | ' + data[i].type;
                            results.push(data[i]);
                          }
                      }
                      autocomplete.hidePreloader();
                      render(results);
                  }
              });
            }, 150);
        },
        onChange: function(autocomplete, value){
          self.location = {
            type : value.type.toLowerCase(),
            id : value.id,
            name : value.fullName
          };
        },
        onOpen: function(autocomplete){
          self.location = {
            type : "",
            id : "",
            name : ""
          };
        }
    });
  },
  created() {
    self = this;
  },
}
</script>

<style scoped>
  form li{
    margin-top: -4%;
    font-size: 0.9em;
    font-weight: bold;
    color: #009688;
  }

  select {
    text-align: center;
    text-align-last: center;
    /* webkit*/
  }
  option {
    text-align: left;
    /* reset to left*/
  }

  #swap-flight{
    margin-right: 15px;
  }

  .less-margin{
    margin: 0;
    margin-top: -5%;
  }

  .no-margin{
    margin: 0;
  }

  hr{
     display: block;
     height: 1px;
     border: 0;
     border-top: 3px solid #009688;
     border-radius: 3px;
     margin: 1em 0;
     padding: 0;
  }

  .left-col{
     border-right: 2px solid #009688;
  }

  .right-col{
     border-left: 2px solid #009688;
  }

  .col-date{
    margin-left: 15px;
  }

  .col-title{
    font-size: 0.8em;
    text-align: center;
    font-weight: bold;
    color: #009688;
  }

  .grid-head div{
    margin-top: 5px;
    float: left;
  }

  .grid-head .grid-icon{
    width: 20%;
    height: 100%;
  }

  .grid-head .grid-input{
    margin-left: 5%;
    width: 75%;
    height: 100%;
  }

  .grid-head .grid-input input{
    /*height: 100%;*/
    font-size: 0.8em;
    display: block;
    margin-top: -8%;
    padding-top: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid;
    -webkit-transition: border-color .25s ease, box-shadow .25s ease;
    transition: border-color .25s ease, box-shadow .25s ease;
    border-color: rgba(0, 0, 0, 0);
    color: #000000;
  }

  .grid-head .grid-input input:focus{
    outline: 0;
    /*border-color: #009688;*/
  }

  .grid-user{
    width: 100%;
    font-size: 0.75em;
    font-weight: 450;
    text-align: center;
  }

  .grid-user div{
    width: 100%;
  }

  .grid-user img{
    margin-bottom: -1%;
  }

  .grid-user .passenger-info{
    width: 50%;
    font-size: 1.5em;
    margin-left: 5%;
  }

  .grid-user .hidden{
    font-size: 1.5em;
  }

  .grid-user .class-user{
    font-size: 1.2em;
    font-weight: 450;
  }

  .return-fade-enter-active {
    -webkit-transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
    transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  }

  .return-fade-leave-active {
    -webkit-transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .return-fade-enter, .return-fade-leave-to {
    -webkit-transform: scaleY(0) translateZ(0);
            transform: scaleY(0) translateZ(0);
    opacity: 0;
    border: 0;
  }

  .grid-passenger{
    width: 100% !important;
    overflow: auto;
  }

  .grid-image{
    width: 25% !important;
    padding-top: 7px;
    float: left;
  }

  .grid-counter{
    width: 70% !important;
    float: left;
  }

  .grid-counter div{
    width: 28%;
    margin-top: 5%;
    border: 2px solid black;
    font-size: 1.3em;
    font-weight: 400;
    text-align: center;
    float: left;
  }

  .modal-container{
    margin-top: 0;
  }

  .passenger-input{
    width: 100%;
    margin-top: 2%;
    overflow: auto;
  }

  .passenger-icon{
    width: 15%;
    float: left;
  }

  .passenger-desc{
    margin-top: 2%;
    font-size: 1.1em;
    line-height: 0.8em;
    width: 50%;
    float: left;
  }

  .passenger-desc span{
    font-size: 0.8em;
    margin: 0;
  }

  .passenger-counter{
    width: 35%;
    float: left;
  }

  .passenger-counter div{
    width: 30%;
    margin-top: 5%;
    border: 2px solid black;
    font-size: 1.3em;
    font-weight: 400;
    text-align: center;
    float: left;
  }

  .counter-dec{
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    color:red;
  }

  .counter-desc{
    border-left: none !important;
    border-right: none !important;
  }

  .counter-inc{
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    color:green;
  }

  /* Click Effect */
  .passenger-counter .active-state {
    background-color: rgba(0,0,0,0.3);
  }

  .fixed-bottom {
   position:fixed;
   left:0px;
   bottom:0px;
   width:100%;
   overflow: auto;
   z-index: 5000;
 }

 .fixed-bottom a{
   font-size: 1.35em;
 }
</style>
