<template>
  <f7-page>
    <f7-navbar title="Plan Trip" back-link="Back" sliding></f7-navbar>
    <form-wizard ref="trip_plan_wizard" stepSize="xs" color="#009688" @on-change="stepInfo" @on-complete="onComplete">
       <wizard-step
           slot-scope="props"
           slot="step"
           :tab="props.tab"
           :transition="props.transition"
           :index="props.index">
       </wizard-step>

       <tab-content ref="trip_plan_tab_0" title="Personal Details" icon="fa fa-user">
          <f7-block class="less-margin" inner>Travelers</f7-block>
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
       </tab-content>
       <tab-content ref="trip_plan_tab_1" title="Destination" icon="fa fa-map">
         <div class="list-block choose-destination">
           <!-- Kota Asal -->
           <f7-card>
             <f7-card-header>
                 Start Hometown
                 <span @click="showHelp('popover-choose-country', 'choose-country')" id="choose-country"><f7-icon f7="help" size="100%"/></span>
             </f7-card-header>
             <f7-card-content :inner="false">
                 <div class="starting-city">
                   <a href="#" id="autocomplete-standalone-popup" class="item-link item-content autocomplete-opener">
                     <span class="item-title underline">{{first_city}}</span>
                   </a>
                 </div>
                 <div class="start-date">
                   Start Date
                 </div>
                 <div class="start-input-date">
                   <input class="center" type="date" :min="today" :max="limit_date" v-model="start_date"/>
                 </div>
                 <div class="returned-here">
                   <input type="checkbox" v-model="return_here"/> I'm returning here
                 </div>
             </f7-card-content>
           </f7-card>

            <!-- Destinasi -->
            <transition-group name="return-fade">
            <f7-card v-for="(dest, index) in list_destination" :key="dest.country_code">
              <f7-card-header>
                <div class="dest-title">Country - {{index+1}}</div>
                <div class="remove-dest">
                  <span v-if="index > 0" @click="removeDest(index)"><f7-icon f7="close"/></span>
                </div>
              </f7-card-header>
              <f7-card-content :inner="false">
                  <div class="starting-city">
                    <a href="#" class="item-link item-content">
                      <span class="item-title underline" @click="addDest(index)">{{dest.country_name}}</span>
                    </a>
                  </div>
                  <f7-grid class="input-dest">
                    <f7-col width="50" class="left-col">
                      <div class="start-city">
                        Starting City :
                      </div>
                      <div class="choose-start-city">
                        <select class="select-start-city" v-model="dest.city_combination">
                          <option v-for="city, index in dest.cities" :key="city.city_code" :value="city.city_code+';'+city.hotel_city_id">{{city.city_name}}</option>
                        </select>
                      </div>
                    </f7-col>
                    <f7-col width="50" class="right-col">
                      <div class="start-city">
                        Stay Duration (Days) :
                      </div>
                      <div class="stay-duration">
                        <div class="duration-counter">
                          <div class="counter-dec" v-on:click="dest.stay > 3 ? dest.stay -= 1 : 3">-</div>
                          <div class="counter-desc">{{dest.stay}}</div>
                          <div class="counter-inc" v-on:click="dest.stay < dest.max_stay ? dest.stay += 1 : dest.max_stay">+</div>
                        </div>
                      </div>
                    </f7-col>
                  </f7-grid>
              </f7-card-content>
            </f7-card>
            </transition-group>

           <f7-block class="less-margin-2"><f7-button fill @click="addDest(-1)">Add Destination</f7-button></f7-block>
         </div>
       </tab-content>
       <tab-content ref="trip_plan_tab_2" title="Choose Plan" icon="fa fa-gear">
          <f7-card>
            <f7-card-content :inner="false">
              <div :class="{'trip-mode':true, 'mode-choosen':!mode}" @click="changeMode(false)">Suggest me a trip plan</div>
            </f7-card-content>
          </f7-card>
          <f7-card>
            <f7-card-content :inner="false">
              <div :class="{'trip-mode':true, 'mode-choosen':mode}" @click="changeMode(true)">Let me create my trip plan</div>
            </f7-card-content>
          </f7-card>
       </tab-content>
       <tab-content ref="trip_plan_tab_3" title="Interests" icon="fa fa-heart">
          <f7-block class="less-margin" inner>
            Interests <span @click="showHelp('popover-interest', 'interest-help')" id="interest-help"><f7-icon f7="help" size="100%"/></span>
          </f7-block>
          <f7-block class="modal-container" inner no-hairlines>
            <div v-for="interest in interests" :key="interest.id" class="interest-input">
              <div class="interest-icon">
                <img :src="interest.icon | interestIcon" :alt="interest.icon" width="45px">
              </div>
              <div class="interest-desc">
                {{interest.name}}<br>
                <span>({{interest.desc}})</span>
              </div>
              <div class="interest-counter">
                <div class="counter-dec" v-on:click="interest.value > -2 ? interest.value -= 1 : -2">-</div>
                <div class="counter-desc">{{interest.value}}</div>
                <div class="counter-inc" v-on:click="interest.value < 2 ? interest.value += 1 : 2">+</div>
              </div>
            </div>
          </f7-block>
       </tab-content>
       <tab-content ref="trip_plan_tab_4" title="Additional Info" icon="fa fa-plus">
         <div class="content-block-title less-margin">Budget
           <span @click="showHelp('popover-budget', 'budget')" id="budget"><f7-icon f7="help" size="100%"/></span>
         </div>
          <div class="list-block">
            <ul>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-input">
                      <input type="text" placeholder="Select Budget" readonly id="picker-budget">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="content-block-title less-margin-3">Start Hour
            <span @click="showHelp('popover-start-hour', 'start-hour')" id="start-hour"><f7-icon f7="help" size="100%"/></span>
          </div>
          <div class="list-block">
            <ul>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-input">
                      <input type="text" placeholder="Describe yourself" readonly id="picker-start-hour">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="content-block-title less-margin-3">End Hour
            <span @click="showHelp('popover-end-hour', 'end-hour')" id="end-hour"><f7-icon f7="help" size="100%"/></span>
          </div>
          <div class="list-block">
            <ul>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-input">
                      <input type="text" placeholder="Describe yourself" readonly id="picker-end-hour">
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
       </tab-content>
       <tab-content ref="trip_plan_tab_5" title="Verify" icon="fa fa-check">
         <f7-block class="less-margin" inner>
           <f7-grid>
             <f7-col width="35">
               Travelers
             </f7-col>
             <f7-col width="65">
               <f7-grid class="passenger-data less-margin-3">
                 <f7-col width="5">
                   <div class="counter-img"><img src="../assets/flight-icon/adult.png" alt="adult" width="25px"></div>
                 </f7-col>
                 <f7-col width="5">
                   <div class="counter-val">{{passenger.adults}}</div>
                 </f7-col>
                 <f7-col width="5">
                  <div class="counter-img"><img src="../assets/flight-icon/child.png" alt="child" width="25px"></div>
                 </f7-col>
                 <f7-col width="5">
                   <div class="counter-val">{{passenger.children}}</div>
                 </f7-col>
                 <f7-col width="45">
                 </f7-col>
               </f7-grid>
             </f7-col>
           </f7-grid>
         </f7-block>
         <f7-block class="less-margin-3" inner>
           <f7-grid>
             <f7-col width="35">
               Start Date
             </f7-col>
             <f7-col width="65">
               {{start_date}}
             </f7-col>
           </f7-grid>
         </f7-block>
         <f7-block class="less-margin-3" inner>
           <f7-grid>
             <f7-col width="35">
               Hometown
             </f7-col>
             <f7-col width="65">
               <div>{{first_city}}</div>
               <div v-if="return_here">(Returned Here)</div>
             </f7-col>
           </f7-grid>
         </f7-block>
         <f7-block class="less-margin-3" inner>
           <f7-grid>
             <f7-col width="35">
               Destination
             </f7-col>
             <f7-col width="65">
               <ul class="no-margin no-padding">
                 <li v-for="dest in list_destination" :key="dest.country_code">{{dest.country_name}} - {{dest.city_name}} ({{dest.stay}} Days)</li>
               </ul>
             </f7-col>
           </f7-grid>
         </f7-block>
         <f7-block class="less-margin-3" inner>
           <f7-grid>
             <f7-col width="35">
               Mode
             </f7-col>
             <f7-col width="65">
               <div v-if="mode">Self Planning</div>
               <div v-else="!mode">Suggested By MyTripWander</div>
             </f7-col>
           </f7-grid>
         </f7-block>
         <slot v-if="!mode">
           <f7-block class="less-margin-3" inner>
             <f7-grid>
               <f7-col width="35">
                 Interest
               </f7-col>
               <f7-col width="65">
                 <f7-grid class="passenger-data less-margin-3">
                   <f7-col width="7">
                     <div class="counter-img"><img src="../assets/interest-icon/must_see.png" alt="must_see" width="25px"></div>
                   </f7-col>
                   <f7-col width="8">
                     <div class="counter-val">{{interests[0].value}}</div>
                   </f7-col>
                   <f7-col width="7">
                     <div class="counter-img"><img src="../assets/interest-icon/culture.png" alt="culture" width="25px"></div>
                   </f7-col>
                   <f7-col width="8">
                     <div  class="counter-val">{{interests[1].value}}</div>
                   </f7-col>
                   <f7-col width="7">
                     <div class="counter-img"><img src="../assets/interest-icon/nature.png" alt="nature" width="25px"></div>
                   </f7-col>
                   <f7-col width="8">
                     <div  class="counter-val">{{interests[2].value}}</div>
                   </f7-col>
                   <f7-col width="7">
                     <div class="counter-img"><img src="../assets/interest-icon/recreation.png" alt="recreation" width="25px"></div>
                   </f7-col>
                   <f7-col width="8">
                     <div  class="counter-val">{{interests[3].value}}</div>
                   </f7-col>
                   <f7-col width="5">
                   </f7-col>
                 </f7-grid>
               </f7-col>
             </f7-grid>
           </f7-block>
           <f7-block class="less-margin-3" inner>
             <f7-grid>
               <f7-col width="35">
                 Budget
               </f7-col>
               <f7-col width="65">
                 {{budget}}
               </f7-col>
             </f7-grid>
           </f7-block>
           <f7-block class="less-margin-3" inner>
             <f7-grid>
               <f7-col width="35">
                 Start Hour
               </f7-col>
               <f7-col width="65">
                 {{start_hour}}
               </f7-col>
             </f7-grid>
           </f7-block>
           <f7-block class="less-margin-3" inner>
             <f7-grid>
               <f7-col width="35">
                 End Hour
               </f7-col>
               <f7-col width="65">
                 {{end_hour}}
               </f7-col>
             </f7-grid>
           </f7-block>
         </slot>
       </tab-content>

       <div slot="footer" slot-scope="props">
         <div class="wizard-footer-left">
             <wizard-button v-if="props.activeTabIndex > 0" @click.native="prevTabPlan"  :style="props.fillButtonStyle">Back</wizard-button>
          </div>
          <div class="wizard-footer-right">
            <wizard-button v-if="!props.isLastStep" @click.native="nextTabPlan" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>

            <wizard-button v-else @click.native="finishStep" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">  {{props.isLastStep ? 'Finish' : 'Next'}}</wizard-button>
          </div>
        </div>
    </form-wizard>

    <f7-popup id="popup-country">
      <f7-navbar>
        <f7-nav-left>
          <f7-link>List Country</f7-link>
        </f7-nav-left>
        <f7-nav-right>
          <f7-link close-popup="#popup-country"><f7-icon f7="close"/></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-searchbar
      cancel-link="Cancel"
      search-list="#search-country-list"
      placeholder="Search Country"
      :clear-button="true"
      ></f7-searchbar>

      <f7-list class="searchbar-not-found">
        <f7-list-item title="Nothing found"></f7-list-item>
      </f7-list>

      <f7-list class="searchbar-found" id="search-country-list">
        <f7-list-item v-for="item in list_destination_available" :key="item.country_code" :title="item.country_name" @click="chooseCountry(item)"></f7-list-item>
      </f7-list>
    </f7-popup>

    <f7-popover id="popover-choose-country">
      <div class="popover-body">
        <ul>
          <li>Travelers currently can travel to 3 countries : Hong Kong, Taiwan and South Korea</li>
          <li>Travelers can travel at least 3 days country.</li>
          <li>Travelers can travel to Hong Kong up to 6 days.</li>
          <li>Travelers can travel to Taiwan up to 15 days</li>
          <li>Travelers can travel to South Korea up to 9 days</li>
          <li>Travelers can travel to Taipei, Tainan, Hsinchu, Taichung and Kaohsiung at Taiwan.</li>
          <li>Travelers can travel to Seoul, Busan, Hsinchu, Gyeongju at South Korea.</li>
        </ul>
      </div>
    </f7-popover>
    <f7-popover id="popover-interest">
      <div class="popover-body">
        <ul>
          <li>Every interest has range from -2 to 2</li>
          <li>0 means neutral</li>
          <li>Below than 0 means travelers are not interested.</li>
          <li>More than 0 means travelers are really interested.</li>
          <li>The More/Lower points means degree level of interest.</li>
        </ul>
      </div>
    </f7-popover>
    <f7-popover id="popover-budget">
      <div class="popover-body">
        <p>Low Budget : search hotel/accomodation lower than 3 stars.</p>
        <p>High Budget : search hotel/accomodation 4 or 5 stars.</p>
      </div>
    </f7-popover>
    <f7-popover id="popover-start-hour">
      <div class="popover-body">
        <p>Choose time to start daily activites every day.</p>
        <p>Start hours range from 07:00 - 09:50.</p>
      </div>
    </f7-popover>
    <f7-popover id="popover-end-hour">
      <div class="popover-body">
        <p>Choose time to end daily activites every day.</p>
        <p>End hours range from 20:00 - 22:50.</p>
      </div>
    </f7-popover>
  </f7-page>
