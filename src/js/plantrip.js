import store from "./store";
import travelpayouts from "./flightsearch";
import hotel_api from "./hotelsearch";
import got from "got";
import moment from "moment";

var plan_trip = {};

function goTo(url_link = '/createtrip/'){
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.load({url: url_link});
}

function goBack(){
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.back();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

plan_trip.getDestinationList = async function(){
    window.f7.showPreloader();
    try {
      if(store.list_dest_all.length === 0){
        var data = await got.get(store.service_url +"/city/dest", {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });

        store.list_dest_all = data.result;
      }

      await sleep(500);
      window.f7.hidePreloader();
    } catch (e) {
      await sleep(500);
      goBack();
      await sleep(500);
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }
}

plan_trip.getAllCity = async function(){
    window.f7.showPreloader();
    try {
      if(store.list_city_all.length === 0){
        var data = await got.get(store.service_url +"/city/all", {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });

        store.list_city_all = data.result;
      }

      setTimeout(function () {
        window.f7.hidePreloader();
      }, 500);
    } catch (e) {
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.addNotification({
            message: 'No Internet Connection..'
        });
        goBack();
      }, 1000);
    }
}

plan_trip.goToCityOverview = async function(){
  window.f7.showPreloader();
  await this.getAllCity();
  await sleep(1000);
  window.f7.hidePreloader();
  goTo('/plan-overview-city/');
}

