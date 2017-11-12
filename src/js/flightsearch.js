var travelpayouts = {}

var TravelPayouts = require('travelpayouts-api');
var api = new TravelPayouts('0852ce5f48b5d4158ed28dd23e7ddd44', '143764');

travelpayouts.api = api;

travelpayouts.flight_search = function(){
  window.f7.showPreloader();
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
    window.f7.hidePreloader();
    console.log(res.results);
    // console.log('SUKSES');
  })
  .catch(err => {
    console.error(err.stack || err.message);
    // console.log('ERROR');
  });
};

export default travelpayouts;
