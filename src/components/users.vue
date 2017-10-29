<template>
  <div id="users">
    <div>
      <h1>Users</h1>
      <form v-on:submit="addUser">
        <input type="text" v-model="newUser.name" placeholder="name"><br>
        <input type="text" v-model="newUser.email" placeholder="email"><br>
        <input type="submit" value="submit">
      </form>
    </div>
    <div>
      <ul>
        <li v-for="user in users" :key="user.email">
          <input type="checkbox" class="toggle" v-model="user.contacted">
          <span :class="{ contacted: user.contacted }">
            {{user.name}} : {{user.email}}
          </span>
          <button v-on:click="deleteUser(user)">X</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "users",
  data(){
    return{
      newUser: {},
      users : [
        {
          name: 'John Doe',
          email: 'jdoe@gmail.com',
          contacted: false
        },
        {
          name: 'Reynold Kevin',
          email: 'rk@gmail.com',
          contacted: false
        },
        {
          name: 'Tom White',
          email: 'twhite@gmail.com',
          contacted: false
        }
      ]
    }
  },
  methods: {
    addUser(e) {
      this.users.push({
        name: this.newUser.name,
        email: this.newUser.email,
        contacted: false
      })
      this.newUser = {};
      e.preventDefault();
    },
    deleteUser(user) {
        this.users.splice(this.users.indexOf(user), 1);
    }
  },
  created(){
      this.$http.get('https://jsonplaceholder.typicode.com/users')
        .then(function(response){
          console.log(response); //header
          console.log(response.data); //isi
          this.users = response.data;
          for (var i = 0; i < this.users.length; i++) {
            if (i%2==0)
              this.users[i].contacted = true;
            else
              this.users[i].contacted = false;
          }
        });
  }
}
</script>
<style scoped>
  #users{
    text-align: center;
  }

  .contacted{
    text-decoration: line-through;
  }
</style>
