<template>
  <f7-page tabbar-fixed>
    <f7-navbar title="Flight Bookings" back-link="Back" @back-click="closePassenger" sliding no-shadow></f7-navbar>

    <f7-block tabs>
      <f7-tab id="tab1">
      </f7-tab>
      <f7-tab id="tab2">
      </f7-tab>
    </f7-block>

    <f7-toolbar tabbar>
      <f7-link href="#tab1" tab-link active text="One Way" @click="tabClick('one-way')"></f7-link>
      <f7-link href="#tab2" tab-link text="Round Trip" @click="tabClick('round-trip')"></f7-link>
    </f7-toolbar>

    <f7-list form no-hairlines>
      <!-- From -->
      <f7-list-item title="FROM"></f7-list-item>
      <f7-list-item >
        <f7-icon slot="media"><img src="../assets/flight-icon/departures.png" alt="Departure" width="50px"></f7-icon>
        <f7-input type="text" class="flight-destination" id="drop-down-departures"  placeholder="SUB | Surabaya, Indonesia" v-model="new_from" @click="clearText" autocomplete="off"/>
      </f7-list-item>

      <!-- To -->
      <f7-list-item title="TO">
        <div slot="content">
          <span v-on:click="swapDestination"><img id="swap-flight" src="../assets/flight-icon/swap-flight.png" alt="Departure" width="30px"></span>
        </div>
      </f7-list-item>
      <f7-list-item >
        <f7-icon slot="media"><img src="../assets/flight-icon/arrival.png" alt="Departure" width="50px"></f7-icon>
        <f7-input type="text" class="flight-destination" id="drop-down-arrivals"  placeholder="DPS | Denpasar, Indonesia" v-model="new_to" @click="clearText" autocomplete="off"/>
      </f7-list-item>

      <f7-block class="less-margin" inner no-hairlines><hr></f7-block>

      <f7-grid class="flight-date">
        <f7-col width="50" class="left-col">
          <div class="col-date">
            <div class="col-title">DEPART</div>
            <div class="grid-head">
              <div class="grid-icon">
                <img src="../assets/flight-icon/depature_date.png" alt="Departure" width="30px">
              </div>
              <div class="grid-input">
                <input type="date" :min="today" v-model="depart_date"/>
              </div>
            </div>
          </div>
        </f7-col>
        <!-- <f7-col  width="10"class="divider"/> -->
        <transition name="return-fade" mode="out-in">
        <f7-col width="50" class="right-col" v-if="mode === 'round-trip'">
            <div class="col-date" >
              <div class="col-title">RETURN</div>
              <div class="grid-head">
                <div class="grid-icon">
                  <img src="../assets/flight-icon/return_date.png" alt="Departure" width="30px">
                </div>
                <div class="grid-input">
                  <input type="date" :min="depart_date" v-model="return_date"/>
                </div>
              </div>
            </div>
        </f7-col>
        </transition>
      </f7-grid>

      <f7-block class="no-margin" inner no-hairlines><hr></f7-block>

      <f7-grid class="flight-user">
        <f7-col width="50">
          <div class="col-date" v-on:click="changePassenger">
            <div class="col-title">TRAVELERS</div>
            <div class="grid-head">
              <div class="grid-user">
                <div>
                  <img src="../assets/flight-icon/adult.png" alt="adult" width="20px">
                  <span class="passenger-info">{{adults}}</span>
                </div>
                <div>
                  <img src="../assets/flight-icon/child.png" alt="child" width="20px">
                  <span class="passenger-info">{{children}}</span>
                </div>
                <div>
                  <img src="../assets/flight-icon/infant.png" alt="infant" width="20px">
                  <span class="passenger-info">{{infants}}</span>
                </div>
              </div>
            </div>
          </div>
        </f7-col>
        <f7-col width="50">
          <div class="col-date">
            <div class="col-title">CLASS</div>
            <div class="grid-head">
              <div class="grid-user">
                <div>
                    <select type="class-user" id="booking-class">
                      <option value="Y">Economy</option>
                      <option value="C">Business</option>
                    </select>
                  <!-- <span class="class-user">Economy</span> -->
                </div>
              </div>
            </div>
          </div>
        </f7-col>
      </f7-grid>

    </f7-list>
    <f7-block class="less-margin" inner no-hairlines>
      <p><f7-button fill round v-on:click="doSearch">Search Flight</f7-button></p>
    </f7-block>

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
            <span>(above age 12)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="passenger.adults > 1 ? passenger.adults -= 1 : 1">-</div>
            <div class="counter-desc">{{passenger.adults}}</div>
            <div class="counter-inc" v-on:click="passenger.adults < 9 ? passenger.adults += 1 : 9">+</div>
          </div>
        </div>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/child.png" alt="child" width="45px">
          </div>
          <div class="passenger-desc">
            Child<br>
            <span>(age 2-12)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="passenger.children > 0 ? passenger.children -= 1 : 0">-</div>
            <div class="counter-desc">{{passenger.children}}</div>
            <div class="counter-inc" v-on:click="passenger.children < 6 ? passenger.children += 1 : 6">+</div>
          </div>
        </div>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/infant.png" alt="infant" width="45px">
          </div>
          <div class="passenger-desc">
            Infant<br>
            <span>(below age 2)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="passenger.infants > 0 ? passenger.infants -= 1 : 0">-</div>
            <div class="counter-desc">{{passenger.infants}}</div>
            <div class="counter-inc" v-on:click="passenger.infants < 6 ? passenger.infants += 1 : 6">+</div>
          </div>
        </div>
      </f7-block>
    </f7-picker-modal>
  </f7-page>
</template>

<script>
import travelpayouts from "../js/flightsearch"
import store from "../js/store"

let self;