plan_trip.getAirport = async function(city_code){
    try {
        var data = await got.get(store.service_url + "/airport/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        // console.log(data.result);
        return data.result;
    } catch (e) {
      return null;
    }
}

plan_trip.goToNearbyPlaces = async function(origin){
    window.f7.showPreloader('Fetch Nearby Places');
    let dest_data = {
      origin: origin
    };

    try {
        var data = await got.get(store.service_url +"/place/nearby", {
          query: dest_data,
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });

        store.list_search = data.result;
        store.place_mode = "nearby";

    } catch (e) {
      return null;
    }

    await sleep(500);
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.load({url: '/search-place/'});
    window.f7.hidePreloader();
}

plan_trip.goToPerDayLocal = async function(city_code){
    window.f7.showPreloader('Fetch List Attraction Data');
    try {
        var data = await got.get(store.service_url + "/attraction/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_attraction =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      return null;
    }

    window.f7.showPreloader('Fetch List Restaurant Data');
    try {
        var data = await got.get(store.service_url + "/food/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_food =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      return null;
    }

    await sleep(250);

    window.f7.showPreloader('Fetch Hotel Data Tainan');
    store.coba_hotel1 = await hotel_api.getHotelData('525625'); //Tayih Landis Hotel Tainan
    await sleep(250);
    window.f7.hidePreloader();

    await sleep(250);

    window.f7.showPreloader('Fetch Hotel Data Kaohsiung');
    store.coba_hotel2 = await hotel_api.getHotelData('391444'); //Grand Hi Lai Hotel
    await sleep(250);
    window.f7.hidePreloader();

    await sleep(250);

    window.f7.showPreloader('Fetch Arrival Airport Data');
    store.coba_airport = await this.getAirport('TNN');
    await sleep(250);
    window.f7.hidePreloader();

    store.airport_mode = 'go_back';
    store.is_change_city = false;

    await sleep(250);

    goTo('/plan-overview-day/');
    await sleep(250);
    await this.addSchedule(false);
}

plan_trip.goToPerDay = async function(){
    let city_code = store.per_day_data.city_code;

    window.f7.showPreloader('Fetch List Attraction Data');
    try {
        var data = await got.get(store.service_url + "/attraction/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_attraction =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      return null;
    }

    window.f7.showPreloader('Fetch List Restaurant Data');
    try {
        var data = await got.get(store.service_url + "/food/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_food =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      return null;
    }
    await sleep(250);

    //hotel_now
    store.coba_hotel1 = copy(store.hotel_now_data);
    //hotel_before
    if(store.is_change_city){
      store.coba_hotel2 = copy(store.hotel_before_data);
    }

    if(store.airport_mode === 'arrival'){
      window.f7.showPreloader('Fetch Arrival Airport Data');
      store.coba_airport = copy(store.airport_arrival_data);
      await sleep(250);
      window.f7.hidePreloader();
    }
    else if(store.airport_mode === 'go_back'){
      window.f7.showPreloader('Fetch Departure Airport Data');
      store.coba_airport = copy(store.airport_go_back_data);
      await sleep(250);
      window.f7.hidePreloader();
    }

    await sleep(250);
    goTo('/plan-overview-day/');
    await sleep(250);
    await this.addSchedule(false);
}

plan_trip.getDistance = async function(origin, destination){
    let dest_data = {
      origin: origin,
      destination: destination
    };

    try {
        var data = await got.get(store.service_url +"/place/distance", {
          query: dest_data,
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        return data.result;
    } catch (e) {
      return null;
    }
}

function getDateString(date, time){
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2) + " " + time;
}

function printCurrentPlace(curTime, curPlace, cur_day){
  let temp_time = curTime.clone();
  temp_time.add(curPlace.duration, 'm');
  let warning = (curPlace.travel_time_before.status === "N")? ' (NOT FOUND)' : '';
  return (curPlace.place.name + ' | ' + curTime.format('LT') + ' - ' + temp_time.format('LT') + ' | ' + getOpeningHours(curPlace.place, cur_day) + warning);
}

function getOpeningHours(place, cur_day){
  let string_hours = "";
  if(place.opening_hours.day[cur_day] !== 'Closed'){
    let split_string = place.opening_hours.day[cur_day].split('-');
    let open = split_string[0].slice(0,2) + ":" + split_string[0].slice(2,4);
    let close = split_string[1].slice(0,2) + ":" + split_string[1].slice(2,4);
    string_hours = open + '-' + close;
  }
  else{
    string_hours = 'Closed';
  }
  return string_hours;
}

function isOpen(curTime, curPlace, cur_day){
  let temp_time = curTime.clone();
  temp_time.add(curPlace.duration, 'm');
  let cur_hour = temp_time.format('HH:mm');

  let opening_hours = getOpeningHours(curPlace.place, cur_day);
  if(opening_hours !== 'Closed'){
    opening_hours = opening_hours.split('-');
    let open = opening_hours[0];
    let close = opening_hours[1];
    let open_hour = parseInt(open.split(':')[0]);
    let close_hour = parseInt(close.split(':')[0]);
    // console.log(open_hour)
    // console.log(close_hour);
    // console.log(open);
    // console.log(close);
    if(close_hour >= open_hour){
      if(new Date('1970/01/01 ' + cur_hour) >= new Date('1970/01/01 ' + open) && new Date('1970/01/01 ' + cur_hour) <= new Date('1970/01/01 ' + close)){
        // console.log('mantap');
        return true;
      }
    }
    else{
      if(new Date('1970/01/01 ' + cur_hour) >= new Date('1970/01/01 ' + open) && new Date('1970/01/01 ' + cur_hour) <= new Date('1970/01/02 ' + close)){
        // console.log('mantap2');
        return true;
      }
    }
  }
  // console.log(cur_hour);
  return false;
}

function changeFormatDuration(duration){
  var result = "";
  if(duration == 0){
    return "none";
  }

  if (duration > 3600) {
    result += ("00" + (Math.floor(duration / 3600))).slice(-2) + "h ";
    duration -= (Math.floor(duration / 3600)) * 3600;
    result += ("00" + (Math.floor(duration / 60))).slice(-2) + "m ";
    result += ("00" + (duration % 60)).slice(-2) + "s ";
  }
  else if (duration > 60) {
    result += ("00" + (Math.floor(duration/60))).slice(-2) + "m ";
    result += ("00" + (duration % 60)).slice(-2) + "s ";
  }
  else{
    result += ("00" + (duration)).slice(-2) + "s ";
  }
  return result;
}

plan_trip.addSchedule = async function(mode=true){ //kalau true itu dari place-result kalau false pertama kali buka
  let is_change_city = store.is_change_city;
  let airport_mode = store.airport_mode; //arrival | go_back | none

  let run_down = store.coba_run_down;
  let hotel_before = store.coba_hotel2;
  let hotel_now = store.coba_hotel1;

  let airport_arrival = store.coba_airport;
  let airport_go_back = store.coba_airport;

  let per_day_data = copy(store.per_day_data);

  let hotel_before_duration = (per_day_data.hotel_before_duration != undefined)? per_day_data.hotel_before_duration : 0;
  let hotel_now_duration = (per_day_data.hotel_now_duration != undefined)? per_day_data.hotel_now_duration : 60;
  let airport_arrival_duration = (per_day_data.arrival_duration != undefined)? per_day_data.arrival_duration : 60;
  let airport_go_back_duration = (per_day_data.go_back_duration != undefined)? per_day_data.go_back_duration : 90;
  let hotel_go_back_duration = (per_day_data.hotel_go_back_duration != undefined)? per_day_data.hotel_go_back_duration : 60;

  let go_back_time = (per_day_data.go_back_time != undefined)? per_day_data.go_back_time : "";

  let start_hour = per_day_data.start_hour;
  let hour = parseInt(start_hour.split(':')[0]);
  let minute = parseInt(start_hour.split(':')[1]);

  let cur_date = new Date(per_day_data.cur_date);
  cur_date.setHours(hour, minute, 0, 0);
  let cur_day = cur_date.getDay();
  let start = moment(getDateString(cur_date, start_hour));
  // console.log(start.format('LLL'));
  // start.add(77, 'm');
  // console.log(start.format('LLL'));
  // let add = start.clone();
  // add.add(30, 'm');
  // console.log(add.format('LLL'));
  // console.log(start.format('LLL'));

  let modified_run_down = [];
  let travel_time_before = 0;
  let duration = 0;
  let last_place = {};

  let list_distance = [];
  let temp_distance = {
    origin: 'none',
    destination: 'none',
    status: 'Y',
    travel_time: 0
  };

  console.log('');
  console.log(is_change_city);
  console.log('MULAI');
  window.f7.showPreloader('Fetch Schedule');

  //airport
  if(airport_mode === 'arrival'){
    duration = airport_arrival_duration;
    travel_time_before = 0;

    start.add(travel_time_before, 's');
    let temp_airport = {
        place: airport_arrival,
        is_open: true,
        duration: duration,
        travel_time_before: temp_distance,
        humanize: changeFormatDuration(temp_distance.travel_time),
        can_sort: false,
        id: -3,
        type: 'airport_arrival'
    };
    temp_airport.string_format = printCurrentPlace(start, temp_airport, cur_day);
    start.add(duration, 'm');
    modified_run_down.push(temp_airport);

    last_place = airport_arrival;
    temp_distance = await this.getDistance(last_place.place_id, hotel_now.place_id);
    travel_time_before = temp_distance.travel_time;
  }
  else{
    travel_time_before = 0;
  }

  //hotel_before
  if(is_change_city){ //kalau ganti kota
    duration = hotel_before_duration;
    start.add(travel_time_before, 's');
    let temp1 = {
        place: hotel_before,
        is_open: true,
        duration: duration,
        travel_time_before: temp_distance,
        humanize: changeFormatDuration(temp_distance.travel_time),
        can_sort: false,
        id: -2,
        type: 'hotel_before'
    };
    temp1.string_format = printCurrentPlace(start, temp1, cur_day);
    start.add(duration, 'm');
    modified_run_down.push(temp1);
    last_place = hotel_before;
    temp_distance = await this.getDistance(last_place.place_id, hotel_now.place_id);
    travel_time_before = temp_distance.travel_time;
    duration = 60;
  }

  //hotel_now
  duration = hotel_now_duration;
  start.add(travel_time_before, 's');
  let temp2 = {
      place: hotel_now,
      is_open: true,
      duration: duration,
      travel_time_before: temp_distance,
      humanize: changeFormatDuration(temp_distance.travel_time),
      can_sort: false,
      id: -1,
      type: 'hotel_now'
  };
  temp2.string_format = printCurrentPlace(start, temp2, cur_day);
  start.add(duration, 'm');
  modified_run_down.push(temp2);

  last_place = hotel_now;
  if(run_down.length > 0){
    temp_distance = await this.getDistance(last_place.place_id, run_down[0].place.place_id);
    travel_time_before = temp_distance.travel_time;
    duration = run_down[0].duration;
  }
  else{ //bisa langsung airport pulang
    travel_time_before = 0
    duration = 0;
  }

  //mulai per tempat
  for (let i = 0; i < run_down.length; i++) {
    start.add(travel_time_before, 's');
    let temp_place = {
        place: run_down[i].place,
        is_open: true,
        duration: duration,
        travel_time_before: temp_distance,
        humanize: changeFormatDuration(temp_distance.travel_time),
        can_sort: true,
        id: i,
        type: 'place'
    };
    store.coba_run_down[i].id = i;

    temp_place.string_format = printCurrentPlace(start, temp_place, cur_day);
    temp_place.is_open = isOpen(start, temp_place, cur_day);
    start.add(duration, 'm');
    modified_run_down.push(temp_place);

    if(i < run_down.length - 1){
      last_place = run_down[i].place;
      temp_distance = await this.getDistance(last_place.place_id, run_down[i+1].place.place_id);
      travel_time_before = temp_distance.travel_time;
      duration = run_down[i+1].duration;
    }
  }

  if(airport_mode === 'go_back'){
    console.log("GO BACKK");
    if(run_down.length > 0){
      last_place = run_down[run_down.length - 1].place;
    }

    if(last_place.place_id !== hotel_now.place_id){
      temp_distance = await this.getDistance(last_place.place_id, hotel_now.place_id);
      travel_time_before = temp_distance.travel_time;
      duration = hotel_go_back_duration;
      start.add(travel_time_before, 's');
      let hotel_go_back = {
          place: hotel_now,
          is_open: true,
          duration: duration,
          travel_time_before: temp_distance,
          humanize: changeFormatDuration(temp_distance.travel_time),
          can_sort: false,
          id: -4,
          type: 'hotel_go_back'
      };
      hotel_go_back.string_format = printCurrentPlace(start, hotel_go_back, cur_day);
      start.add(duration, 'm');
      modified_run_down.push(hotel_go_back);
      last_place = hotel_now;
    }

    temp_distance = await this.getDistance(last_place.place_id, airport_go_back.place_id);
    travel_time_before = temp_distance.travel_time;
    duration = airport_go_back_duration;

    start.add(travel_time_before, 's');
    let temp_airport_go_back = {
        place: airport_go_back,
        is_open: true,
        duration: duration,
        travel_time_before: temp_distance,
        humanize: changeFormatDuration(temp_distance.travel_time),
        can_sort: false,
        id: -5,
        type: 'airport_go_back'
    };
    temp_airport_go_back.string_format = printCurrentPlace(start, temp_airport_go_back, cur_day);
    start.add(duration, 'm');
    modified_run_down.push(temp_airport_go_back);
  }

  store.coba_modified_run_down = [];
  store.coba_modified_run_down = modified_run_down;

  let end_date = new Date(start.format('YYYY/MM/DD HH:mm'));
  cur_date.setHours(0,0,0,0);
  end_date.setHours(0,0,0,0);
  // console.log(cur_date);
  // console.log(end_date);

  let timeDiff = Math.abs(end_date.getTime() - cur_date.getTime());
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  // console.log(diffDays);
  if(diffDays > 0){
    store.can_add_place = false;
    window.f7.addNotification({
        message: "You can't add place anymore.."
    });
  }
  else{
    store.can_add_place = true;
  }

  store.last_time = start.format('HH:mm');
  console.log(store.last_time);

  await sleep(250);
  if(mode){
    goBack();
    await sleep(500);
    goBack();
    await sleep(500);
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    await sleep(500);
    window.f7.hidePreloader();
  }
  else{
    await sleep(500);
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    await sleep(500);
    window.f7.hidePreloader();
  }
}

plan_trip.backRefresh = async function(){
  window.f7.showPreloader();
  goBack();
  await sleep(500);
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.refreshPage();
  window.f7.hidePreloader();
}

plan_trip.getTotalBudget = function(){
  let flight_budget = 0;
  for (var i = 0; i < store.flight_plan.length; i++) {
    flight_budget += store.flight_plan[i].price;
  }

  let hotel_budget = 0;
  for (var i = 0; i < store.trip_city_plan_data.length; i++) {
    for (let j = 0; j < store.trip_city_plan_data[i].cities.length; j++) {
      if(store.trip_city_plan_data[i].cities[j].hotel){
        hotel_budget += store.trip_city_plan_data[i].cities[j].hotel.rooms[0].total;
      }
    }
  }

  return Math.round((flight_budget + hotel_budget) * 100) / 100;
}

plan_trip.cobaSaveTrip = async function(){
  let params = {
    user_id: 2,
    plan_data: 'plan_data_1',
    city_plan_data: 'city_plan_data_1',
    flight_data: 'flight_data_1',
    total_budget: 325.25
  };

  let response = await got.post(store.service_url +"/trip/save", {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then(res => {
      if (res.statusCode !== 200) {
        return 'Error';
      }
      return JSON.parse(res.body);
    })
    .catch(err => {
      return 'Error';
    });

  console.log(response.trip_id);
  console.log(response);
}

plan_trip.saveTrip = async function(){
  window.f7.showPreloader();
  let user_id = store.user_id;
  let plan_data = JSON.stringify(store.trip_plan_data);
  let city_plan_data = JSON.stringify(store.trip_city_plan_data);
  let flight_data = JSON.stringify(store.flight_plan);
  let total_budget = this.getTotalBudget();

  let params = {
    user_id: user_id,
    plan_data: plan_data,
    city_plan_data: city_plan_data,
    flight_data: flight_data,
    total_budget: total_budget
  };

  let response = await got.post(store.service_url +"/trip/save", {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then(res => {
      if (res.statusCode !== 200) {
        return 'Error';
      }
      return JSON.parse(res.body);
    })
    .catch(err => {
      return 'Error';
    });

  store.trip_id = response.trip_id;
  console.log(response);
  window.f7.hidePreloader();
}

plan_trip.updateTrip = async function(){
  window.f7.showPreloader('Updating Trip');
  let plan_data = JSON.stringify(store.trip_plan_data);
  let city_plan_data = JSON.stringify(store.trip_city_plan_data);
  let flight_data = JSON.stringify(store.flight_plan);
  let trip_id = store.trip_id;
  let total_budget = this.getTotalBudget();

  let params = {
    trip_id: trip_id,
    plan_data: plan_data,
    city_plan_data: city_plan_data,
    flight_data: flight_data,
    total_budget: total_budget
  };

  let response = await got.post(store.service_url +"/trip/update", {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    .then(res => {
      if (res.statusCode !== 200) {
        return 'Error';
      }
      return JSON.parse(res.body);
    })
    .catch(err => {
      return 'Error';
    });

  console.log(response);
  await sleep(1000);
  window.f7.hidePreloader();
}

plan_trip.loadingTrip = async function(id){
  window.f7.showPreloader('Loading Trip');
  try {
      var data = await got.get(store.service_url + "/trip/load/" + id, {
        retries: 2
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res;
      });

      let result = data.result;
      store.trip_id = result.id;
      store.trip_plan_data = result.plan_data;
      store.trip_city_plan_data = result.city_plan_data;
      store.flight_plan = result.flight_data;
      store.plan_trip_mode = "edit";

  } catch (e) {
    return null;
  }

  await sleep(500);
  goTo('/plan-overview-country/');
  window.f7.hidePreloader();
}

plan_trip.goToMyTrip = async function(){
  window.f7.showPreloader('Fetch My Trip Data');
  let user_id = store.user_id;
  let user_data = {
    user_id: user_id
  };

  try {
      var data = await got.get(store.service_url +"/trip/load/all", {
        query: user_data,
        retries: 2
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res;
      });

      store.list_my_trip = data.result;

  } catch (e) {
    return null;
  }

  await sleep(500);
  goTo('/mytrip/');
  window.f7.hidePreloader();
}

plan_trip.backFromEditTrip = async function(){
  window.f7.showPreloader();
  goBack();
  await sleep(500);
  goBack();
  await sleep(500);
  window.f7.hidePreloader();
  this.goToMyTrip();
}

export default plan_trip;
