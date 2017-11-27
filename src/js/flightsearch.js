import store from "./store";

var travelpayouts = {};

var TravelPayouts = require('travelpayouts-api');
var search_timeout = 10;
var api = new TravelPayouts('0852ce5f48b5d4158ed28dd23e7ddd44', '143764',{url: 'http://api.travelpayouts.com', timeout: (search_timeout * 1000)});

function goToSearchResult(){
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.load({url: '/flight-result/'});
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
  store.flight_search_result = ticket_list;
  goToSearchResult();
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
    console.log("Tunggu");
    if (data != null) {
      processData(data);
      window.f7.hidePreloader();
    }
    else{
      console.log("ERROR TICKET LIST");
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
      window.f7.hidePreloader();
    }
  } catch (e) {
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    setTimeout(function () {
      window.f7.hidePreloader();
    }, 1000);
  }
};

// flight-api-result
// tokyo-round-trip
travelpayouts.getPriceListLocal = function(json = "tokyo-round-trip"){
  window.f7.showPreloader();
  try {
    var data = $.parseJSON($.ajax({
      url: "http://mytripwander.com/test/"+ json +".json",
      dataType: "json",
      async: false
    }).responseText);
    // console.log(data);

    processData(data);
    setTimeout(function () {
      window.f7.hidePreloader();
    }, 100);
  } catch (e) {
    window.f7.addNotification({
        message: 'No Internet Connection..'
    });
    setTimeout(function () {
      window.f7.hidePreloader();
    }, 1000);
  }
};

travelpayouts.getRedirectLink = function(){
  store.coba = 10;
};


export default travelpayouts;
