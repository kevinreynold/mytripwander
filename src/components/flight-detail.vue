<template>
  <div id="flight-detail">
    <f7-card v-for="(flight_detail,index) in flight_details.segment" :key="flight_detail.key">
      <f7-card-header>
        <div class="flight-title">{{index | getCityByIndex(0)}} &nbsp;<f7-icon fa="arrow-right"/> {{index | getCityByIndex(1)}} ({{index | getSegmentDurationByIndex}})</div>
      </f7-card-header>
      <f7-card-content :inner="false">
        <f7-block inner>
          <f7-timeline>
            <slot v-for="flight_schedule in flight_detail.flight">
              <f7-timeline-item
                 :day="flight_schedule | getTimeInfo(0,'day')"
                 :month="flight_schedule | getTimeInfo(0,'month')"
                 inner
                 :time="flight_schedule | getTimeInfo(0,'time')"
                 :title="flight_schedule | getTimeInfo(0,'city')"
                 :subtitle="flight_schedule | getTimeInfo(0,'airport')"
              >
              </f7-timeline-item>
              <f7-timeline-item
                 :day="flight_schedule | getTimeInfo(1,'day')"
                 :month="flight_schedule | getTimeInfo(1,'month')"
                 inner
                 :time="flight_schedule | getTimeInfo(1,'time')"
                 :title="flight_schedule | getTimeInfo(1,'city')"
                 :subtitle="flight_schedule | getTimeInfo(1,'airport')"
              >
              </f7-timeline-item>
            </slot>
          </f7-timeline>
        </f7-block>
      </f7-card-content>
      <f7-card-footer>
        <span></span>
        <span>Operated By : {{flight_details.carriers_name}}</span>
      </f7-card-footer>
    </f7-card>
  </div>
</template>
<script>
let self;

function changeFormatDuration(duration){
  var result = "";
  if (duration > 60) {
    result += ("00" + (Math.floor(duration/60))).slice(-2) + "h ";
    result += duration % 60 + "m";
  }
  else{
    result += duration + "m";
  }
  return result;
}

export default {
  name: "flight-detail",
  props:{
    flight_details: { type: Object },
  },
  filters:{
    getCityByIndex(index, type){
      var city = "";
      if (type === 0) {
        city = self.flight_details.display[index].departure_airport.airport.city;
      }
      else{
        city = self.flight_details.display[index].arrival_airport.airport.city;
      }
      return city;
    },
    getSegmentDurationByIndex(index){
      return changeFormatDuration(self.flight_details.segment_durations[index]);
    },
    getTimeInfo(flight_schedule,type,time_part){
      var res = "";
      var flight = flight_schedule;

      var date = (type == 0)? new Date(flight.departure.date) : new Date(flight.arrival.date);
      var day = date.getDate();
      var mon = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      var month = mon[date.getMonth()];

      var time = (type == 0)? flight.departure.time : flight.arrival.time;
      var airport = (type == 0)? flight.departure.airport : flight.arrival.airport;
      var city = airport.city + " | " + airport.code;
      var airport_name = "(" + airport.name + ")";

      switch(time_part){
        case 'day':
          res = day;
          break;
        case 'month':
          res = month;
          break;
        case 'time':
          res = time;
          break;
        case 'city':
          res = city;
          break;
        case 'airport':
          res = airport_name;
          break;
      }

      return res;
    }
  },
  data: () => ({
  }),
  created() {
    self = this;
  }
}
</script>

<style scoped>
  .card-header{
    background: rgba(0, 0, 0, 0.45);
    color: white;
    font-size: 1.25em;
    font-weight: 400;
  }

  .flight-title{
    width: 100%;
    overflow: auto;
    text-align: left;
  }
</style>
