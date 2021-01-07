<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class AppLayout extends Vue {
  get layout() {
    // Import defined layout in meta tag or 'DefaultLayout' if that isn't set.
    return () => import(`./${this.$route.meta.layout || "DefaultLayout"}.vue`)
  }
}
</script>
