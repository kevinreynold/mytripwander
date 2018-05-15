import store from "./store";
import travelpayouts from "./flightsearch";
import hotel_api from "./hotelsearch";
import got from "got";
import moment from "moment";
import jsPDF from "jspdf";

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

plan_trip.getCurrencyData = async function(id){
  try {
      var data = await got.get(store.service_url + "/currency/" + id, {
        retries: 2
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res.result;
      });

      console.log(data);
      store.currency_rate = data.rate;
      store.currency_name = data.name;
      store.currency_symbol = data.symbol;
      store.currency_id = id;

      localStorage.setItem('currency_id', store.currency_id);
      localStorage.setItem('currency_name', store.currency_name);
      localStorage.setItem('currency_rate', store.currency_rate);
      localStorage.setItem('currency_symbol', store.currency_symbol);

      console.log(store.currency_rate);
      console.log(store.currency_symbol);

  } catch (e) {
    console.log(e.message);
  }
}

plan_trip.getDestinationList = async function(){
    window.f7.showPreloader();
    try {
      if(store.list_dest_all.length === 0){
        var data = await got.get(store.service_url +"/city/dest", {
          retries: 2,
          timeout: 5000
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
          retries: 2,
          timeout: 7000
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });

        store.list_search = data.result;
        store.place_mode = "nearby";

        await sleep(500);
        var mainView = Dom7('#main-view')[0].f7View;
        mainView.router.load({url: '/search-place/'});
        window.f7.hidePreloader();
    } catch (e) {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
      return null;
    }
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
    await this.addSchedule(false, false);
}

plan_trip.goToPerDay = async function(){
    let city_code = store.per_day_data.city_code;
    let error = false;

    window.f7.showPreloader('Fetch List Attraction Data');
    try {
        var data = await got.get(store.service_url + "/attraction/" + city_code, {
          retries: 2,
          timeout: 7000
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_attraction =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      error = true;
      return null;
    }

    window.f7.showPreloader('Fetch List Restaurant Data');
    try {
        var data = await got.get(store.service_url + "/food/" + city_code, {
          retries: 2,
          timeout: 7000
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        store.list_food =  data.result;
        await sleep(500);
        window.f7.hidePreloader();
    } catch (e) {
      error = true;
      return null;
    }
    await sleep(250);

    if(error){
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });

      return 0;
    }

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
    await this.addSchedule(false, false);
}

plan_trip.getDistance = async function(origin, destination){
    // await sleep(250);
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
  // return (curPlace.place.name + ' | ' + curTime.format('LT') + ' - ' + temp_time.format('LT') + ' | ' + getOpeningHours(curPlace.place, cur_day) + warning);
  return (curPlace.place.name + ' | ' + curTime.format('HH:mm') + ' - ' + temp_time.format('HH:mm') + ' | ' + getOpeningHours(curPlace.place, cur_day) + warning);
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

plan_trip.addSchedule = async function(mode=true, get_data=false){ //kalau true itu dari place-result kalau false pertama kali buka - getdata kalau false jadi void/ kalau true jadi function
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
  if(!get_data) { window.f7.showPreloader('Fetch Schedule'); }

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

  if(get_data){
    return modified_run_down;
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
    window.f7.showPreloader('Generate Map View');
    await initMap(store.coba_modified_run_down);
    await sleep(500);
    window.f7.hidePreloader();
  }
  else{
    await sleep(500);
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    await sleep(500);
    window.f7.hidePreloader();
    window.f7.showPreloader('Generate Map View');
    await initMap(store.coba_modified_run_down);
    await sleep(500);
    window.f7.hidePreloader();
  }
}

async function initMap(markers) {
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;

  console.log("MARKERS");
  console.log(markers[0]);
  var mapOptions = {
      center: new google.maps.LatLng(markers[0].place.latitude, markers[0].place.longitude),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var infoWindow = new google.maps.InfoWindow();
  var lat_lng = new Array();
  var latlngbounds = new google.maps.LatLngBounds();

  for (i = 0; i < markers.length; i++) {
      var data = markers[i].place;
      var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
      lat_lng.push(myLatlng);

      var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: data.name,
          label: labels[labelIndex++ % labels.length]
      });
      latlngbounds.extend(marker.position);

      (function (marker, data) {
          google.maps.event.addListener(marker, "click", function (e) {
              infoWindow.setContent(data.name);
              infoWindow.open(map, marker);
          });
      })(marker, data);
  }
  map.setCenter(latlngbounds.getCenter());
  map.fitBounds(latlngbounds);

  //***********ROUTING****************//
  //Intialize the Path Array
  var path = new google.maps.MVCArray();
  //Intialize the Direction Service
  var service = new google.maps.DirectionsService();
  //Set the Path Stroke Color
  var poly = new google.maps.Polyline({ map: map, strokeColor: '#73b9ff' });

  var error = false;
  //Loop and Draw Path Route between the Points on MAP
  for (var i = 0; i < lat_lng.length; i++) {
    if ((i + 1) < lat_lng.length) {
      var src = lat_lng[i];
      var des = lat_lng[i + 1];
      poly.setPath(path);

      var current_status = google.maps.DirectionsStatus.OK
      var try_mode = 0;
      do {
        var travel_mode = google.maps.DirectionsTravelMode.TRANSIT;
        if(try_mode == 0){
          travel_mode = google.maps.DirectionsTravelMode.TRANSIT;
        }
        else if(try_mode == 1){
          travel_mode = google.maps.DirectionsTravelMode.DRIVING;
        }
        else if(try_mode == 2){
          travel_mode = google.maps.DirectionsTravelMode.WALKING;
        }

        service.route({
          origin: src,
          destination: des,
          travelMode: travel_mode
        }, function (result, status) {
          current_status = status;
          console.log(status);
          //console.log(result);
          // UNKNOWN_ERROR
          if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR){
            console.log("RUSAK");
            error = true;
          }
          else if (status == google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
              // console.log(result.routes[0].overview_path[i]);
              path.push(result.routes[0].overview_path[i]);
            }
          }
        });
        try_mode += 1;
        console.log(try_mode);
        await sleep(1000);
      } while (current_status != google.maps.DirectionsStatus.OK && !error);
    }

    if(error){ return 0; }
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

function convertPrice(price){
  let result = Math.round(price * store.currency_rate * 100) / 100;
  return result;
}

plan_trip.getTotalBudget = function(){
  let flight_budget = 0;
  for (var i = 0; i < store.flight_plan.length; i++) {
    flight_budget += store.flight_plan[i].unified_price;
  }

  let hotel_budget = 0;
  for (var i = 0; i < store.trip_city_plan_data.length; i++) {
    for (let j = 0; j < store.trip_city_plan_data[i].cities.length; j++) {
      if(store.trip_city_plan_data[i].cities[j].hotel){
        if(store.trip_city_plan_data[i].cities[j].hotel.rooms){
          hotel_budget += store.trip_city_plan_data[i].cities[j].hotel.rooms[0].total;
        }
      }
    }
  }

  let result = Math.round((flight_budget + hotel_budget) * 100) / 100;
  return result;
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
  // window.f7.showPreloader();
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
      timeout: 10000
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

  if (response != 'Error') {
    store.trip_id = response.trip_id;
    console.log(response);

    store.trip_plan_data_original = copy(store.trip_plan_data);
    store.trip_city_plan_data_original = copy(store.trip_city_plan_data);
    store.flight_plan_original = copy(store.flight_plan);
    // window.f7.hidePreloader();
  }
  else{
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
  }
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
      timeout: 10000
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

  if(response != 'Error'){
    store.trip_plan_data_original = copy(store.trip_plan_data);
    store.trip_city_plan_data_original = copy(store.trip_city_plan_data);
    store.flight_plan_original = copy(store.flight_plan);

    await sleep(1000);
    window.f7.addNotification({
        message: 'Update plan success.',
        hold: 2500
    });
    window.f7.hidePreloader();
  }
  else{
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    window.f7.hidePreloader();
  }
}

plan_trip.loadingTrip = async function(id){
  window.f7.showPreloader('Loading Trip');
  store.trip_id = id;
  try {
      var data = await got.get(store.service_url + "/trip/load/" + id, {
        retries: 2,
        timeout: 7000
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

      store.trip_plan_data_original = copy(store.trip_plan_data);
      store.trip_city_plan_data_original = copy(store.trip_city_plan_data);
      store.flight_plan_original = copy(store.flight_plan);
  } catch (e) {
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    window.f7.hidePreloader();
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
        retries: 2,
        timeout: 5000
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res;
      });

      store.list_my_trip = data.result;

      await sleep(500);
      goTo('/mytrip/');
      window.f7.hidePreloader();
  } catch (e) {
    await sleep(500);
    window.f7.addNotification({
          message: 'No internet connection...',
          hold: 3500
      });
    window.f7.hidePreloader();
  }
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

plan_trip.getAllCurrency = async function(){
  window.f7.showPreloader();
  try {
    if(store.list_currency.length == 0){
      let data = await got.get(store.service_url +"/currency", {
        retries: 2,
        timeout: 7000
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res.result;
      });

      store.list_currency = data;
      await sleep(500);
    }

    window.f7.hidePreloader();
    return 1;

  } catch (e) {
    return 0;
  }
}

plan_trip.goSignUp = async function(){
  await this.getAllCurrency();
  window.f7.showPreloader();
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.load({url: '/register/'});
  await sleep(200);
  window.f7.hidePreloader();
  window.f7.closeModal('#login-screen', true);
}

plan_trip.goChooseCurrency = async function(){
  if(await this.getAllCurrency()){
    window.f7.hidePreloader();
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    return 0;
  }

  window.f7.showPreloader();
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.load({url: '/changecurrency/'});
  await sleep(200);
  window.f7.hidePreloader();
}

plan_trip.updateCurrency = async function(){
  console.log(store.user_id);
  console.log(store.currency_id);
  let params = {
    user_id: store.user_id,
    currency_id: store.currency_id
  };

  let response = await got.post(store.service_url +"/currency/update", {
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

  await sleep(250);
}

plan_trip.changeCurrency = async function(currency_id){
  window.f7.showPreloader();
  await this.getCurrencyData(currency_id);
  await sleep(250);
  goBack();
  await sleep(500);
  await this.updateCurrency();
  await sleep(250);
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.refreshPage();
  await sleep(250);
  window.f7.hidePreloader();
}

plan_trip.changePassword = async function(self, old_password, new_password, conf_password){
  let validation = true;
  let error_message =  "";

  if(new_password.length < 6){
    validation = false;
    error_message += 'Password must have a minimum 6 characters.' + '<br>';
  }
  else if(new_password !== conf_password){
    validation = false;
    error_message += 'Password and confirmation password do not match.' + '<br>';
  }

  if(!validation){
    window.f7.addNotification({
        message: error_message,
        hold: 5000
    });

    self.inputs[0].value = "";
    self.inputs[1].value = "";
    self.inputs[2].value = "";
  }
  else{
    window.f7.showPreloader();
    let params = {
      email: store.email,
      old_password: old_password,
      new_password: new_password
    };

    let response = await got.post(store.service_url +"/user/changepass", {
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

    console.log(JSON.stringify(response));
    self.inputs[0].value = "";
    self.inputs[1].value = "";
    self.inputs[2].value = "";

    if(response.status === 'OK'){
      await sleep(500);
      goBack();
    }

    window.f7.hidePreloader();
    window.f7.addNotification({
        message: response.message,
        hold: 2000
    });
  }
}

plan_trip.forgotPassword = async function(email){
  window.f7.showPreloader();
  try {
    let data = await got.get(store.service_url +"/forgot/" + email, {
      retries: 2,
      timeout: 7000
    })
    .then(res => {
      var res = JSON.parse(res.body);
      return res;
    });

    await sleep(1000);
    window.f7.hidePreloader();
    window.f7.loginScreen();
    await sleep(250);
    goBack();
    window.f7.alert('A link has been sent to your email. If no email has arrived, check your spam folder.', 'Password Reset Request Sent', function () {
    });
  } catch (e) {
    await sleep(1000);
    window.f7.hidePreloader();
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    window.f7.loginScreen();
    await sleep(250);
    goBack();
  }
}

plan_trip.doSignUp = async function(formData){
  let validation = true;
  let error_message =  "";
  //mulai validation
  if(formData.username.trim().length == 0){
    validation = false;
    error_message += 'Please fill username first.' + '<br>';
  }

  if(formData.email.trim().length == 0){
    validation = false;
    error_message += 'Please fill email first.' + '<br>';
  }
  else if(!validateEmail(formData.email)){
    validation = false;
    error_message += '"' + formData.email + '"' + ' is not an email address.' + '<br>';
  }

  console.log(formData.password.length);
  if(formData.password.length < 6){
    validation = false;
    error_message += 'Password must have a minimum 6 characters.' + '<br>';
  }
  else if(formData.password !== formData.cpassword){
    validation = false;
    error_message += 'Password and confirmation password do not match.' + '<br>';
  }

  if(!validation){
    window.f7.addNotification({
        message: error_message,
        hold: 5000
    });

    let newData = {
      password : "",
      cpassword: ""
    }
    window.f7.formFromData('#register-form', newData);
  }
  else{
    window.f7.showPreloader();
    let params = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      currency_id: formData.currency,
    };

    let response = await got.post(store.service_url +"/user/register", {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        timeout: 7000
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

    console.log(JSON.stringify(response));
    if(response != 'Error'){
      if(response.status === 'OK'){
        await this.updateDeviceToken(formData.email);
        store.user_id = response.user_id;
        store.user_name = params.username;
        store.email = params.email;
        store.currency_id = params.currency_id;
        await this.getCurrencyData(store.currency_id);
      }

      let newData = {
        password : "",
        cpassword: "",
        email: ""
      }
      window.f7.formFromData('#register-form', newData);

      await sleep(1000);

      if(response.status === 'OK'){
        this.saveUserData();
        let leftpanel = window.Dom7("#left-panel")[0];
        let profile = window.Dom7(".profile")[0];
        profile.innerHTML = "Hi, " + store.user_name;
        await sleep(500);
        goBack();
      }

      window.f7.hidePreloader();
      window.f7.addNotification({
          message: response.message,
          hold: 2000
      });
    }
    else{
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No internet connection..'
      });
    }
  }
}

plan_trip.getDeviceToken = function(){
}

plan_trip.updateDeviceToken = async function(email, offline=store.offline){
  if(!offline){
    let device_token = store.device_token;

    window.f7.addNotification({
        message: device_token,
        hold: 2500
    });
    await sleep(1000);

    let update_token_params = {
      email: email,
      device_token: device_token,
    };

    let update_token_response = await got.post(store.service_url +"/update/token", {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update_token_params),
        timeout: 7000
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
    }
}

plan_trip.doLogin = async function(self, email, password){
  let validation = true;
  let error_message =  "";
  //mulai validation
  if(email.trim().length == 0){
    validation = false;
    error_message += 'Please fill username first.' + '<br>';
  }
  else if(!validateEmail(email)){
    validation = false;
    error_message += '"' + email + '"' + ' is not an email address.' + '<br>';
  }

  if(!validation){
    window.f7.addNotification({
        message: error_message,
        hold: 5000
    });

    self.inputs[0].value = "";
    self.inputs[1].value = "";
  }
  else{
    window.f7.showPreloader();
    let params = {
      email: email,
      password: password,
    };

    let response = await got.post(store.service_url +"/login", {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        timeout: 7000
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

    console.log(JSON.stringify(response));
    if(response != 'Error'){
      if(response.status === 'OK'){
        await this.updateDeviceToken(email);
        let user = response.user;

        store.user_id = user.id;
        store.user_name = user.username;
        store.email = email;
        store.currency_id = user.currency_id;
        await this.getCurrencyData(store.currency_id);
      }

      self.inputs[0].value = "";
      self.inputs[1].value = "";

      await sleep(1000);

      if(response.status === 'OK'){
        this.saveUserData();
        let leftpanel = window.Dom7("#left-panel")[0];
        let profile = window.Dom7(".profile")[0];
        profile.innerHTML = "Hi, " + store.user_name;
        await sleep(500);
        window.f7.closeModal('#login-screen', true);
      }
      else{
        window.f7.addNotification({
            message: response.message,
            hold: 2000
        });
      }

      window.f7.hidePreloader();
    }
    else{
      window.f7.addNotification({
          message: 'No internet connection..'
      });
      window.f7.hidePreloader();
    }
  }
}

plan_trip.doGoogleLogin = async function(email, username){
  window.f7.showPreloader();

  let params = {
    email: email,
    username: username,
  };

  let response = await got.post(store.service_url +"/login/google", {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      timeout: 7000
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

  await this.updateDeviceToken(email);

  console.log(JSON.stringify(response));
  let user = response.user;

  store.user_id = user.id;
  store.user_name = user.username;
  store.email = email;
  store.currency_id = user.currency_id;
  await this.getCurrencyData(store.currency_id);

  this.saveUserData();
  let leftpanel = window.Dom7("#left-panel")[0];
  let profile = window.Dom7(".profile")[0];
  profile.innerHTML = "Hi, " + store.user_name;
  await sleep(500);
  window.f7.closeModal('#login-screen', true);

  window.f7.hidePreloader();
}

plan_trip.saveUserData = function(){
  localStorage.setItem('user_id', store.user_id);
  localStorage.setItem('user_name', store.user_name);
  localStorage.setItem('email', store.email);
  localStorage.setItem('currency_id', store.currency_id);
  localStorage.setItem('currency_name', store.currency_name);
  localStorage.setItem('currency_rate', store.currency_rate);
  localStorage.setItem('currency_symbol', store.currency_symbol);
}

plan_trip.loadUserData = async function(){
  store.user_id = localStorage.getItem('user_id');
  store.user_name = localStorage.getItem('user_name');
  store.email = localStorage.getItem('email');
  store.currency_id = localStorage.getItem('currency_id');
  store.currency_name = localStorage.getItem('currency_name');
  store.currency_rate = localStorage.getItem('currency_rate');
  store.currency_symbol = localStorage.getItem('currency_symbol');
}

plan_trip.getPDFData = async function(){

  let trip_city_plan_data = copy(store.trip_city_plan_data);
  let trip_plan_data = copy(store.trip_plan_data);

  console.log(trip_city_plan_data);
  console.log(trip_plan_data);

  let day = 1;

  let result = [];

  for (var country_index = 0; country_index < trip_city_plan_data.length; country_index++) { //PER NEGARA
    let self = {};
    let country = {};
    self.trip_city_plan_data_one = trip_city_plan_data[country_index];
    console.log('COUNTRY INDEX : '  + country_index);

    country.country_name = trip_plan_data.list_destination[country_index].country_name;
    country.cities = [];

    for (var city_index = 0; city_index < self.trip_city_plan_data_one.cities.length; city_index++) { //PER KOTA
      console.log('CITY INDEX : '  + city_index);
      let per_city_data = {
        city: self.trip_city_plan_data_one.cities[city_index].city_name,
        list_dest: []
      };

      country.cities.push(per_city_data);

      for (var day_index = 0; day_index < self.trip_city_plan_data_one.cities[city_index].list_dest_trip.length; day_index++) { //PER HARI
        console.log('DAY INDEX : '  + day_index);

        let cur_date = new Date(self.trip_city_plan_data_one.cities[city_index].booking_data.checkin);
        let date_after = new Date(cur_date.getTime() + day_index * 24 * 60 * 60 * 1000);
        let cur_date_string =  date_after.getFullYear() + "-" + ("00" + (date_after.getMonth()+1)).slice(-2) + "-" + ("00" + (date_after.getDate())).slice(-2);

        //run_down
        store.coba_run_down = copy(self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].list_place);

        store.per_day_data = {
          city_index: city_index,
          day_index: day_index,
          city_code: self.trip_city_plan_data_one.cities[city_index].city_code,
          cur_date: cur_date_string,
          start_hour: self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].start_hour
        };

        //airport_mode
        if(city_index == 0 && day_index == 0){
          store.airport_mode = 'arrival';
          store.airport_arrival_data = copy(self.trip_city_plan_data_one.arrival_airport);
          store.per_day_data.arrival_duration = self.trip_city_plan_data_one.arrival_duration;
          console.log(store.airport_arrival_data.name);
        }
        else if(city_index === self.trip_city_plan_data_one.cities.length - 1 && day_index === self.trip_city_plan_data_one.cities[self.trip_city_plan_data_one.cities.length-1].list_dest_trip.length - 1){
          if(self.trip_city_plan_data_one.go_back_airport){
            store.airport_mode = 'go_back';
            store.airport_go_back_data = copy(self.trip_city_plan_data_one.go_back_airport);
            store.per_day_data.go_back_duration = self.trip_city_plan_data_one.go_back_duration;
            store.per_day_data.hotel_go_back_duration = self.trip_city_plan_data_one.hotel_go_back_duration;
            store.per_day_data.go_back_time = self.trip_city_plan_data_one.go_back.departure_airport.time;
            console.log(store.airport_go_back_data.name);
          }
        }
        else{
          store.airport_mode = 'none';
        }

        store.is_change_city = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].to_another_city;

        console.log('AIRPORT MODE : ' + store.airport_mode);
        console.log('CHANGE CITY : ' + store.is_change_city);
        //hotel_now
        store.hotel_now_data = copy(self.trip_city_plan_data_one.cities[city_index].hotel_data);
        store.per_day_data.hotel_now_duration = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].hotel_now_duration;

        //hotel_before
        console.log(store.hotel_now_data.name);
        if(store.is_change_city){
          store.hotel_before_data = copy(self.trip_city_plan_data_one.cities[city_index-1].hotel_data);
          store.per_day_data.hotel_before_duration = self.trip_city_plan_data_one.cities[city_index].list_dest_trip[day_index].hotel_before_duration;
          console.log(store.hotel_before_data.name);
        }

        console.log(JSON.stringify(store.per_day_data));

        //hotel_now
        store.coba_hotel1 = copy(store.hotel_now_data);
        //hotel_before
        if(store.is_change_city){
          store.coba_hotel2 = copy(store.hotel_before_data);
        }

        if(store.airport_mode === 'arrival'){
          store.coba_airport = copy(store.airport_arrival_data);
        }
        else if(store.airport_mode === 'go_back'){
          store.coba_airport = copy(store.airport_go_back_data);
        }

        let route_data = await this.addSchedule(false, true);

        let date = moment(new Date(store.per_day_data.cur_date)).format('dddd, DD MMMM YYYY');

        let per_day_data = {
          day: day++,
          date: date,
          route_data: route_data
        };

        country.cities[country.cities.length-1].list_dest.push(per_day_data);
      }
    }

    result.push(country);
  }

  await sleep(500);
  return result
}

plan_trip.makePDF = async function(){
  window.f7.showPreloader("Generate PDF Data");

  //file_name
  let filename = 'trip_' + getDateAfterDays(0) + '_' + store.trip_id + '.pdf';

  let print_data = await this.getPDFData();

  //header
  let total_days_trip = 0;
  for (var i = 0; i < store.trip_plan_data.list_destination.length; i++) {
    total_days_trip += store.trip_plan_data.list_destination[i].stay;
  }

  let dest_title = "";
  for (var i = 0; i < store.trip_plan_data.list_destination.length; i++) {
    dest_title += store.trip_plan_data.list_destination[i].country_name;
    if(i !== store.trip_plan_data.list_destination.length-1){
      dest_title += ' - ';
    }
  }

  let total_budget = convertPrice(this.getTotalBudget());
  let total_budget_string = store.currency_symbol + total_budget.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let params = {
    filename: filename,
    print_data: JSON.stringify(print_data),
    total_days_trip: total_days_trip,
    dest_title: dest_title,
    total_budget: total_budget_string,
    first_city: store.trip_plan_data.first_city,
    start_date: store.trip_plan_data.start_date
  };

  let response = await got.post(store.service_url +"/make/pdf", {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      retries: 2,
      timeout: 15000
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

  console.log(JSON.stringify(response))

  if(store.offline){
    let url = store._local_url + '/pdf_result/' + filename;
    window.open(url, '_system', 'location=yes')
  }
  else{
    let url = 'http://103.253.25.103/pdf/' + filename;
    window.open(url, '_system', 'location=yes')
  }

  // console.log(JSON.stringify(print_data));
  // let doc = new jsPDF();
  //
  // let page = 1;
  // let cur_height = 10;
  // //A4
  // //width 210
  // //height 297
  //
  // doc.setFontSize(18);
  // doc.text(105, cur_height+=10, total_days_trip + ' Days Trip', null, null, 'center');
  // doc.text(105, cur_height+=10, destTitle, null, null, 'center');
  // doc.text(105, cur_height+=10, 'From', null, null, 'center');
  // doc.text(105, cur_height+=10, store.trip_plan_data.first_city, null, null, 'center');
  // doc.text(105, cur_height+=10, store.trip_plan_data.start_date, null, null, 'center');
  //
  // doc.setFontSize(14);
  // doc.text(200, cur_height+=10, 'Total Budget :', null, null, 'right');
  // doc.text(200, cur_height+=7.5, total_budget_string, null, null, 'right');
  // cur_height+=2.5;
  // //header selesai
  //
  // for (var i = 0; i < print_data.length; i++) {
  //   doc.setFontSize(18);
  //   doc.text(105, cur_height+=10, print_data[i].country_name, null, null, 'center');
  //   if(cur_height > 275){
  //     page++;
  //     doc.addPage('a4');
  //     cur_height = 10;
  //   }
  //
  //   for (var j = 0; j < print_data[i].cities.length; j++) {
  //     doc.setFontSize(16);
  //     doc.text(10, cur_height+=7.5, print_data[i].cities[j].city);
  //     if(cur_height > 275){
  //       page++;
  //       doc.addPage('a4');
  //       cur_height = 10;
  //     }
  //
  //     for (var k = 0; k < print_data[i].cities[j].list_dest.length; k++) {
  //       doc.setFontSize(12);
  //       let per_day_data = print_data[i].cities[j].list_dest[k];
  //       let day_title = 'Day ' + per_day_data.day + ' - ' + per_day_data.date;
  //       doc.setFontType("bold");
  //       doc.text(10, cur_height+=7.5, day_title);
  //       if(cur_height > 275){
  //         page++;
  //         doc.addPage('a4');
  //         cur_height = 10;
  //       }
  //
  //       doc.setFontType("normal");
  //       let offset_place = 1;
  //
  //       //mulai tulis per tempatnya
  //       for (var m = 0; m < per_day_data.route_data.length; m++) {
  //         let info = per_day_data.route_data[m].string_format.split(' | ');
  //         let place_name = info[0];
  //         let time = info[1];
  //
  //         doc.text(12.5, cur_height+=7.5, offset_place++ + '. ' + place_name);
  //         doc.text(200, cur_height, time, null, null, 'right');
  //         if(cur_height > 275){
  //           page++;
  //           doc.addPage('a4');
  //           cur_height = 10;
  //         }
  //       }
  //       cur_height+=2.5;
  //     }
  //     cur_height+=5;
  //   }
  //   cur_height+=2.5;
  // }
  //
  //
  // doc.save(filename);
  // let myBaseString = doc.output('datauristring');
  // // Split the base64 string in data and contentType
  // let block = myBaseString.split(";");
  // // Get the content type
  // let dataType = block[0].split(":")[1];// In this case "application/pdf"
  // // get the real base64 content of the file
  // let realData = block[1].split(",")[1];// In this case "JVBERi0xLjcKCjE...."
  //
  // // The path where the file will be created
  // let folderpath = "file:///storage/emulated/0/download";
  //
  // savebase64AsPDF(folderpath,filename,realData,dataType);
  //
  // await sleep(250);
  //
  // window.f7.addNotification({
  //     message: 'Download complete, please check at download folder..',
  //     hold: 3000
  // });

  window.f7.hidePreloader();
}

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

plan_trip.goAutoPlan = async function(){
  window.f7.showPreloader();
  let user_id = store.user_id;
  let plan_data = JSON.stringify(store.trip_plan_data);

  let descTitle = store.trip_plan_data.first_city_code + ' - ';
  for (var i = 0; i < store.trip_plan_data.list_destination.length; i++) {
    descTitle += store.trip_plan_data.list_destination[i].country_code + ' ' + store.trip_plan_data.list_destination[i].stay;
    if(i !== store.trip_plan_data.list_destination.length-1){
      descTitle += ' + ';
    }
  }
  descTitle += '\n';
  descTitle += 'MS:' + store.trip_plan_data.interests[0].value + ' C:' + store.trip_plan_data.interests[1].value + ' N:' + store.trip_plan_data.interests[2].value + ' R:' + store.trip_plan_data.interests[3].value;

  let params = {
    user_id: user_id,
    plan_data: plan_data,
    description: descTitle,
  };

  let response = await got.post(store.service_url +"/trip/auto", {
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
  await sleep(500);
  window.f7.hidePreloader();
  window.f7.alert("We received your customised trip query.<br>Trip plan will be done within 1 day.<br>We'll let you know via notification if it's already done.<br>Thank you for your patience", 'Automatic Trip Plan', function(){
    goBack();
  });
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}


/**
 * Create a PDF file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function(dir) {
      console.log("Access to the directory granted succesfully");
  		dir.getFile(filename, {create:true}, function(file) {
              console.log("File created succesfully.");
              file.createWriter(function(fileWriter) {
                  console.log("Writing content to file");
                  fileWriter.write(DataBlob);
              }, function(){
                  alert('Unable to save file in path '+ folderpath);
              });
  		});
    });
}

plan_trip.debugMode = async function(service_url){
  window.f7.showPreloader();
  store.service_url = service_url;
  await sleep(500);
  window.f7.hidePreloader();
  window.f7.loginScreen();
  await sleep(250);
  goBack();

  window.f7.addNotification({
      message: service_url,
      hold: 3500
  });
}

export default plan_trip;
