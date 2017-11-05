<template>
  <f7-list-item :link="link" :link-view="link_view" link-close-panel>
    <div class="list-menu-panel">
      <div><f7-icon :fa="icon" size="150%"></f7-icon></div>
      <div>{{title}}</div>
    </div>
  </f7-list-item>
</template>

<script>
export default {
  name: "f7-list-item-media",
  props:{
    link: { type: String },
    link_view: { type: String },
    icon: { type: String },
    title: { type: String },
  },
}
</script>

<style scoped>
  .list-menu-panel div{
    float: left;
  }

  .list-menu-panel div:nth-child(1){
    width: 50px;
  }
</style>
