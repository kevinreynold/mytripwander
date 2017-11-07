export default [
  {
      path: '/home/',
      component: require('./app.vue')
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
  }
]
