<template>
  <div class="btnWrapper">
    <button v-if="combinedInfo" id="outlined" class="infoBtn">
      <slot></slot>
    </button>

    <button ref="mainBtn" class="mainBtn">
      <div class="content" @[clickEvent]="$emit('click')">
        <Icon v-if="icon" :i="icon" />

        <span v-if="text">{{ text }}</span>
      </div>

      <input
        v-if="slider"
        ref="sliderBar"
        class="sliderBar"
        type="range"
        :value="sliderValue"
        :min="sliderMin"
        :max="sliderMax"
        :step="sliderStep"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
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
  @Prop({ default: 0 }) sliderValue: string;
  @Prop({ default: 0 }) sliderMin: number;
  @Prop({ default: 100 }) sliderMax: number;
  @Prop({ default: 1 }) sliderStep: number;

  mainBtn: HTMLButtonElement;
  sliderBar: HTMLInputElement;
  clickEvent = "click";

  mounted() {
    this.mainBtn = this.$refs.mainBtn as HTMLButtonElement;
    this.sliderBar = this.$refs.sliderBar as HTMLInputElement;

    if (this.outlined) this.mainBtn.id += "outlined";
    if (this.slider) this.initSlider();

    this.handleDisability();
    this.updateSliderValue();
  }

  updated() {
    this.handleDisability();

    // Update sliderBar value, if slider is enabled and it is updated
    this.updateSliderValue();
  }

  /**
   * Manage whether button should be disabled or not.
   */
  handleDisability() {
    // Enable/disable button click event
    if (this.disabled) {
      this.clickEvent = "null";
      this.mainBtn.classList.add("disabled");
    } else {
      this.clickEvent = "click";
      this.mainBtn.classList.remove("disabled");
    }
  }

  addClassToButton(classToAdd: string) {
    this.mainBtn.classList.add(classToAdd);
  }

  initSlider() {
    this.addClassToButton("slider");

    this.sliderBar.addEventListener("input", (value) => {
      this.$emit("slider-update", Number((value.target as HTMLInputElement).value));
    });

    this.mainBtn.addEventListener(
      "wheel",
      (e) => {
        let slider = this.sliderBar;
        let sliderVal = Number(slider.value);

        // Change slider value up/down depending on if wheel was scrolled up/down
        if (e.deltaY < 0) {
          slider.value = String(sliderVal + 0.1);
        } else {
          slider.value = String(sliderVal - 0.1);
        }

        // Manually fire input event, because it doesn't do this itself
        slider.dispatchEvent(new Event("input"));
      },
      { passive: true }
    );
  }

  updateSliderValue() {
    if (this.slider && this.sliderBar) {
      this.sliderBar.value = String(this.sliderValue);
    }
  }
}
</script>

<style lang="scss" scoped>
.btnWrapper {
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;

  // Add margin between buttons
  &:not(:first-child) {
    margin-left: 5px;
  }

  #outlined {
    padding: 5px;
    border: 2px solid $secondaryColor;
    background-color: transparent;
  }

  svg {
    padding: 2px;
    fill: $textPrimary;
  }

  &:hover {
    .infoBtn {
      + .mainBtn {
        border-left: 2px solid transparent;
      }
    }

    .mainBtn {
      background-color: transparent;

      // Only change outlined on hover if on mainBtn
      &#outlined {
        background-color: $secondaryColor;
      }
    }
  }

  .infoBtn {
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 100%;
    padding: 4px;
    outline: unset;
    color: $textPrimary;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    cursor: pointer;

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
    padding: 3px;
    border: unset;
    border: 2px solid $secondaryColor;
    border-radius: 3px;
    outline: unset;
    color: $textPrimary;
    background-color: $secondaryColor;
    transition: background-color 150ms ease, border 150ms ease;
    cursor: pointer;

    .content {
      display: flex;
      flex-flow: row;
      align-items: center;

      *:not(:last-child) {
        margin-right: 3px;
      }
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.slider {
      flex-flow: row;

      .sliderBar {
        -webkit-appearance: none;
        width: 0;
        margin: 0;
        height: 5px;
        transition: width 150ms ease-in-out, margin 150ms ease-in-out;
        background: transparent;

        &::-webkit-slider-thumb {
          visibility: hidden;
        }
      }

      // Show sliderBar on hover.
      // Don't hide if active so if user is a maniac
      // when sliding we won't ruin their experience
      &:hover,
      &:active {
        .sliderBar {
          width: 100px;
          margin: 0 7px 0 7.5px;

          &::-webkit-slider-thumb {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>
