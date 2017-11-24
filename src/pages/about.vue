<template>
  <f7-page>
    <f7-navbar title="About" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <p>Here is About page!</p>
      <p>You can go <f7-link back>back</f7-link>.</p>
    </f7-block>
    <!-- <f7-block-title v-for="user in users" :key="user.key">{{user.name}}</f7-block-title> -->
  </f7-page>
</template>

<script>

export default {
  components: {
  },
  data: () => ({
    users : []
  }),
  created() {
    //do something after creating vue instance
    // this.$http.get('https://jsonplaceholder.typicode.com/users')
    //   .then(function(response){
    //     console.log(response); //header
    //     console.log(response.data); //isi
    //     this.users = response.data;
    //     for (var i = 0; i < this.users.length; i++) {
    //       if (i%2==0)
    //         this.users[i].contacted = true;
    //       else
    //         this.users[i].contacted = false;
    //     }
    //   });
  }
}
</script>
