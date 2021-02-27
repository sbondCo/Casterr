<template>
  <div>
    <button v-if="combinedInfo" class="infoBtn outlined">
      <slot></slot>
    </button>

    <button ref="mainBtn" class="mainBtn" @[mainBtnClickEvent]="$emit('click')">
      <Icon v-if="icon" :i="icon" />

      <span v-if="text">{{ text }}</span>

      <div v-if="slider" ref="sliderBar" class="sliderBar"></div>
    </button>
  </div>
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

  @Prop({ default: false }) disabled: boolean;
  @Prop() combinedInfo: boolean;
  @Prop() outlined: boolean;
  @Prop({ default: false }) slider: boolean;

  mainBtn: HTMLButtonElement;
  mainBtnClickEvent = "click";

  mounted() {
    this.mainBtn = this.$refs.mainBtn as HTMLButtonElement;

    if (this.outlined) this.addClassToButton("outlined");
    if (this.slider) this.createSlider();
  }

  updated() {
    if (this.disabled) {
      console.log("disabled");
      this.mainBtnClickEvent = "null";
    } else {
      console.log("enabled");
      this.mainBtnClickEvent = "click";
    }
  }

  addClassToButton(classToAdd: string) {
    this.mainBtn.classList.add(classToAdd);
  }

  createSlider() {
    this.addClassToButton("slider");

    let slider = this.$refs.sliderBar as noUiSlider.Instance;

    noUiSlider.create(slider, {
      start: [0.8],
      behaviour: "snap",
      range: {
        min: 0,
        max: 1
      }
    });

    slider.noUiSlider.on("update", (value) => {
      this.$emit("update", Number(value[0]));
    });

    this.mainBtn.addEventListener("wheel", (e) => {
      let noSlider = slider.noUiSlider;
      let sliderVal = Number(noSlider.get());

      if (e.deltaY < 0) {
        noSlider.set(sliderVal + 0.1);
      } else {
        noSlider.set(sliderVal - 0.1);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;

  // Add margin between buttons
  &:not(:first-child) {
    margin-left: 5px;
  }

  .outlined {
    border: 2px solid $secondaryColor !important;
    background-color: transparent !important;
  }

  ::v-deep svg {
    padding: 2px;
    fill: $textPrimary;
  }

  .infoBtn {
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 100%;
    padding: 4px;
    color: $textPrimary;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    ::v-deep div {
      display: flex;
      align-items: center;

      &:not(:first-child) {
        margin-left: 5px;
      }

      svg {
        margin-right: 3px;
      }
    }

    // Remove left border radius from mainBtn so both connect properly
    + .mainBtn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .mainBtn {
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
    cursor: pointer;

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

        // Set transition for slider handle to 0ms.
        // For some reason 'snap' behaviour doesn't
        // work when moving handle by using mouse wheel.
        ::v-deep .noUi-origin {
          transition: transform 0ms ease-in;
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
}
</style>
