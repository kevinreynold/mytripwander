import store from "./store";
import travelpayouts from "./flightsearch";
import got from "got";

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

plan_trip.goToPerDay = async function(city_code){
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

    var mainView = Dom7('#main-view')[0].f7View;
    mainView.router.load({url: '/plan-overview-day/'});
}

export default plan_trip;
