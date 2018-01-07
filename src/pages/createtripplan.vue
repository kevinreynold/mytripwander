<template>
  <f7-page>
    <f7-navbar title="Plan Trip" back-link="Back" sliding></f7-navbar>
    <!-- Jumlah Passenger & Kamar-->
    <transition name="return-fade" mode="out-in">
    <div v-if="page == 0" class="tabs">
      <f7-block inner>TRAVELERS</f7-block>
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
      <f7-block class="modal-container" inner>Rooms</f7-block>
      <f7-block class="modal-container"inner no-hairlines>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/rooms.png" alt="adult" width="45px">
          </div>
          <div class="passenger-desc">
            Number of Rooms<br>
            <span>(Maximum 4)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="rooms > 1 ? rooms -= 1 : 1">-</div>
            <div class="counter-desc">{{rooms}}</div>
            <div class="counter-inc" v-on:click="rooms < 9 ? rooms += 1 : 9">+</div>
          </div>
        </div>
      </f7-block>
    </div>
    </transition>

    <!-- Pilih Destinasi-->
    <transition name="return-fade" mode="out-in">
    <div v-if="page == 1" class="tabs">
      <f7-block inner>TRAVELERS</f7-block>
      <f7-block class="modal-container" inner no-hairlines>

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

      </f7-block>
      <f7-block class="modal-container" inner>Rooms</f7-block>
      <f7-block class="modal-container"inner no-hairlines>
        <div class="passenger-input">
          <div class="passenger-icon">
            <img src="../assets/flight-icon/rooms.png" alt="adult" width="45px">
          </div>
          <div class="passenger-desc">
            Number of Rooms<br>
            <span>(Maximum 4)</span>
          </div>
          <div class="passenger-counter">
            <div class="counter-dec" v-on:click="rooms > 1 ? rooms -= 1 : 1">-</div>
            <div class="counter-desc">{{rooms}}</div>
            <div class="counter-inc" v-on:click="rooms < 9 ? rooms += 1 : 9">+</div>
          </div>
        </div>
      </f7-block>
    </div>
    </transition>


    <!-- Next Prev -->
    <div class="fixed-bottom">
      <f7-grid>
        <f7-col width="25"><f7-button fill raised color="teals" v-on:click="prevNext(-1)">Prev</f7-button></f7-col>
        <f7-col width="50"><f7-button color="black">{{page}}</f7-button></f7-col>
        <f7-col width="25"><f7-button fill raised color="teals" v-on:click="prevNext(1)">Next</f7-button></f7-col>
      </f7-grid>
    </div>
  </f7-page>
</template>

<script>
let self;

export default {
  components: {
  },
  data: () => ({
    page: 0,
    passenger: {
      adults: 1,
      children: 0,
      infants: 0
    },
    rooms: 1
  }),
  created() {
    self = this;
  },
  methods: {
    prevNext(action) {
      if((self.page > 0 && action == -1) || (self.page < 5 && action == 1)){
        var temp = self.page+=action;
        self.page = 99;
        setTimeout(function () {
          self.page = temp;
        }, 300);
      }
    }
  }
}
</script>

<style scoped>
  .modal-container{
    margin-top: -10%;
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

</style>
