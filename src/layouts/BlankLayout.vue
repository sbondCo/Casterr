<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";

export default class BlankLayout extends Vue {}
</script>
