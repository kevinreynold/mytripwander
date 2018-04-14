<template>
  <!-- Left Panel -->
  <f7-panel id="left-panel" left layout="dark" :opened='false'>
    <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
      <f7-pages>
        <f7-page>
          <f7-block-title class="profile">Hi, John Doe</f7-block-title>
          <!-- <div class="profile">
            <f7-card-content><img class="round-image" src="../assets/user.jpg" alt="John Doe" width="100px"></f7-card-content>
            <f7-card-content><span class="size-double">Hi, John Doe</span></f7-card-content>
          </div> -->
          <f7-list>
            <f7_list_item_media link="/about/" link_view="#main-view" icon="home" title="My Trip"/>
            <f7_list_item_media link="/createtrip/" link_view="#main-view" icon="map" title="Plan Trip"/>
            <f7_list_item_media link="/mybookings/" link_view="#main-view" icon="ticket" title="My Bookings"/>
            <f7_list_item_media link="/flight/" link_view="#main-view" icon="plane" title="Book Flight"/>
            <f7_list_item_media link="/hotel/" link_view="#main-view" icon="hotel" title="Book Hotel"/>
            <f7_list_item_media link="/settings/" link_view="#main-view" icon="gear" title="Settings"/>
            <!-- <f7_list_item_media link="/form/" link_view="#main-view" icon="question-circle" title="Tutorial"/> -->
            <f7_list_item_media log_out="true" icon="sign-out" title="Logout"/>
          </f7-list>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-panel>
</template>

<script>
  import f7_list_item_media from '../components/f7-list-item-media'
  import plan_trip from "../js/plantrip"
  import store from "../js/store"

  export default {
    name: 'left-panel',
    components: {
      f7_list_item_media
    }
  }
</script>

<style scoped>
  .profile{
    margin-top: -15%;
    text-align: left;
  }

  .size-double{
    font-size: 1.3em;
  }

  .round-image{
    border-radius: 100%;
    margin-bottom: -10%;
  }
</style>
