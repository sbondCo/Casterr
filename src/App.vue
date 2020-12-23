<template>
  <div id="app">
    <AppLayout>
      <section id="main">
        <router-view />
      </section>
    </AppLayout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import AppLayout from "./layouts/AppLayout.vue";

@Component({
  components: {
    AppLayout
  }
})

export default class App extends Vue {}
</script>
