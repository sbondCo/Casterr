<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ContextMenu extends Vue {}
</script>

<style lang="scss" scoped>
div {
  padding: 8px;
  border-radius: 3px;

  &:hover {
    background-color: $secondaryColor;
  }
}
</style>
