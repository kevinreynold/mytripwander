import store from "./store";
import got from "got";

var hotel_api = {};

function goTo(url_link = '/hotel-result/'){
  var mainView = Dom7('#main-view')[0].f7View;
  mainView.router.load({url: url_link});
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

hotel_api.hotelSearch = async function(passenger_data){
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
        store.original_hotel_city_search_result = data.result;
        store.hotel_city_search_result = data.result;
        window.f7.addNotification({
            message: store.original_hotel_city_search_result.length + ' hotels found.',
            hold: 1500
        });
        goTo('/hotel-city-result/');
      }
      else if(passenger_data.type === "hotel"){
        store.original_hotel_hotel_search_result = data.result;
        store.hotel_hotel_search_result = data.result;
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
}

// hotel_search_hongkong_city
// hotel_search_hongkong_hotel
hotel_api.hotelSeachLocal = function(json = "hotel_search_hongkong_city"){
  window.f7.showPreloader();
  try {
    var data = $.parseJSON($.ajax({
      url: "http://mytripwander.com/test/"+ json +".json",
      dataType: "json",
      async: false
    }).responseText);

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
      store.original_hotel_hotel_search_result = data.result;
      store.hotel_hotel_search_result = data.result;
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

export default hotel_api;
