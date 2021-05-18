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
  border: 2px solid $secondaryColor;
  border-radius: 3px;

  .btnWrapper {
    margin-left: 0;

    &:first-child:not(:only-child) ::v-deep .mainBtn {
      border-right: 2px solid $secondaryColor;
    }

    &:first-child ::v-deep .mainBtn {
      border-left: unset;
      border-radius: 3px 0 0 3px;
    }

    &:last-child ::v-deep .mainBtn {
      border-radius: 0 3px 3px 0;
    }

    ::v-deep #outlined {
      padding: 5px;
      border: unset;
    }

    ::v-deep .mainBtn {
      border: unset;
      border-left: 2px solid $secondaryColor;
      border-radius: unset;
    }
  }
}
</style>
