<template>
  <div id="app">
    <Dragger />

    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Router from "./router";
import Dragger from "./components/Dragger.vue";

// Redirect to startup page defined in settings
Router.push("recordings");

@Component({
  components: {
    Dragger,
  },
})

export default class App extends Vue {}
</script>
