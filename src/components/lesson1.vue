<template>
  <div class="test">
    <input type="text" v-on:keyup="pressKey" v-on:keyup.enter="enterHit" v-model="title"><br>
    <h1>{{title}}</h1>

    <!-- IF -->
    <p v-if="showName">{{user.firstName}}</p>
    <p v-else>Nobody</p>
    <h1>{{fullName}}</h1>
    <h1>{{msg}}</h1>

    <!-- FOR -->
    <ul>
      <li v-for="item in items" :key="item.title">{{item.title}}</li>
    </ul>

    <!-- EVENT -->
    <button v-on:click="greet('Hello World')">Say Greeting</button>
  </div>
</template>

<script>

export default {
  name: 'lesson1',
  props: {
    msg: {
      type: String,
      default: 'Foobar'
    }
  },
  data(){
    return{
      title: "Hello World",
      user: {
        firstName: 'Reynold',
        lastName: 'Kevin'
      },
      showName: false,
      items: [
        {title: 'Item One'},
        {title: 'Item Two'},
        {title: 'Item Three'}
      ]
    }
  },
  created() {

  },
  methods: {
    greet(greeting) {
      alert(greeting);
    },
    pressKey(e) {
      console.log(e.target.value);
    },
    enterHit() {
      console.log('ENTER!!!');
    },
  },
  computed: {
    fullName(){
      return this.user.firstName + ' ' + this.user.lastName;
    }
  }
}
</script>

<style scoped>
  .test{
    text-align: center;
  }
</style>
