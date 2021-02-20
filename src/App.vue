<template>
  <div id="app">
    <AppLayout>
      <router-view />
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

<style lang="scss">
* {
  font-family: 'Roboto Condensed', sans-serif;
}
</style>
