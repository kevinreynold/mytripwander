<template>
  <!-- Right Panel -->
  <f7-panel right layout="default" theme="teal" :opened='false'>
    <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
      <f7-pages>
        <f7-page>
          <f7-navbar title="Activity" sliding></f7-navbar>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-panel>
</template>

<script>
  export default {
    name: 'right-panel',
    components: {
    }
  }
</script>

<style scoped>
</style>
