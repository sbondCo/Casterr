<template>
  <div ref="contextMenu" class="contextMenu hidden" tabindex="-1">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import "@/libs/helpers/extensions";

@Component
export default class ContextMenu extends Vue {
  // ID of element to mount context menu to
  @Prop({ required: true }) mountID: string;

  private menu: HTMLElement;

  mounted() {
    this.menu = this.$refs.contextMenu as HTMLElement;
    let toMountTo = document.getElementById(this.mountID) as HTMLElement;

    toMountTo.addEventListener("contextmenu", (ev) => {
      this.menu.classList.remove("hidden");

      this.menu.focus();
      this.menu.style.top = `${ev.clientY.toInWindowBounds("y", this.menu)}px`;
      this.menu.style.left = `${ev.clientX.toInWindowBounds("x", this.menu)}px`;
    });

    this.menu.addEventListener("blur", () => {
      this.menu.classList.add("hidden");
    });
  }
}
</script>

<style lang="scss">
.contextMenu {
  position: fixed;
  padding: 8px;
  background-color: $darkAccentColor;
  border-radius: 4px;
  outline: unset;
  z-index: 101;
}
</style>
