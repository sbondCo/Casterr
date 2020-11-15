<template>
  <label class="checkBoxContainer">
    <input type="checkbox" v-model="isTicked" />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

const TickBoxProps = Vue.extend({
  props: {
    name: String,
    ticked: Boolean
  }
});

@Component

export default class TickBox extends TickBoxProps {
  data() {
    return {
      isTicked: this.ticked
    }
  }

  @Watch('isTicked')
  isTickedChanged(t: boolean) {
    this.$emit('item-changed', this.name, t);
  }
}
</script>

<style lang="scss" scoped>
.checkBoxContainer {
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;

  input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkmark:after {
      display: block;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: $secondaryColor;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid $textPrimary;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  &:hover input ~ .checkmark {
    background-color: $tertiaryColor;
  }
}
</style>
