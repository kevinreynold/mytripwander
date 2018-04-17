<template>

  <f7-views>
    <f7-view id="main-view" navbar-through :dynamic-navbar="true" theme="teal" main>
      <!-- Pages -->
      <f7-pages>
        <f7-page pull-to-refresh @ptr:refresh="onRefresh">
          <!-- Material Theme Navbar -->
          <f7-navbar>
            <f7-nav-left>
              <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center sliding>Home</f7-nav-center>
            <f7-nav-right>
              <f7-link open-panel="right"><f7-icon f7="bell"/></f7-link>
              <!-- <f7-link open-panel="right"></f7-link> -->
            </f7-nav-right>
          </f7-navbar>
          <!-- Page Content -->
          <f7-block-title>Welcome to my App</f7-block-title>
          <f7-block inner>
            <p>Duis sed erat ac eros ultrices pharetra id ut tellus. Praesent rhoncus enim ornare ipsum aliquet ultricies. Pellentesque sodales erat quis elementum sagittis.</p>
          </f7-block>
          <f7-block-title>Navigation</f7-block-title>
          <f7-list>
            <f7-list-item link="/about/" title="About"></f7-list-item>
            <f7-list-item link="/form/" title="Form"></f7-list-item>
            <f7-list-item link="/dynamic-route/blog/45/post/125/?foo=bar#about" title="Dynamic Route"></f7-list-item>
            <f7-list-item @click="goTo" title="Per Day"></f7-list-item>
          </f7-list>
          <f7-block-title>Side Panels</f7-block-title>
          <f7-block>
            <f7-grid>
              <f7-col width="50">
                <f7-button open-panel="left">Left Panel</f7-button>
              </f7-col>
              <f7-col width="50">
                <f7-button open-panel="right">Right Panel</f7-button>
              </f7-col>
            </f7-grid>
          </f7-block>
          <f7-block-title>Modals</f7-block-title>
          <f7-block>
            <f7-grid>
              <f7-col width="50">
                <f7-button open-popup="#popup-loading">Popup</f7-button>
              </f7-col>
              <f7-col width="50">
                <f7-button open-login-screen="#login-screen">Login Screen</f7-button>
              </f7-col>
            </f7-grid>
          </f7-block>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-views>
</template>

<script>
  import plan_trip from "../js/plantrip"
  import store from "../js/store"

  export default {
    name: 'main-view',
    data () {
      return {

      }
    },
    methods: {
      onRefresh: function (event, done) {
        done();
        window.f7.showPreloader();
        setTimeout(function () {
          window.f7.hidePreloader();
        }, 1000);
      },
      goTo(){
        plan_trip.goToPerDayLocal('TNN');
      }
    },
    created () {
    },
  }
</script>

<style scoped>

</style>
