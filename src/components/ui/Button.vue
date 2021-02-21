<template>
  <button ref="button" class="btn" @click="$emit('click')">
    <Icon v-if="icon" :i="icon" />

    <span v-if="text">{{ text }}</span>

    <div v-if="slider" ref="sliderBar" class="sliderBar"></div>
  </button>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import noUiSlider from "nouislider";
import Icon from "./../Icon.vue";

@Component({
  components: {
    Icon
  }
})
export default class Button extends Vue {
  @Prop() icon: string;
  @Prop() text: string;

  @Prop() combinedInfo: boolean;
  @Prop() outlined: boolean;
  @Prop({ default: false }) slider: boolean;

  mounted() {
    if (this.outlined) this.addClassToButton("outlined");
    if (this.slider) this.createSlider();
  }

  addClassToButton(classToAdd: string) {
    let button = this.$refs.button as HTMLButtonElement;

    button.classList.add(classToAdd);
  }

  createSlider() {
    this.addClassToButton("slider");

    let slider = this.$refs.sliderBar as noUiSlider.Instance;

    noUiSlider.create(slider, {
      start: [0.8],
      range: {
        min: 0,
        max: 1
      }
    });

    slider.noUiSlider.on("update", (value) => {
      this.$emit("update", Number(value[0]));
    });
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

  &.slider {
    flex-flow: row;

    .sliderBar {
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

    // Show sliderBar on hover.
    // Don't hide if active so if user is a maniac
    // when sliding we won't ruin their experience
    &:hover,
    &:active {
      .sliderBar {
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
