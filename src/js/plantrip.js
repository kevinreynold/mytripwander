import store from "./store";
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

export default plan_trip;
