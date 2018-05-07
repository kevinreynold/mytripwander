import store from "./store";
import got from "got";
import plan_trip from "./plantrip";

var travelpayouts = {};

var TravelPayouts = require('travelpayouts-api');
var search_timeout = 5;
var api = new TravelPayouts('0852ce5f48b5d4158ed28dd23e7ddd44', '143764',{url: 'http://api.travelpayouts.com', timeout: (search_timeout * 1000)});

function goTo(url_link = '/flight-result/'){
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

function processData(data){
  //START PROCESS
  var ticket_list = [];
  var search_id = data[data.length-1].search_id;
  var ctr = 0;
  for (var i = 0; i < data.length; i++) {
    if (Object.getOwnPropertyDescriptor (data[i],"proposals")) {
      var gates_info = data[i].gates_info;
      var airports = data[i].airports;
      var airlines = data[i].airlines;
      if (Object.keys(data[i].proposals).length > 0) {
        for (var j = 0; j < Object.keys(data[i].proposals).length; j++) { // Dapat Data per Tiket
          var ticket_data = data[i].proposals[j];
          var temp_ticket = {};
          var image_size = 200;

          //Info
          temp_ticket.display = [];
          temp_ticket.search_at = getDateAfterDays(0);
          temp_ticket.carriers = ticket_data.carriers;
          temp_ticket.carriers_name = airlines[temp_ticket.carriers[0]].name;
          temp_ticket.image_url = "http://pics.avs.io/" + image_size + "/" + image_size + "/" + temp_ticket.carriers[0] + ".png";
          temp_ticket.is_direct = ticket_data.is_direct; //true or false
          temp_ticket.segment_durations = ticket_data.segment_durations; //true or false
          temp_ticket.total_duration = ticket_data.total_duration;
          temp_ticket.search_id = search_id; //true or false

          //Price
          var terms  = ticket_data.terms;
          for(var propName in terms) {
              if(terms.hasOwnProperty(propName)) {
                  var propValue = terms[propName];
                  temp_ticket.price = Math.round(propValue.price * 100) / 100;
                  temp_ticket.unified_price = Math.round(propValue.unified_price * 100) / 100;
                  temp_ticket.currency = propValue.currency;
                  temp_ticket.url = "http://api.travelpayouts.com/v1/flight_searches/" + search_id + "/clicks/" + propValue.url + ".json";
              }
          }

          //Host Info
          for(var propName in gates_info) {
              if(gates_info.hasOwnProperty(propName)) {
                  var propValue = gates_info[propName];
                  temp_ticket.host_name = propValue.label;
              }
          }

          //Flight
          temp_ticket.segment = [];
          for (var s = 0; s < Object.keys(ticket_data.segment).length; s++) {
            temp_ticket.segment[s] = {};
            temp_ticket.segment[s].flight = [];
            for (var f = 0; f < Object.keys(ticket_data.segment[s].flight).length; f++) {
              var flight = {
                operated_by : ticket_data.segment[s].flight[f].operated_by,
                class : (ticket_data.segment[s].flight[f].trip_class === "Y")? "Economy" : "Business",
                duration : ticket_data.segment[s].flight[f].duration,
                delay : ticket_data.segment[s].flight[f].delay,
                departure : {
                  date : ticket_data.segment[s].flight[f].departure_date,
                  time : ticket_data.segment[s].flight[f].departure_time,
                  airport: {
                    code : ticket_data.segment[s].flight[f].departure,
                    city : airports[ticket_data.segment[s].flight[f].departure].city,
                    country : airports[ticket_data.segment[s].flight[f].departure].country,
                    name : airports[ticket_data.segment[s].flight[f].departure].name
                  }
                },
                arrival : {
                  date : ticket_data.segment[s].flight[f].arrival_date,
                  time : ticket_data.segment[s].flight[f].arrival_time,
                  airport: {
                    code : ticket_data.segment[s].flight[f].arrival,
                    city : airports[ticket_data.segment[s].flight[f].arrival].city,
                    country : airports[ticket_data.segment[s].flight[f].arrival].country,
                    name : airports[ticket_data.segment[s].flight[f].arrival].name
                  }
                }
              };


              //display
              if (f === 0) { //berangkat
                // var formatted_duration = ;
                var temp_display = {
                  departure_airport: {
                    date : ticket_data.segment[s].flight[f].departure_date,
                    time : ticket_data.segment[s].flight[f].departure_time,
                    airport: {
                      code : ticket_data.segment[s].flight[f].departure,
                      city : airports[ticket_data.segment[s].flight[f].departure].city,
                      country : airports[ticket_data.segment[s].flight[f].departure].country,
                      name : airports[ticket_data.segment[s].flight[f].departure].name
                    }
                  },
                  arrival_airport : {
                    date : ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival_date,
                    time : ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival_time,
                    airport: {
                      code : ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival,
                      city : airports[ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival].city,
                      country : airports[ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival].country,
                      name : airports[ticket_data.segment[s].flight[Object.keys(ticket_data.segment[s].flight).length-1].arrival].name
                    }
                  },
                  duration: changeFormatDuration(ticket_data.segment_durations[s]),
                  transit: []
                };
                temp_ticket.display.push(temp_display);
              }
              else {
                temp_ticket.display[s].transit.push(ticket_data.segment[s].flight[f].departure);
              }
              temp_ticket.segment[s].flight.push(flight);
            }
          }
          ticket_list.push(temp_ticket);
        }
      }
    }
  }
  //SORT BY PRICE.
  ticket_list.sort((a, b) => a.unified_price - b.unified_price);
  // console.log(ticket_list);
  return ticket_list;
}

travelpayouts.api = api;

travelpayouts.flight_search = function(flight_data,passenger_data){
  return api.search(flight_data,passenger_data)
  .then(res => {
    console.log('SUKSES');
    return res.results;
  })
  .catch(err => {
    console.error(err.stack || err.message);
    console.log('ERROR');
    return null;
  });
};

travelpayouts.getPriceList = async function(flight_data,passenger_data){
  store.flight_search_plan_mode = "booking";
  window.f7.showPreloader();
  try {
    var data = await this.flight_search(flight_data,passenger_data);
    // console.log("Tunggu");
    if (data != null) {
      let ticket_list = processData(data);
      store.original_flight_search_result = ticket_list;
      store.flight_search_result = ticket_list;
      window.f7.addNotification({
          message: store.flight_search_result.length + ' tickets found.',
          hold: 2500
      });
      goTo();
      window.f7.hidePreloader();
    }
    else{
      // console.log("ERROR TICKET LIST");
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
      window.f7.hidePreloader();
    }
  } catch (e) {
    setTimeout(function () {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }, 1000);
  }
};

// flight-api-result
// tokyo-round-trip
travelpayouts.getPriceListLocal = async function(json = "flight-api-result"){
  store.flight_search_plan_mode = "booking";
  window.f7.showPreloader();
  try {
    // var data = $.parseJSON($.ajax({
    //   url: "http://mytripwander.com/test/"+ json +".json",
    //   dataType: "json",
    //   async: false
    // }).responseText);
    var data = await got.get("http://mytripwander.com/test/"+ json +".json",{retries: 2})
    .then(res => {
      var res = JSON.parse(res.body);
      return res;
    });

    let ticket_list = processData(data);
    store.original_flight_search_result = ticket_list;
    store.flight_search_result = ticket_list;
    window.f7.addNotification({
        message: store.flight_search_result.length + ' tickets found.',
        hold: 2500
    });
    goTo();
    window.f7.hidePreloader();
    setTimeout(function () {
      window.f7.hidePreloader();
    }, 100);
  } catch (e) {
    setTimeout(function () {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }, 1000);
  }
};

travelpayouts.getRedirectLink = async function(url){
  window.f7.showPreloader();
  try {
    var result = await got.get(url, {retries: 2})
    .then(res => {
      var res = JSON.parse(res.body);
      return res;
    });

    store.flight_ticket_url = result;
    var url_redirect = String(store.flight_ticket_url.url);
    window.open(url_redirect, '_blank');

    // goTo('/flight-redirect/');
    setTimeout(function () {
      window.f7.hidePreloader();
    }, 100);
  } catch (e) {
    setTimeout(function () {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }, 1000);
  }
};

travelpayouts.getNearestAirport = async function(city_code){
    try {
        var data = await got.get(store.service_url + "/airport/nearest/" + city_code, {
          retries: 2
        })
        .then(res => {
          var res = JSON.parse(res.body);
          return res;
        });
        return data.result;
    } catch (e) {
      return city_code;
    }
}

function filterArrivalFlight(x){
  let answer = false;
  if((new Date('1970/01/01 ' + x.display[0].arrival_airport.time) >= new Date('1970/01/01 01:00') && new Date('1970/01/01 ' + x.display[0].arrival_airport.time) <= new Date('1970/01/01 12:00'))){
    answer = true;
  }
  return answer;
}

function filterDepartureFlight(x){
  let answer = false;
  if((new Date('1970/01/01 ' + x.display[0].departure_airport.time) >= new Date('1970/01/01 18:00') && new Date('1970/01/01 ' + x.display[0].departure_airport.time) <= new Date('1970/01/01 23:59'))){
    answer = true;
  }
  return answer;
}

function filterDayFlight(x){
  let answer = false;

  let start_date = new Date(x.display[0].departure_airport.date);
  let end_date = new Date(x.display[0].arrival_airport.date);
  start_date.setHours(0,0,0,0);
  end_date.setHours(0,0,0,0);

  let timeDiff = Math.abs(end_date.getTime() - start_date.getTime());
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if(diffDays > 0){
    answer = true;
  }

  return answer;
}

function makeDestRoute(trip_plan_data){ // hasil = ['SUB-TPE','TPE-HKG','HKG-SUB']
  let res = [];

  let temp = []
  for (var i = 0; i < trip_plan_data.list_destination.length; i++) {
    let temp = [];
    if(i === 0){
      temp.push(trip_plan_data.first_city_code);
      temp.push(trip_plan_data.list_destination[i].city_code);
    }
    else{
      temp.push(trip_plan_data.list_destination[i-1].last_city_code);
      temp.push(trip_plan_data.list_destination[i].city_code);
    }
    res.push(temp.join('-'));

    if(i === trip_plan_data.list_destination.length - 1 && trip_plan_data.return_here){
      temp = [];
      temp.push(trip_plan_data.list_destination[i].last_city_code);
      temp.push(trip_plan_data.first_city_code);
      res.push(temp.join('-'));
    }
  }
  return res;
}

function getDateAfter(cur_date, day){
  var date = new Date(cur_date.getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

travelpayouts.getFlightPlan = async function(){
  store.flight_plan = [];
  let trip_plan_data = copy(store.trip_plan_data);
  let dest_route = makeDestRoute(trip_plan_data);
  console.log(dest_route);
  let current_date = new Date(trip_plan_data.start_date);

  //options
  let passenger_data = {
    host: 'mytripwander.com',
    user_ip: '127.0.0.1',
    locale: 'en',
    trip_class: 'Y',
    passengers: {
      adults: trip_plan_data.passenger.adults,
      children: trip_plan_data.passenger.children,
      infants: 0
    },
    know_english: true
  };

  try {
    for (var i = 0; i < dest_route.length; i++) {
      let split_string_route = dest_route[i].split('-');
      let origin_route = await this.getNearestAirport(split_string_route[0]);
      let destination_route = await this.getNearestAirport(split_string_route[1]);

      var flight_data = [];
      var flight_from = {
        origin: origin_route,
        destination: destination_route,
        date: current_date,
      };
      flight_data.push(flight_from);
      // console.log(passenger_data);
      // console.log(flight_data);
      window.f7.showPreloader('Looking for flight from ' + origin_route + ' to ' + destination_route);

      var data = await this.flight_search(flight_data,passenger_data);
      // console.log("Tunggu");
      if (data != null) {
        // console.log(data);
        let ticket_list = await processData(data);
        let original_ticket_list = copy(ticket_list);
        //ambil tiketnya dulu
        //ambil tiket termurah
        //ambil tiket yang malam dari hometown saja sisanya cari yang sampainya pagi.
        if(i === 0){
          ticket_list = ticket_list.filter(filterArrivalFlight);
          if(ticket_list.length === 0){
            ticket_list = original_ticket_list;
          }
          // ticket_list = ticket_list.filter(filterDayFlight);
        }
        else{
          ticket_list = ticket_list.filter(filterArrivalFlight);
          if(ticket_list.length === 0){
            ticket_list = original_ticket_list;
          }
          // ticket_list = ticket_list.filter(filterDayFlight);
        }
        ticket_list.sort((a,b) => a.unified_price - b.unified_price);

        current_date = new Date(ticket_list[0].display[0].arrival_airport.date);
        store.flight_plan.push(ticket_list[0]);

        await sleep(1000);
        if(i < dest_route.length - 1){
          current_date = new Date(getDateAfter(current_date, trip_plan_data.list_destination[i].stay - 1));
          console.log(current_date);
        }
        // if((!trip_plan_data.return_here) || (trip_plan_data.return_here && i < dest_route.length - 1)){
        //   current_date = new Date(getDateAfter(current_date, trip_plan_data.list_destination[i].stay - 1));
        //   console.log(current_date);
        // }

        window.f7.hidePreloader();
      }
      else{
        console.log("ERROR TICKET LIST");
        window.f7.addNotification({
            message: 'No Internet Connection..'
        });
        goBack();
        window.f7.hidePreloader();
        error = true;
        break;
      }
    }
  } catch (e) {
    console.log(e.message);
    await sleep(1000);
    window.f7.hidePreloader();
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    goBack();
    return 0;
  }

  if(error){ return 0; }

  // console.log(store.flight_plan);
  window.f7.showPreloader();

  //buat data per harinya di city
  store.trip_city_plan_data = [];
  let list_destination = copy(trip_plan_data.list_destination);
  let flight_plan = copy(store.flight_plan);
  for (let i = 0; i < list_destination.length; i++) {
    let temp = {};
    // temp['list_destination'] = list_destination[i];
    let stay = list_destination[i].stay;

    let list_dest_trip = [];
    for (let j = 0; j < stay; j++) {
      let day = {
        day: (j+1),
        start_hour: "08:00",
        hotel_data: undefined,
        hotel_before_duration: 0,
        hotel_now_duration: 0,
        to_another_city: false,
        list_place: []
      };
      list_dest_trip.push(day);
    }

    //airport
    temp['arrival'] = flight_plan[i].display[0];
    temp['go_back'] = ((i+1) < flight_plan.length)? flight_plan[i+1].display[0] : undefined;
    temp['arrival_duration'] = 60; //dalam menit
    temp['go_back_duration'] = 90; //dalam menit
    temp['hotel_go_back_duration'] = 60; //dalam menit

    temp['arrival_airport'] = await plan_trip.getAirport(temp['arrival'].arrival_airport.airport.code);
    if(temp['go_back']){
      temp['go_back_airport'] = await plan_trip.getAirport(temp['go_back'].departure_airport.airport.code);
    }
    else{
      temp['go_back_airport'] = undefined;
    }

    temp['cities'] = [];
    let city = {
      id: 1,
      city_code: list_destination[i].city_code,
      city_name: list_destination[i].city_name,
      hotel_city_id: list_destination[i].hotel_city_id,
      day: stay,
      hotel: undefined,
      hotel_data: undefined,
      booking_data: undefined,
      search_at: getDateAfterDays(0),
      list_dest_trip: list_dest_trip
    };
    temp['cities'].push(city);

    temp['already_open'] = false;
    store.trip_city_plan_data.push(temp);
  }
  console.log(store.trip_city_plan_data);

  //atur start_hour dan hotel_now_duration
  for (let k = 0; k < store.trip_city_plan_data.length; k++) {
    for (let i = 0; i < store.trip_city_plan_data[k].cities.length; i++) {
      for (let j = 0; j < store.trip_city_plan_data[k].cities[i].list_dest_trip.length; j++) {
        if(i == 0 && j == 0){
          store.trip_city_plan_data[k].cities[i].list_dest_trip[j].start_hour = store.trip_city_plan_data[k].arrival.arrival_airport.time;
        }

        if(j == 0){
          store.trip_city_plan_data[k].cities[i].list_dest_trip[j].hotel_now_duration = 60;
        }
      }
    }
  }

  store.plan_trip_mode = "plan";
  //simpan database
  // window.f7.hidePreloader();
  await plan_trip.saveTrip();

  await sleep(500);
  // window.f7.showPreloader();
  goBack();

  await sleep(500);
  goTo('/plan-overview-country/');
  window.f7.hidePreloader();
};

function filterByFlightTime(x){
  let flight_details = copy(store.flight_details);
  let answer = false;
  if((new Date('1970/01/01 ' + x.display[0].departure_airport.time).getTime() === new Date('1970/01/01 ' + flight_details.display[0].departure_airport.time).getTime())){
    answer = true;
  }
  else{
    return false;
  }

  if((new Date('1970/01/01 ' + x.display[0].arrival_airport.time).getTime() === new Date('1970/01/01 ' + flight_details.display[0].arrival_airport.time).getTime())){
    answer = true;
  }
  else{
    return false;
  }

  return answer;
}

travelpayouts.searchAgain = async function(mode = false){
  let trip_plan_data = copy(store.trip_plan_data);
  let flight_details = copy(store.flight_details);

  var flight_data = [];
  var flight_from = {
    origin: flight_details.display[0].departure_airport.airport.code,
    destination: flight_details.display[0].arrival_airport.airport.code,
    date: new Date(flight_details.display[0].departure_airport.date),
  };
  flight_data.push(flight_from);

  //options
  let passenger_data = {
    host: 'mytripwander.com',
    user_ip: '127.0.0.1',
    locale: 'en',
    trip_class: 'Y',
    passengers: {
      adults: trip_plan_data.passenger.adults,
      children: trip_plan_data.passenger.children,
      infants: 0
    },
    know_english: true
  };

  window.f7.showPreloader();
  try {
    var data = await this.flight_search(flight_data,passenger_data);
    if (data != null) {
      let ticket_list = processData(data);
      let ticket_list_original = copy(ticket_list);
      //filter data sesuai jam terbang tiketnya
      ticket_list = ticket_list.filter(filterByFlightTime);
      ticket_list.sort((a,b) => a.unified_price - b.unified_price);

      if(ticket_list.length > 0 && !mode){
        console.log("ada tiket");
        if(!mode){
          goBack();
        }
        store.flight_search_plan_mode = "change";
        store.flight_booking_data = flight_data;
        store.search_again_mode = false;
        await sleep(1500);
        store.flight_details = ticket_list[0];
        goTo('/flight-detail/');
      }
      else{
        console.log("cari ulang");
        if(!mode){
          goBack();
        }
        store.flight_search_plan_mode = "change";
        store.flight_booking_data = flight_data;
        store.search_again_mode = true;
        await sleep(1500);
        store.original_flight_search_result = ticket_list_original;
        store.flight_search_result = ticket_list_original;
        window.f7.addNotification({
            message: store.flight_search_result.length + ' tickets found.',
            hold: 2500
        });
        goTo();
      }
      window.f7.hidePreloader();
    }
    else{
      // console.log("ERROR TICKET LIST");
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
      window.f7.hidePreloader();
    }
  } catch (e) {
    setTimeout(function () {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }, 1000);
  }
};

travelpayouts.changeFlightPlan = async function(){
  window.f7.showPreloader();
  store.flight_plan.splice(store.flight_plan_index, 1);
  store.flight_plan.splice(store.flight_plan_index, 0, store.flight_details);

  //ubah goback_airport dan arrival_airport
  //airport
  let list_destination = copy(store.trip_plan_data.list_destination);
  for (let i = 0; i < list_destination.length; i++) {
    store.trip_city_plan_data[i].arrival = store.flight_plan[i].display[0];
    store.trip_city_plan_data[i].go_back = (i < store.flight_plan.length - 1)? store.flight_plan[i+1].display[0] : undefined;

    store.trip_city_plan_data[i].arrival_airport = await plan_trip.getAirport(store.trip_city_plan_data[i].arrival.arrival_airport.airport.code);
    if(store.trip_city_plan_data[i].go_back){
      store.trip_city_plan_data[i].go_back_airport = await plan_trip.getAirport(store.trip_city_plan_data[i].go_back.departure_airport.airport.code);
    }
    else{
      store.trip_city_plan_data[i].go_back_airport = undefined;
    }
  }

  for (let k = 0; k < store.trip_city_plan_data.length; k++) {
    for (let i = 0; i < store.trip_city_plan_data[k].cities.length; i++) {
      for (let j = 0; j < store.trip_city_plan_data[k].cities[i].list_dest_trip.length; j++) {
        if(i == 0 && j == 0){
          store.trip_city_plan_data[k].cities[i].list_dest_trip[j].start_hour = store.trip_city_plan_data[k].arrival.arrival_airport.time;
        }

        if(j == 0){
          store.trip_city_plan_data[k].cities[i].list_dest_trip[j].hotel_now_duration = 60;
        }
      }
    }
  }

  await sleep(250);

  var mainView = Dom7('#main-view')[0].f7View;
  goBack();
  if(store.search_again_mode){
    await sleep(500);
    goBack();
  }
  await sleep(500);
  mainView.router.refreshPage();
  await sleep(500);
  window.f7.hidePreloader();
};

travelpayouts.researchFlightPlan = async function(start_index){ //cek di hotelsearch.js
  store.flight_plan = store.flight_plan.slice(0, start_index);
  // store.flight_plan = [];

  let trip_plan_data = copy(store.trip_plan_data);
  let dest_route = makeDestRoute(trip_plan_data);
  // let current_date = new Date(trip_plan_data.start_date);
  let current_date = new Date(store.trip_city_plan_data[start_index].arrival.departure_airport.date);

  //options
  let passenger_data = {
    host: 'mytripwander.com',
    user_ip: '127.0.0.1',
    locale: 'en',
    trip_class: 'Y',
    passengers: {
      adults: trip_plan_data.passenger.adults,
      children: trip_plan_data.passenger.children,
      infants: 0
    },
    know_english: true
  };

  let error = false;

  try {
    for (var i = start_index; i < dest_route.length; i++) {
    // for (var i = 0; i < dest_route.length; i++) {
      let split_string_route = dest_route[i].split('-');
      let origin_route = await this.getNearestAirport(split_string_route[0]);
      let destination_route = await this.getNearestAirport(split_string_route[1]);

      var flight_data = [];
      var flight_from = {
        origin: origin_route,
        destination: destination_route,
        date: current_date,
      };
      flight_data.push(flight_from);
      // console.log(passenger_data);
      // console.log(flight_data);
      window.f7.showPreloader('Looking for new flight from ' + origin_route + ' to ' + destination_route);


      var data = await this.flight_search(flight_data,passenger_data);
      // console.log("Tunggu");
      if (data != null) {
        // console.log(data);
        let ticket_list = await processData(data);
        let original_ticket_list = copy(ticket_list);
        //ambil tiketnya dulu
        //ambil tiket termurah
        //ambil tiket yang malam dari hometown saja sisanya cari yang sampainya pagi.
        if(i === 0){
          ticket_list = ticket_list.filter(filterArrivalFlight);
          if(ticket_list.length === 0){
            ticket_list = original_ticket_list;
          }
          // ticket_list = ticket_list.filter(filterDayFlight);
        }
        else{
          ticket_list = ticket_list.filter(filterArrivalFlight);
          if(ticket_list.length === 0){
            ticket_list = original_ticket_list;
          }
          // ticket_list = ticket_list.filter(filterDayFlight);
        }
        ticket_list.sort((a,b) => a.unified_price - b.unified_price);

        current_date = new Date(ticket_list[0].display[0].arrival_airport.date);
        store.flight_plan.push(ticket_list[0]);

        await sleep(1000);
        if((!trip_plan_data.return_here) || (trip_plan_data.return_here && i < dest_route.length - 1)){
          current_date = new Date(getDateAfter(current_date, trip_plan_data.list_destination[i].stay - 1));
          console.log(current_date);
        }

        window.f7.hidePreloader();
      }
      else{
        console.log("ERROR TICKET LIST");
        window.f7.hidePreloader();

        error = true;
        break;
      }
    }
  } catch (e) {
    store.trip_city_plan_data[store.trip_city_plan_data_index].already_open = false;
    console.log(e.message);
    await sleep(1000);
    window.f7.hidePreloader();

    return 0;
  }

  if(error){ return 0; }

  //ubah goback_airport dan arrival_airport
  //airport
  let list_destination = copy(store.trip_plan_data.list_destination);
  for (let i = start_index; i < list_destination.length; i++) {
    store.trip_city_plan_data[i].arrival = store.flight_plan[i].display[0];
    store.trip_city_plan_data[i].go_back = (i < store.flight_plan.length - 1)? store.flight_plan[i+1].display[0] : undefined;

    store.trip_city_plan_data[i].arrival_airport = await plan_trip.getAirport(store.trip_city_plan_data[i].arrival.arrival_airport.airport.code);
    if(store.trip_city_plan_data[i].go_back){
      store.trip_city_plan_data[i].go_back_airport = await plan_trip.getAirport(store.trip_city_plan_data[i].go_back.departure_airport.airport.code);
    }
    else{
      store.trip_city_plan_data[i].go_back_airport = undefined;
    }
  }

  console.log(store.trip_city_plan_data);
  console.log(store.flight_plan);

  return 1;
};

export default travelpayouts;
