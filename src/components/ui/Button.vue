<template>
  <button ref="button" class="btn" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop() combinedInfo: boolean;
  @Prop() outlined: boolean;

  mounted() {
    let button = this.$refs.button as HTMLButtonElement;

    if (this.outlined) button.classList.add("outlined");
  }
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
  padding: 5px;
  border: unset;
  border-radius: 3px;
  outline: unset;
  color: $textPrimary;
  background-color: $secondaryColor;

  ::v-deep svg {
    padding: 2px;
    fill: $textPrimary;
  }

  &.outlined {
    border: 2px solid $secondaryColor;
    background-color: transparent;
  }

  &:not(:first-child) {
    margin-left: 5px;
  }

  &.volume {
    flex-flow: row;

    .volumeBar {
      width: 0;
      margin: 0;

      height: 5px;
      transition: width 150ms ease-in-out, margin 150ms ease-in-out;

      ::v-deep .noUi-handle {
        visibility: hidden;
        top: -3px;
        right: -6px;
        height: 12px;
        width: 12px;
      }
    }

    // Show volumeBar on hover.
    // Don't hide on hover so if user is a maniac when
    // changing the volume we won't ruin their experience
    &:hover,
    &:active {
      .volumeBar {
        width: 100px;
        margin: 0 7px 0 12px;

        ::v-deep .noUi-handle {
          visibility: visible;
        }
      }
    }
  }
}
</style>
