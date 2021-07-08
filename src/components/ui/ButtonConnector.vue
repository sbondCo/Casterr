<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ButtonConnector extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: row;
  height: 100%;

  .btnWrapper {
    $border: 2px solid $secondaryColor;

    margin-left: 0;

    &:first-child:not(:only-child) ::v-deep .mainBtn {
      border-left: $border;
      border-right: $border;
    }

    &:first-child ::v-deep .mainBtn {
      border-left: unset;
      border-radius: 3px 0 0 3px;
    }

    & * ::v-deep .mainBtn {
      border-right: unset;
    }

    &:last-child ::v-deep .mainBtn {
      border-right: $border;
      border-radius: 0 3px 3px 0;
    }

    &:not(:first-child) ::v-deep #outlined {
      border-left: unset;
      padding: 5px;
    }

    ::v-deep .mainBtn {
      border-top: $border;
      border-bottom: $border;
      border-left: unset;
      border-radius: unset;
    }
  }
}
</style>