function animateRotate(element, degree, dur){
    var elem = $(element);

    $({deg: 0}).animate({deg: degree}, {
        duration: dur,
        step: function(now){
            elem.css({
                 transform: "rotate(" + now + "deg)"
            });
        }
    });
}
function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

export default {
  components: {
  },
  data: () => ({
    mode: 'one-way',
    from: {
      city_code : "SUB",
      city_name : "Surabaya",
      country_name : "Indonesia"
    },
    to: {
      city_code : "DPS",
      city_name : "Denpasar",
      country_name : "Indonesia"
    },
    new_from: '',
    new_to: '',
    // swapDestinatiop
    isSwapped: false,
    today: getDateAfterDays(0),
    depart_date: getDateAfterDays(7),
    return_date: getDateAfterDays(10),
    passenger: {
      adults: 1,
      children: 0,
      infants: 0
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
    infants(){
      return ("00" + self.passenger.infants).slice(-2);
    }
  },
  methods: {
    tabClick(mode) {
      self.mode = mode;
    },
    clearText(e){
      e.preventDefault();
      e.target.value='';
    },
    swapDestination(){
      if (!self.isSwapped && self.new_from.trim().length>0 && self.new_to.trim().length>0) {
        self.isSwapped = !self.isSwapped;
        animateRotate("#swap-flight", 360, 1400);
        $('.flight-destination').fadeOut(700,function(){
          $('.flight-destination').fadeIn(700);
        });
        setTimeout(function () {
          let tempText = self.new_from;
          self.new_from = self.new_to;
          self.new_to = tempText;

          let tempValue = self.from;
          self.from = self.to;
          self.to = tempValue;
        }, 700);
        setTimeout(function () {
          self.isSwapped = !self.isSwapped;
        }, 1400);
      }
    },
    changePassenger(){
      window.f7.pickerModal("#picker-modal-passenger", true);
    },
    closePassenger(){
      window.f7.closeModal("#picker-modal-passenger", true);
    },
    doSearch(){
      //params
      if (self.from.city_code === self.to.city_code) {
        self.new_from = '';
        self.new_to = '';
        self.from = {
          city_code : "SUB",
          city_name : "Surabaya",
          country_name : "Indonesia"
        };
        self.to = {
          city_code : "DPS",
          city_name : "Denpasar",
          country_name : "Indonesia"
        };
        window.f7.addNotification({
            message: 'Origin and Destination Points are the Same.'
        });
      }
      else{
        var flight_data = [];
        var flight_from = {
          origin: self.from.city_code,
          destination: self.to.city_code,
          date: new Date(self.depart_date),
        };
        flight_data.push(flight_from);
        if (self.mode === "round-trip") {
          var flight_to = {
            origin: self.to.city_code,
            destination: self.from.city_code,
            date: new Date(self.return_date),
          };
          flight_data.push(flight_to);
        }

        //options
        var passenger_data = {
          host: 'mytripwander.com',
          user_ip: '127.0.0.1',
          locale: 'en',
          trip_class: document.getElementById("booking-class").options[document.getElementById("booking-class").selectedIndex].value,
          passengers: {
            adults: self.passenger.adults,
            children: self.passenger.children,
            infants: self.passenger.infants
          },
          know_english: true
        };

        // console.log(flight_data);
        // console.log(passenger_data);

        travelpayouts.getPriceListLocal();
        // travelpayouts.getPriceList(flight_data,passenger_data);
      }
    },
  },
  mounted() {
    //do something after mounting vue instance
    var autocompleteDepartures = window.f7.autocomplete({
        input: '#drop-down-departures',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'results', //object's "value" property name
        textProperty: 'city_fullname', //object's "text" property name
        limit: 10, //limit to 20 results
        // dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: false, // expand input
        source: function (autocomplete, query, render) {
            var term = query;
            var url_request = 'http://www.jetradar.com/autocomplete/places?q='+ term +'&locale=en';

            var results = [];
            if (query.length === 0) {
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
                        if (data[i].city_fullname.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                          data[i].results = data[i].city_code + ' | ' + data[i].city_fullname;
                          results.push(data[i]);
                        }
                    }
                    autocomplete.hidePreloader();
                    var unique = results.filter((set => r => !set.has(r.city_fullname) && set.add(r.city_fullname))(new Set));
                    render(unique);
                }
            });
        },
        onChange: function(autocomplete, value){
          self.from = {
            city_code : value.city_code,
            city_name : value.city_name,
            country_name : value.country_name
          };
        },
        onOpen: function(autocomplete){
          self.from = {
            city_code : "SUB",
            city_name : "Surabaya",
            country_name : "Indonesia"
          };
        }
    });
    var autocompleteArrivals = window.f7.autocomplete({
        input: '#drop-down-arrivals',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'results', //object's "value" property name
        textProperty: 'city_fullname', //object's "text" property name
        limit: 10, //limit to 20 results
        // dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: false, // expand input
        source: function (autocomplete, query, render) {
            var term = query;
            var url_request = 'http://www.jetradar.com/autocomplete/places?q='+ term +'&locale=en';

            var results = [];
            if (query.length === 0) {
                self.to = 'DPS';
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
                        if (data[i].city_fullname.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                          data[i].results = data[i].city_code + ' | ' + data[i].city_fullname;
                          results.push(data[i]);
                        }
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    var unique = results.filter((set => r => !set.has(r.city_fullname) && set.add(r.city_fullname))(new Set));
                    render(unique);
                }
            });
        },
        onChange: function(autocomplete, value){
          self.to = {
            city_code : value.city_code,
            city_name : value.city_name,
            country_name : value.country_name
          };
        },
        onOpen: function(autocomplete){
          self.to = {
            city_code : "DPS",
            city_name : "Denpasar",
            country_name : "Indonesia"
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
</style>
