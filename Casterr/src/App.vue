<template>
  <div id="app">
    <Dragger />
    <Nav />

    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import Router from "./router";
import Dragger from "./components/Dragger.vue";
import Nav from "./components/Nav.vue";

// Redirect to startup page defined in settings
// Router.push("recordings");

@Component({
  components: {
    Dragger,
    Nav,
  }
})

export default class App extends Vue {}
</script>