</template>

<script>
import plan_trip from "../js/plantrip"
import travelpayouts from "../js/flightsearch"
import store from "../js/store"

let self;
let pickerBudget, pickerStartHour, pickerEndHour;

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

export default {
  components: {
  },
  data: () => ({
    page: 0,
    today: getDateAfterDays(7),
    limit_date: getDateAfterDays(372),
    start_date: getDateAfterDays(7),
    list_destination_original: [],
    list_destination: [],
    list_destination_idx: [],
    list_destination_available: [],
    current_dest_idx: 0,
    first_city: "Select your first city",
    first_city_code: "",
    first_city_title: "",
    passenger: {
      adults: 1,
      children: 0
    },
    return_here: false,
    mode: false, //0 -> automatic | 1 -> manual
    interests: [
      {
        id: 1,
        name: "Must See",
        desc: "Top rated places",
        value: 0,
        icon: "must_see"
      },
      {
        id: 2,
        name: "Culture",
        desc: "Museum, Historical Places, etc.",
        value: 0,
        icon: "culture"
      },
      {
        id: 3,
        name: "Nature",
        desc: "Mountain, Beach, Waterfall, etc.",
        value: 0,
        icon: "nature"
      },
      {
        id: 4,
        name: "Recreation",
        desc: "Theme Park, Park, Mall, Education Centre, etc.",
        value: 0,
        icon: "recreation"
      }
    ],
    budget: "",
    start_hour: "",
    end_hour: "",
    last_tab_index: 0
  }),
  filters:{
    interestIcon(icon){
      var images = require.context('../assets/interest-icon', false, /\.png$/);
      return images('./' + icon + ".png")
    }
  },
  mounted(){
    plan_trip.getDestinationList();
    setTimeout(function () {
      self.list_destination_original = copy(store.list_dest_all);
      let first_dest = self.list_destination_original[0];
      let dest = {
        country_code : first_dest.country_code,
        country_name : first_dest.country_name,
        max_stay : (first_dest.country_code === 'HK')? 6 : first_dest.total_city * 3,
        stay : 3,
        cities: first_dest.cities,
        city_combination : [first_dest.cities[0].city_code, first_dest.cities[0].hotel_city_id].join(';'),
        city_code : first_dest.cities[0].city_code,
        city_name : first_dest.cities[0].city_name,
        hotel_city_id : first_dest.cities[0].hotel_city_id,
        last_city_code : first_dest.cities[0].city_code,
        last_city_name : first_dest.cities[0].city_name,
        last_hotel_city_id : first_dest.cities[0].hotel_city_id
      }
      self.list_destination.push(dest);
      self.list_destination_idx.push(first_dest.country_code);
      self.list_destination_available = self.list_destination_original.filter(x => !self.list_destination_idx.some(x2 => x.country_code === x2.toString()));

      pickerBudget.open();
      pickerBudget.close();
      pickerStartHour.open();
      pickerStartHour.close();
      pickerEndHour.open();
      pickerEndHour.close();

    }, 1500);

    var $$ = window.Dom7;
    var autocompleteStandalonePopup = window.f7.autocomplete({
        openIn: 'popup', //open in popup
        opener: $$('#autocomplete-standalone-popup'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        preloader: true, //enable preloader
        valueProperty: 'city_fullname', //object's "value" property name
        textProperty: 'city_fullname', //object's "text" property name
        limit: 20, //limit to 20 results
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
                        if (data[i].city_fullname.toLowerCase().indexOf(term.toLowerCase()) >= 0 || data[i].city_code.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
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
        onChange: function (autocomplete, value) {
          self.first_city = value[0].city_fullname;
          self.first_city_code = value[0].city_code;
          self.first_city_title =  value[0].title;
        }
    });

    pickerBudget = window.f7.picker({
        input: '#picker-budget',
        cols: [
            {
                textAlign: 'center',
                values: ['Low', 'High']
            }
        ]
    });

    pickerStartHour = window.f7.picker({
        input: '#picker-start-hour',
        rotateEffect: true,
        formatValue: function (picker, values) {
            return values[0] + ":" + values[1];
        },
        cols: [
            {
                textAlign: 'left',
                values: ('07 08 09').split(' ')
            },
            {
                values: ('00 05 10 15 20 25 30 35 40 45 50').split(' ')
            },
        ],
    });

    pickerEndHour = window.f7.picker({
        input: '#picker-end-hour',
        rotateEffect: true,
        formatValue: function (picker, values) {
            return values[0] + ":" + values[1];
        },
        cols: [
            {
                textAlign: 'left',
                values: ('20 21 22').split(' ')
            },
            {
                values: ('00 05 10 15 20 25 30 35 40 45 50').split(' ')
            },
        ]
    });

    $(document).ready(function(){
      $(".content-block-inner").css("margin-left","0px");
    });
  },
  created() {
    self = this;
  },
  methods: {
    stepInfo(prevIndex, nextIndex){
      // console.log(prevIndex + " - " + nextIndex);
      // if(nextIndex === 5){
       // self.$refs.trip_plan_wizard.changeTab(0,3);
      // }

    },
    prevTabPlan(){
      //prev untuk last step
      let trip_plan_wizard =  self.$refs.trip_plan_wizard;
      if(self.last_tab_index === 2 && trip_plan_wizard.activeTabIndex === 5){
        trip_plan_wizard.changeTab(self.last_tab_index, 2);
        self.last_tab_index = trip_plan_wizard.activeTabIndex;
      }
      else{
        self.last_tab_index = trip_plan_wizard.activeTabIndex;
        trip_plan_wizard.prevTab();
      }
    },
    nextTabPlan(){
      //next untuk choose plan dan destination
      let trip_plan_wizard =  self.$refs.trip_plan_wizard;
      self.last_tab_index = trip_plan_wizard.activeTabIndex;
      if(trip_plan_wizard.activeTabIndex === 1){
        if(self.first_city === "Select your first city"){
          window.f7.addNotification({
              message: 'First city is required. Please fill it first.',
              hold: 2500
          });
        }
        else{
          trip_plan_wizard.nextTab();
        }
      }
      else if(trip_plan_wizard.activeTabIndex === 2){
        if(self.mode) { //manual
          self.$refs.trip_plan_tab_3.checked = false;
          self.$refs.trip_plan_tab_4.checked = false;

          for (var i = 0; i < self.list_destination.length; i++) {
            self.list_destination[i].city_name = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].text;
            self.list_destination[i].city_combination = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].value;
            console.log(self.list_destination[i].city_combination);
            let split_string = self.list_destination[i].city_combination.split(';');
            self.list_destination[i].city_code = split_string[0];
            self.list_destination[i].hotel_city_id = split_string[1];

            self.list_destination[i].last_city_name = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].text;
            self.list_destination[i].last_city_code = split_string[0];
            self.list_destination[i].last_hotel_city_id = split_string[1];
          }
          trip_plan_wizard.changeTab(self.last_tab_index, 5);
        }
        else{
          trip_plan_wizard.nextTab();
        }
      }
      else if(trip_plan_wizard.activeTabIndex === 4){
        self.budget = pickerBudget.displayValue[0];
        self.start_hour = pickerStartHour.displayValue[0] + ":" + pickerStartHour.displayValue[1];
        self.end_hour = pickerEndHour.displayValue[0] + ":" + pickerEndHour.displayValue[1];

        for (var i = 0; i < self.list_destination.length; i++) {
          self.list_destination[i].city_name = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].text;
          self.list_destination[i].city_combination = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].value;
          console.log(self.list_destination[i].city_combination);
          let split_string = self.list_destination[i].city_combination.split(';');
          self.list_destination[i].city_code = split_string[0];
          self.list_destination[i].hotel_city_id = split_string[1];

          self.list_destination[i].last_city_name = document.getElementsByClassName("select-start-city")[i].options[document.getElementsByClassName("select-start-city")[i].selectedIndex].text;
          self.list_destination[i].last_city_code = split_string[0];
          self.list_destination[i].last_hotel_city_id = split_string[1];
        }
        trip_plan_wizard.nextTab();
      }
      else{
        trip_plan_wizard.nextTab();
      }
    },
    finishStep(){
      store.trip_plan_data = {
        passenger: self.passenger,
        start_date: self.start_date,
        first_city: self.first_city,
        first_city_code: self.first_city_code,
        first_city_title: self.first_city_title,
        return_here: self.return_here,
        list_destination: self.list_destination,
        mode: self.mode,
        interests: self.interests,
        budget: self.budget,
        start_hour: self.start_hour,
        end_hour: self.end_hour
      };

      // console.log(JSON.stringify(store.trip_plan_data));
      // console.log(self.start_date);

      if(!self.mode){ //otomatis
        plan_trip.goAutoPlan();
      }else{
        travelpayouts.getFlightPlan();
      }
    },
    addDest(idx){
      if (self.list_destination.length < 3) {
        self.current_dest_idx = idx;
        window.f7.popup("#popup-country", true);
      }
    },
    removeDest(index){
      window.f7.showPreloader();
      setTimeout(function(){
        self.list_destination.splice(index, 1);
        self.list_destination_idx.splice(index, 1);
        self.list_destination_available = self.list_destination_original.filter(x => !self.list_destination_idx.some(x2 => x.country_code === x2.toString()));
        window.f7.hidePreloader();
      }, 500);
    },
    chooseCountry(item){
        let first_dest = item;
        let dest = {
          country_code : first_dest.country_code,
          country_name : first_dest.country_name,
          max_stay : (first_dest.country_code === 'HK')? 5 : (first_dest.total_city + 1) * 2,
          stay : 3,
          cities: first_dest.cities,
          city_combination : [first_dest.cities[0].city_code, first_dest.cities[0].hotel_city_id].join(';'),
          city_code : first_dest.cities[0].city_code,
          city_name : first_dest.cities[0].city_name,
          hotel_city_id : first_dest.cities[0].hotel_city_id,
          last_city_code : first_dest.cities[0].city_code,
          last_city_name : first_dest.cities[0].city_name,
          last_hotel_city_id : first_dest.cities[0].hotel_city_id
        }

        if(self.current_dest_idx === -1){
          self.list_destination.push(dest);
          self.list_destination_idx.push(first_dest.country_code);
        }
        else{
          self.list_destination.splice(self.current_dest_idx, 1);
          self.list_destination_idx.splice(self.current_dest_idx, 1);

          self.list_destination.splice(self.current_dest_idx, 0, dest);
          self.list_destination_idx.splice(self.current_dest_idx, 0, first_dest.country_code);
        }

        self.list_destination_available = self.list_destination_original.filter(x => !self.list_destination_idx.some(x2 => x.country_code === x2.toString()));

        window.f7.showPreloader();
        $('.page-content').animate({
          scrollTop: $(".choose-destination").height()
        }, 1000);
        setTimeout(function(){
          window.f7.closeModal("#popup-country", true);
          window.f7.hidePreloader();
        }, 1000);
    },
    changeMode(mode){
      self.mode = mode;
      // if(self.mode) { //manual
      //   self.$refs.trip_plan_tab_3.checked = false;
      //   self.$refs.trip_plan_tab_4.checked = false;
      // }
      // else{
      //   self.$refs.trip_plan_tab_3.checked = true;
      //   self.$refs.trip_plan_tab_4.checked = true;
      // }
      $(document).ready(function(){
        $(".content-block-inner").css("margin-left","0px");
      });
    },
    showHelp(popover, target){
      window.f7.popover("#"+popover, "#"+target, true);
    },
    onComplete(){
      console.log("finish");
    }
  }
}
</script>

