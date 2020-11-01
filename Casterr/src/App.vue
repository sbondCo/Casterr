<template>
  <div id="app">
    <Dragger />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dragger from './components/Dragger.vue';

@Component({
  components: {
    Dragger,
  },
})

export default class App extends Vue {}
</script>
