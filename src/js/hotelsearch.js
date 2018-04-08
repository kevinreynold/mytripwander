import store from "./store";
import got from "got";
import travelpayouts from "./flightsearch";

var hotel_api = {};

function goTo(url_link = '/hotel-result/'){
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

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

hotel_api.hotelSearch = async function(passenger_data){
    store.hotel_search_plan_mode = "booking";
    window.f7.showPreloader();
    try {
      var data = await got.get(store.service_url +"/hotel/search", {
        query: passenger_data,
        retries: 2
      })
      .then(res => {
        var res = JSON.parse(res.body);
        return res;
      });

      if(passenger_data.type === "city"){
        if(data.result.length > 0){
          store.original_hotel_city_search_result = data.result;
          store.hotel_city_search_result = data.result;
          window.f7.addNotification({
              message: store.original_hotel_city_search_result.length + ' hotels found.',
              hold: 1500
          });
          goTo('/hotel-city-result/');
        }
        else{
          setTimeout(function () {
            window.f7.hidePreloader();
            window.f7.addNotification({
                message: 'No Rooms Available..'
            });
          }, 1000);
        }
      }
      else if(passenger_data.type === "hotel"){
        if(data.result.length > 0){
          store.hotel_details = data.result[0];
          goTo('/hotel-hotel-result/');
        }
        else{
          setTimeout(function () {
            window.f7.hidePreloader();
            window.f7.addNotification({
                message: 'No Rooms Available..'
            });
          }, 1000);
        }
      }

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
}

// hotel_search_hongkong_city
// hotel_search_hongkong_hotel
hotel_api.hotelSeachLocal = async function(json = "hotel_search_hongkong_city"){
  store.hotel_search_plan_mode = "booking";
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

    if(json == "hotel_search_hongkong_city"){
      store.original_hotel_city_search_result = data.result;
      store.hotel_city_search_result = data.result;
      window.f7.addNotification({
          message: store.original_hotel_city_search_result.length + ' hotels found.',
          hold: 1500
      });
      goTo('/hotel-city-result/');
    }
    else{
      store.hotel_details = data.result[0];
      goTo('/hotel-hotel-result/');
    }

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

hotel_api.getRedirectLink = async function(url){
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

function getDateAfterDays(day){
  var date = new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

function getDateAfter(cur_date, day){
  var date = new Date(cur_date.getTime() + day * 24 * 60 * 60 * 1000);
  return date.getFullYear() + "-" + ("00" + (date.getMonth()+1)).slice(-2) + "-" + ("00" + (date.getDate())).slice(-2);
}

hotel_api.getAllHotelByCity = async function(city_code){
    try {
        var data = await got.get(store.service_url + "/hotel/" + city_code, {
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

hotel_api.getHotelPlan = async function(){
  let cur_index = store.trip_city_plan_data_index;
  console.log(cur_index);
  let trip_city_plan_data_one = copy(store.trip_city_plan_data[cur_index]);
  console.log(trip_city_plan_data_one);
  let trip_plan_data = copy(store.trip_plan_data);
  console.log(trip_plan_data);
  let current_date = new Date(trip_city_plan_data_one.arrival.display[0].arrival_airport.date);
  let new_total_stay = 0;

  for (var i = 0; i < trip_city_plan_data_one.cities.length; i++) {
    let check_out = "";
    if(i === trip_city_plan_data_one.cities.length - 1){
      check_out = new Date(getDateAfter(current_date, trip_city_plan_data_one.cities[i].day - 1));
    }
    else{
      check_out = new Date(getDateAfter(current_date, trip_city_plan_data_one.cities[i].day));
    }

    console.log(current_date);
    console.log(check_out);
    let passenger_data = {};
    if(trip_city_plan_data_one.cities[i].hotel == undefined || trip_city_plan_data_one.cities[i].hotel == null){
      console.log('case 1');
      passenger_data = {
        adults: trip_plan_data.passenger.adults,
        children: trip_plan_data.passenger.children,
        checkin: getDateAfter(current_date, 0),
        checkout: getDateAfter(check_out, 0),
        type: 'city',
        place_id: trip_city_plan_data_one.cities[i].hotel_city_id
      };
    }
    else{
      console.log('case 2');
      passenger_data = {
        adults: trip_plan_data.passenger.adults,
        children: trip_plan_data.passenger.children,
        checkin: getDateAfter(current_date, 0),
        checkout: getDateAfter(check_out, 0),
        type: 'hotel',
        place_id: trip_city_plan_data_one.cities[i].hotel.id.toString()
      };
    }

    window.f7.showPreloader('Looking for hotel at ' + trip_city_plan_data_one.cities[i].city_name);
    console.log(passenger_data);
    try {
      var data = await got.get(store.service_url +"/hotel/search", {
        query: passenger_data,
        retries: 2
      })
      .then(res => {
        console.log(res);
        var res = JSON.parse(res.body);
        console.log("SUKSES HOTEL");
        return res;
      });

      let hotel_list = data.result;
      console.log(hotel_list);
      let list_hotel_city_id = await this.getAllHotelByCity(trip_city_plan_data_one.cities[i].city_code);
      console.log(list_hotel_city_id);
      hotel_list = hotel_list.filter(x => list_hotel_city_id.some(x2 => x.id.toString() == x2.toString()));
      hotel_list = hotel_list.filter(x => x.rating > 70 && x.stars > 3);
      // hotel_list.sort((a,b) => b.popularity - a.popularity);
      hotel_list.sort((a,b) => a.price - b.price);
      console.log(hotel_list);

      let hotel_booking = hotel_list[0];
      console.log(hotel_booking);

      store.trip_city_plan_data[store.trip_city_plan_data_index].cities[i].hotel = hotel_booking;
      store.trip_city_plan_data[store.trip_city_plan_data_index].cities[i].booking_data = {
        adults: trip_plan_data.passenger.adults,
        children: trip_plan_data.passenger.children,
        checkin: getDateAfter(current_date, 0),
        checkout: getDateAfter(check_out, 0),
        type: 'city',
        place_id: trip_city_plan_data_one.cities[i].hotel_city_id
      };

      current_date = check_out;
      window.f7.hidePreloader();
    } catch (e) {
      console.log(e.message);
      setTimeout(function () {
        window.f7.hidePreloader();
        window.f7.addNotification({
            message: 'No Internet Connection..'
        });
      }, 1000);
    }


    new_total_stay = new_total_stay + trip_city_plan_data_one.cities[i].day;
  }

  store.trip_city_plan_data[store.trip_city_plan_data_index].already_open = true;
  //informasi
  let new_first_city = {
    city_code: trip_city_plan_data_one.cities[0].city_code,
    city_name: trip_city_plan_data_one.cities[0].city_name,
    zone_id: trip_city_plan_data_one.cities[0].zone_id,
    hotel_city_id: trip_city_plan_data_one.cities[0].hotel_city_id
  };

  let new_last_city = {
    city_code: trip_city_plan_data_one.cities[trip_city_plan_data_one.cities.length - 1].city_code,
    city_name: trip_city_plan_data_one.cities[trip_city_plan_data_one.cities.length - 1].city_name,
    zone_id: trip_city_plan_data_one.cities[trip_city_plan_data_one.cities.length - 1].zone_id,
    hotel_city_id: trip_city_plan_data_one.cities[trip_city_plan_data_one.cities.length - 1].hotel_city_id
  };

  //waktunya compare flight_plan
  //cek dulu jumlah harinya
  let is_change_flight = false;

  let list_destination = trip_plan_data.list_destination[cur_index];
  if(new_total_stay === list_destination.stay){
      console.log('case A');
      //cek kota berangkat
      let arrival_flight_plan = copy(store.flight_plan[cur_index]);
      if(new_first_city.city_code !== arrival_flight_plan.display[0].arrival_airport.airport.code){
        is_change_flight = true;
        console.log('case B');
      }
      //cek kota pulang
      let departure_flight_plan = {};
      if(store.flight_plan[cur_index + 1]){
        console.log('case C');
        departure_flight_plan = copy(store.flight_plan[cur_index + 1]);
        if(new_last_city.city_code !== departure_flight_plan.display[0].departure_airport.airport.code){
          is_change_flight = true;
          console.log('case D');
        }
      }
  }
  else{
    is_change_flight = true;
    console.log('case E');
  }

  //ubah trip_plan_data untuk list_destination
  store.trip_plan_data.list_destination[cur_index].stay = new_total_stay;
  store.trip_plan_data.list_destination[cur_index].city_code = new_first_city.city_code;
  store.trip_plan_data.list_destination[cur_index].city_name = new_first_city.city_name;
  store.trip_plan_data.list_destination[cur_index].hotel_city_id = new_first_city.hotel_city_id;
  store.trip_plan_data.list_destination[cur_index].zone_id = new_first_city.zone_id;

  store.trip_plan_data.list_destination[cur_index].last_city_code = new_last_city.city_code;
  store.trip_plan_data.list_destination[cur_index].last_city_name = new_last_city.city_name;
  store.trip_plan_data.list_destination[cur_index].last_hotel_city_id = new_last_city.hotel_city_id;
  store.trip_plan_data.list_destination[cur_index].last_zone_id = new_last_city.zone_id;

  //research flight
  if(is_change_flight){
    await travelpayouts.researchFlightPlan(cur_index);
    window.f7.showPreloader();
    await sleep(250);
    goBack();
    await sleep(250);
    window.f7.hidePreloader();
    await sleep(250);
    window.f7.showPreloader();
    await sleep(250);
    window.f7.closeModal("#popup-choose-city",true);
    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.refreshPage();
    window.f7.hidePreloader();
  }
  else{
    await sleep(250);
    window.f7.showPreloader();
    setTimeout(function () {
      window.f7.closeModal("#popup-choose-city",true);
      var mainView = Dom7('#main-view')[0].f7View;
      mainView.router.refreshPage();
      window.f7.hidePreloader();
    }, 1500);
  }
}

hotel_api.searchAgain = async function(mode = false){
  let city_index = store.hotel_plan_index;
  let hotel_details = copy(store.hotel_details);
  let cur_index = store.trip_city_plan_data_index;
  console.log(cur_index);
  let trip_city_plan_data_one = copy(store.trip_city_plan_data[cur_index]);
  let passenger_data = copy(trip_city_plan_data_one.cities[city_index].booking_data);
  console.log(passenger_data);

  window.f7.showPreloader();
  try {
    var data = await got.get(store.service_url +"/hotel/search", {
      query: passenger_data,
      retries: 2
    })
    .then(res => {
      var res = JSON.parse(res.body);
      return res;
    });

    let hotel_list = data.result;
    let list_hotel_city_id = await this.getAllHotelByCity(trip_city_plan_data_one.cities[city_index].city_code);
    hotel_list = hotel_list.filter(x => list_hotel_city_id.some(x2 => x.id.toString() == x2.toString()));

    let hotel_list_original = copy(hotel_list);
    hotel_list = hotel_list.filter(x => x.id.toString() == trip_city_plan_data_one.cities[city_index].hotel.id.toString());

    if(hotel_list.length > 0 && !mode){
      console.log("hotel ada tiket");
      goBack();
      store.hotel_search_plan_mode = "change";
      store.hotel_booking_data = passenger_data;
      store.hotel_search_again_mode = false;
      await sleep(1500);
      store.hotel_details = hotel_list[0];
      goTo('/hotel-hotel-result/');
    }
    else{
      console.log("hotel cari ulang");
      if(!mode){
        goBack();
      }
      store.hotel_search_plan_mode = "change";
      store.hotel_booking_data = passenger_data;
      store.hotel_search_again_mode = true;
      await sleep(1500);

      store.original_hotel_city_search_result = hotel_list_original;
      store.hotel_city_search_result = hotel_list_original;
      window.f7.addNotification({
          message: store.original_hotel_city_search_result.length + ' hotels found.',
          hold: 1500
      });
      goTo('/hotel-city-result/');
    }
    window.f7.hidePreloader();
  } catch (e) {
    setTimeout(function () {
      window.f7.hidePreloader();
      window.f7.addNotification({
          message: 'No Internet Connection..'
      });
    }, 1000);
  }
}

hotel_api.changeHotelBooking = async function(room_deal){
  console.log("ganti hotel");
  console.log(room_deal);
  window.f7.showPreloader();
  console.log(store.trip_city_plan_data[store.trip_city_plan_data_index].cities[store.hotel_plan_index]);
  store.trip_city_plan_data[store.trip_city_plan_data_index].cities[store.hotel_plan_index].search_at = getDateAfterDays(0);
  store.trip_city_plan_data[store.trip_city_plan_data_index].cities[store.hotel_plan_index].hotel = store.hotel_details;
  store.trip_city_plan_data[store.trip_city_plan_data_index].cities[store.hotel_plan_index].hotel.rooms = [];
  store.trip_city_plan_data[store.trip_city_plan_data_index].cities[store.hotel_plan_index].hotel.rooms.push(room_deal);
  var mainView = Dom7('#main-view')[0].f7View;
  goBack();
  await sleep(500);
  if(store.hotel_search_again_mode){
    goBack();
  }
  await sleep(500);
  if(store.hotel_search_more_deal_mode){
    goBack();
  }
  await sleep(500);
  store.hotel_search_more_deal_mode = false;
  mainView.router.refreshPage();
  await sleep(500);
  window.f7.hidePreloader();
}

export default hotel_api;