<style scoped>
  .no-margin{
    margin: 0;
  }
  .no-padding{
    padding: 0;
    padding-left: 15px;
  }
  .less-margin{
    padding: 0;
    padding-top: 7px;
    margin-top: -1.5%;
  }
  .less-margin-2{
    margin-top: 3.5%;
    padding-left: 8px;
    padding-right: 8px;
  }
  .less-margin-3{
    padding: 0;
    margin-top: -5%;
  }

  .font-bigger{
    font-size: 2em;
  }

  .modal-container{
    margin-top: -10%;
  }

  .passenger-input, .interest-input{
    width: 100%;
    margin-top: 5%;
    overflow: auto;
  }

  .passenger-icon, .interest-icon{
    width: 17%;
    float: left;
  }

  .passenger-desc, .interest-desc{
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

  .interest-desc span{
    text-align: center;
    font-size: 0.7em;
    margin: 0;
  }

  .passenger-counter, .interest-counter{
    width: 33%;
    float: left;
  }

  .passenger-counter div, .interest-counter div{
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
  .passenger-counter .active-state{
    background-color: rgba(0,0,0,0.3);
  }

  .fixed-bottom {
   position:fixed;
   left:0px;
   bottom:10px;
   width:90%;
   margin: 5%;
   overflow: auto;
   z-index: 5000;
 }

 /* Choose Destionation */
 .choose-destination{
   margin-top: -4.5%;
 }

 .card-header{
   min-height: 40px;
   background-color: #009688;
   color: white;
 }

 .starting-city{
   font-size: 1.35em;
   text-align: center;
   color: #009688;
 }

 .starting-city a{
   margin: 0;
   padding: 0;
 }

 .starting-city a span{
   margin: auto;
 }

 .underline{
   border-bottom: 3px dashed #009688;
 }

 .start-date{
   width: 100%;
   margin: auto;
   margin-top: 0px;
   text-align: center;
 }

 .start-input-date{
   width: 100%;
   margin: auto;
   margin-top: -5px;
   margin-left: 8.5px;
 }

 .center{
   text-align: center;
 }

 input[type=date]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
 }

 input[type=date]::-webkit-calendar-picker-indicator {
    -webkit-appearance: none;
    display: none;
 }

 .start-city{
   width: 100%;
   margin: auto;
   margin-top: 0px;
   text-align: center;
   font-size: 0.9em;
 }

 .choose-start-city{
   width: 100%;
   margin: auto;
   text-align: center;
 }

 .stay-duration{
   width: 100%;
   overflow: auto;
   margin: auto;
   margin-top: 2px;
   text-align: center;
   text-align-last: center;
   font-size: 1.3em;
   font-weight: 400;
   color: #009688;
 }

 .duration-counter{
   width: 60%;
   overflow: auto;
   margin: auto;
 }

 .duration-counter div{
   width: 30%;
   height: 27px;
   border: 1.5px solid black;
   font-size: 1em;
   font-weight: 400;
   padding-top: 0;
   text-align: center;
   float: left;
 }

 .duration-counter .counter-dec{
   border-top-left-radius: 2px;
   border-bottom-left-radius: 2px;
   color:red;
 }

 .duration-counter .counter-desc{
   border-left: none !important;
   border-right: none !important;
 }

 .duration-counter .counter-inc{
   border-top-right-radius: 2px;
   border-bottom-right-radius: 2px;
   color:green;
 }

 .choose-start-city select{
   width: 100%;
   overflow: auto;
   margin: auto;
   margin-top: -5px;
   text-align: center;
   text-align-last: center;
   font-weight: 400;
   color: #009688;
 }

 .input-dest{
   padding: 10px;
 }

 .left-col{
    border-right: 1px solid #009688;
    height: 55px;
 }

 .right-col{
    border-left: 1px solid #009688;
    height: 55px;
 }

 .returned-here{
   text-align: right;
   margin: 2%;
 }

 .dest-title{
   width: 50%;
   overflow: auto;
   text-align: left;
 }

 .remove-dest{
   width: 50%;
   overflow: auto;
   text-align: right;
 }

 .trip-mode{
   width: 100%;
   height: 40vw;
   margin-bottom: 10%;
   text-align: center;
   padding-top: 17%;
   font-size: 1.2em;
   font-weight: bold;
   color: #009688;
   border: 3px solid #009688;
   border-radius: 3px;
 }

 .mode-choosen{
   background-color: #009688;
   color: white;
 }

 .trip-mode, .mode-choosen{
   transition: 0.5s;
 }

 /* animation page */
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

 .popover{
   margin-top: 20px;
 }

 .popover-body{
   padding: 10px;
 }

 .counter-img{
   margin-top: 8px;
 }

 .counter-val{
   margin-top: 9px;
   font-size: 1.2em;
   font-weight: bold;
 }
</style>
