<template>
  <div id="app">
    <!-- <section id="notify">
      <Notifier />
    </section> -->

    <section id="top">
      <Dragger />
      <Nav />
    </section>

    <section id="main">
      <router-view />
    </section>
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
