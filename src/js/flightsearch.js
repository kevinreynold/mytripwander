var travelpayouts = {}

var TravelPayouts = require('travelpayouts-api');
var api = new TravelPayouts('0852ce5f48b5d4158ed28dd23e7ddd44', '143764');

travelpayouts.api = api;

travelpayouts.flight_search = function(){
    // window.f7.showPreloader();
    return api.search({
      origin: 'SUB',
      destination: 'DPS',
      date: new Date("2017-11-18"),
    },
    {
      host: 'mytripwander.com',
      user_ip: '127.0.0.1',
      locale: 'en',
      trip_class: 'Y',
      passengers: {
        adults: 1,
        children: 0,
        infants: 0
      },
      know_english: true
    })
    .then(res => {
      // window.f7.hidePreloader();
      console.log(res.results);
      // console.log('SUKSES');
    })
    .catch(err => {
      console.error(err.stack || err.message);
      // console.log('ERROR');
    });
  };

  travelpayouts.getPriceList = function(){
    var data = $.parseJSON($.ajax({
      url: "http://mytripwander.com/test/flight-api-result.json",
      dataType: "json",
      async: false
    }).responseText);
    console.log(data);

    //START PROCESS
    var ticket_list = [];
    var search_id = data[data.length-1].search_id;
    var ctr = 0;
    for (var i = 0; i < data.length; i++) {
      if (Object.getOwnPropertyDescriptor (data[i],"proposals")) {
        if (Object.keys(data[i].proposals).length > 0) {
          for (var j = 0; j < Object.keys(data[i].proposals).length; j++) { // Dapat Data per Tiket
            var ticket_data = data[i].proposals[j];
            // airlines_code
            // airlines_name
            // host_name
            // price
            //
            // departure_date
            // departure_time
            // departure //IATA
            //
            // arrival_date
            // arrival_time
            // arrival //IATA
            //
            // duration
            // transit
          }
        }
      }
    }
    console.log(ctr);
  };

export default travelpayouts;
