<template>
  <div ref="menuItem" @click="clicked">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ContextMenu extends Vue {
  clicked(ev: MouseEvent) {
    this.$emit("click", ev);

    // Get parent element of `menuItem`, which is the contextMenu, and call .blur() to hide it.
    (this.$refs.menuItem as HTMLElement).parentElement!.blur();
  }
}
</script>

<style lang="scss" scoped>
div {
  padding: 8px;
  border-radius: 3px;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 50ms ease-in;

  &:hover {
    background-color: $secondaryColor;
  }
}
</style>
