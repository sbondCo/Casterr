<template>
  <label class="checkBoxContainer">
    <input type="checkbox" v-model="isTicked" />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TickBox extends Vue {
  @Prop({ required: true }) name: string;
  @Prop({ default: false }) ticked: boolean;

  isTicked = this.$props.ticked;

  @Watch("isTicked")
  isTickedChanged(t: boolean) {
    this.$emit("item-changed", this.name, t);
  }
}
</script>

<style lang="scss" scoped>
.checkBoxContainer {
  position: relative;
  padding-left: 35px;
  font-size: 22px;
  cursor: pointer;

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
    border: 2px dashed $quaternaryColor;
    transition: border-color 250ms ease-in-out;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 7px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid $textPrimary;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  &:hover input ~ .checkmark {
    background-color: $tertiaryColor;
    border-color: $textPrimary;
  }
}
</style>
