import store from "./store";
import got from "got";

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

function makeDestRoute(trip_plan_data){
  let res = [];
  res.push(trip_plan_data.first_city_code);
  for (var i = 0; i < trip_plan_data.list_destination.length; i++) {
    res.push(trip_plan_data.list_destination[i].city_code);
  }
  if(trip_plan_data.return_here){
    res.push(trip_plan_data.first_city_code);
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

  for (var i = 0; i < dest_route.length-1; i++) {
    var flight_data = [];
    var flight_from = {
      origin: dest_route[i],
      destination: dest_route[i+1],
      date: current_date,
    };
    flight_data.push(flight_from);
    // console.log(passenger_data);
    // console.log(flight_data);
    window.f7.showPreloader();
    try {
      var data = await this.flight_search(flight_data,passenger_data);
      // console.log("Tunggu");
      if (data != null) {
        // console.log(data);
        let ticket_list = await processData(data);

        //ambil tiketnya dulu
        //ambil tiket termurah
        //ambil tiket yang malam dari hometown saja sisanya cari yang sampainya pagi.
        if(i === 0){
          ticket_list = await ticket_list.filter(filterDepartureFlight);
        }
        else{
          ticket_list = await ticket_list.filter(filterArrivalFlight);
        }
        ticket_list.sort((a,b) => a.unified_price - b.unified_price);

        current_date = new Date(ticket_list[0].display[0].arrival_airport.date);
        store.flight_plan.push(ticket_list[0]);

        if((!trip_plan_data.return_here) || (trip_plan_data.return_here && i < dest_route.length-2)){
          current_date = new Date(getDateAfter(current_date, trip_plan_data.list_destination[i].stay - 1));
        }

        window.f7.hidePreloader();
      }
      else{
        console.log("ERROR TICKET LIST");
        window.f7.addNotification({
            message: 'No Internet Connection..'
        });
        goBack();
        window.f7.hidePreloader();
      }
    } catch (e) {
      console.log(e.message);
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.addNotification({
            message: 'No Internet Connection..'
        });
        goBack();
      }, 1000);
    }
  }
  // console.log(store.flight_plan);
  window.f7.showPreloader();
  setTimeout(function () {
    goBack();
    window.f7.hidePreloader();
    window.f7.showPreloader();
  }, 1000);
  setTimeout(function () {
    goTo('/plan-overview-country/');
    window.f7.hidePreloader();
  }, 1500);
};

export default travelpayouts;
