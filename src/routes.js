export default [
  {
      path: '/home/',
      component: require('./app.vue')
  },
  {
      path: '/createtrip/',
      component: require('./pages/createtripplan.vue')
  },
  {
      path: '/mytrip/',
      component: require('./pages/mytrip.vue')
  },
  {
      path: '/plan-overview-country/',
      component: require('./pages/plan-overview-country.vue')
  },
  {
      path: '/plan-overview-city/',
      component: require('./pages/plan-overview-city.vue')
  },
  {
      path: '/plan-overview-day/',
      component: require('./pages/plan-overview-day.vue')
  },
  {
      path: '/search-place/',
      component: require('./pages/search-place.vue')
  },
  {
      path: '/place-result/',
      component: require('./pages/place-result.vue')
  },
  {
      path: '/mybookings/',
      component: require('./pages/mybookings.vue')
  },
  {
      path: '/flight/',
      component: require('./pages/flightbookings.vue')
  },
  {
      path: '/flight-result/',
      component: require('./pages/flight-search-result.vue')
  },
  {
      path: '/flight-detail/',
      component: require('./pages/flight-ticket-detail.vue')
  },
  {
      path: '/flight-redirect/',
      component: require('./pages/flight-redirect.vue')
  },
  {
      path: '/hotel/',
      component: require('./pages/hotelbookings.vue')
  },
  {
      path: '/hotel-city-result/',
      component: require('./pages/hotel-city-result.vue')
  },
  {
      path: '/hotel-hotel-result/',
      component: require('./pages/hotel-hotel-result.vue')
  },
  {
      path: '/hotel-room-deals/',
      component: require('./pages/hotel-room-deals.vue')
  },
  {
      path: '/about/',
      component: require('./pages/about.vue')
  },
  {
      path: '/form/',
      component: require('./pages/form.vue')
  },
  {
      path: '/dynamic-route/blog/:blogId/post/:postId/',
      component: require('./pages/dynamic-route.vue')
  },
  {
      path: '/register/',
      component: require('./pages/register.vue')
  },
  {
      path: '/forgotpass/',
      component: require('./pages/forgotpass.vue')
  },
  {
      path: '/settings/',
      component: require('./pages/settings.vue')
  },
  {
      path: '/changepassword/',
      component: require('./pages/changepassword.vue')
  },
  {
      path: '/changecurrency/',
      component: require('./pages/changecurrency.vue')
  },
  {
      path: '/debugservice/',
      component: require('./pages/debugservice.vue')
  }
]
