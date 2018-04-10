// Import Vue
import Vue from 'vue'
import VueResource from 'vue-resource'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import F7 iOS Theme Styles
// import Framework7ThemeIOS from 'framework7/dist/css/framework7.ios.min.css'
// import Framework7ThemeColorsIOS from 'framework7/dist/css/framework7.ios.colors.min.css'
// OR for Material Theme:
// import Framework7ThemeColorsMaterial from 'framework7/dist/css/framework7.material.colors.min.css'
// import Framework7ThemeMaterial from 'framework7/dist/css/framework7.material.min.css'
// OR for Material Theme LOCAL:
import Framework7ThemeColorsMaterial from 'framework7/dist/css/framework7.material.colors.min.css'
import Framework7ThemeMaterial from './css/framework7.material.css'

// Import F7 Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css'

// Import App Custom Styles
import AppStyles from './css/app.css'

// Import Bootstrap
// import BootstrapCSS from './css/bootstrap.min.css'
// import BootstrapJS from './js/bootstrap.min.js'

// Import FontAwesome
import FontAwesome from './assets/font-awesome/css/font-awesome.min.css'

// Plugins
import * as VueGoogleMaps from 'vue2-google-maps'
import VueFormWizard from 'vue-form-wizard'
import './css/vue-form-wizard.css'

// Import Routes
import Routes from './routes.js'

// Import App Component
import App from './app'

// Init F7 Vue Plugin
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCxrMcKXjC6BwEOqQr_jpITTcGgAh1w4KI',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})
Vue.use(VueFormWizard)
Vue.use(VueResource)
Vue.use(Framework7Vue)

// Init App
new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    pushState: true,
    /* Uncomment to enable Material theme: */
    material: true,
    routes: Routes,
    // swipePanel: 'left'
  },
  // Register App Component
  components: {
    app: App,
  }
});
