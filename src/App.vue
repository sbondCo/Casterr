<template>
  <div id="app">
    <section id="notifications">
    </section>

    <section id="top">
      <!-- <Dragger /> -->
      <Nav />
    </section>

    <section id="main">
      <router-view />
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
// import Dragger from "./components/Dragger.vue";
import Nav from "./components/Nav.vue";

@Component({
  components: {
    // Dragger,
    Nav,
  }
})

export default class App extends Vue {}
</script>
