<template>
  <div id="app">
    <section ref="notifier" id="notify">
      <Notifier />
    </section>

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
import Dragger from "./components/Dragger.vue";
import Nav from "./components/Nav.vue";
import Notifier from "./components/Notifier.vue";

@Component({
  components: {
    Dragger,
    Nav,
    Notifier,
  }
})

export default class App extends Vue {}
</script>
