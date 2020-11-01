<template>
  <div v-html="Icon"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const IconProps = Vue.extend({
  props: {
    i: String,
    wh: Number
  }
});

@Component

export default class Icon extends IconProps {
  /**
   * Return html string for Icon
   * requested with correct width and height
   */
  get Icon(): string {
    switch (this.i) {
      case "min":
        return `
          <svg width="${this.wh}" height="${this.wh}" viewBox="0 0 12 12">
            <rect width="10" height="1" x="1" y="6"></rect>
          </svg>
        `
      default:
        return `
          oops
        `
    }
  }
}
</script>
