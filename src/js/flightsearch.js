var travelpayouts = {}

var TravelPayouts = require('travelpayouts-api');
var api = new TravelPayouts('0852ce5f48b5d4158ed28dd23e7ddd44', '143764');

travelpayouts.api = api;

travelpayouts.flight_search = function(flight_data,passenger_data){
    return api.search(flight_data,passenger_data)
    .then(res => {
      window.f7.hidePreloader();
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
  var data = await this.flight_search(flight_data,passenger_data);
  // console.log(data);

  if (data != null) {
    //START PROCESS
    var ticket_list = [];
    var search_id = data[data.length-1].search_id;
    var ctr = 0;
    for (var i = 0; i < data.length; i++) {
      if (Object.getOwnPropertyDescriptor (data[i],"proposals")) {
        var gates_info = data[i].gates_info;
        var airports = data[i].airports;
        if (Object.keys(data[i].proposals).length > 0) {
          for (var j = 0; j < Object.keys(data[i].proposals).length; j++) { // Dapat Data per Tiket
            var ticket_data = data[i].proposals[j];
            var temp_ticket = {};

            //Info
            temp_ticket.display = [];
            temp_ticket.carriers = ticket_data.carriers;
            temp_ticket.is_direct = ticket_data.is_direct; //true or false
            temp_ticket.segment_durations = ticket_data.segment_durations; //true or false
            temp_ticket.total_duration = ticket_data.total_duration;
            temp_ticket.search_id = search_id; //true or false

            //Price
            var terms  = ticket_data.terms;
            for(var propName in terms) {
                if(terms.hasOwnProperty(propName)) {
                    var propValue = terms[propName];
                    temp_ticket.price = propValue.price;
                    temp_ticket.unified_price = propValue.unified_price;
                    temp_ticket.currency = propValue.currency;
                    temp_ticket.url = propValue.url;
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
                    duration: ticket_data.segment_durations[s],
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
    console.log(ticket_list);
    window.f7.hidePreloader();
    return ticket_list;
  }
  console.log("ERROR TICKET LIST");
  window.f7.hidePreloader();
  return null;
};

travelpayouts.getPriceListLocal = function(){
  var data = $.parseJSON($.ajax({
    url: "http://mytripwander.com/test/flight-api-result.json",
    dataType: "json",
    async: false
  }).responseText);

  //START PROCESS
  var ticket_list = [];
  var search_id = data[data.length-1].search_id;
  var ctr = 0;
  for (var i = 0; i < data.length; i++) {
    if (Object.getOwnPropertyDescriptor (data[i],"proposals")) {
      var gates_info = data[i].gates_info;
      var airports = data[i].airports;
      if (Object.keys(data[i].proposals).length > 0) {
        for (var j = 0; j < Object.keys(data[i].proposals).length; j++) { // Dapat Data per Tiket
          var ticket_data = data[i].proposals[j];
          var temp_ticket = {};

          //Info
          temp_ticket.display = [];
          temp_ticket.carriers = ticket_data.carriers;
          temp_ticket.is_direct = ticket_data.is_direct; //true or false
          temp_ticket.segment_durations = ticket_data.segment_durations; //true or false
          temp_ticket.total_duration = ticket_data.total_duration;
          temp_ticket.search_id = search_id; //true or false

          //Price
          var terms  = ticket_data.terms;
          for(var propName in terms) {
              if(terms.hasOwnProperty(propName)) {
                  var propValue = terms[propName];
                  temp_ticket.price = propValue.price;
                  temp_ticket.unified_price = propValue.unified_price;
                  temp_ticket.currency = propValue.currency;
                  temp_ticket.url = propValue.url;
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
                  duration: ticket_data.segment_durations[s],
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
  console.log(ticket_list);
};

export default travelpayouts;
