<template>
  <div class="btnWrapper">
    <button v-if="combinedInfo" id="outlined" class="infoBtn">
      <slot></slot>
    </button>

    <button ref="mainBtn" class="mainBtn">
      <div @[clickEvent]="$emit('click')">
        <Icon v-if="icon" :i="icon" />

        <span v-if="text">{{ text }}</span>
      </div>

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
  @Prop({ default: 0 }) sliderValue: number;

  mainBtn: HTMLButtonElement;
  sliderBar: noUiSlider.Instance;
  clickEvent = "click";

  mounted() {
    this.mainBtn = this.$refs.mainBtn as HTMLButtonElement;

    if (this.outlined) this.mainBtn.id += "outlined";
    if (this.slider) this.createSlider();
  }

  updated() {
    // Update sliderBar value, if slider is enabled and it is updated
    if (this.slider && this.sliderBar) {
      this.sliderBar.noUiSlider.set(this.sliderValue);
    }

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

  createSlider() {
    this.addClassToButton("slider");

    this.sliderBar = this.$refs.sliderBar as noUiSlider.Instance;

    noUiSlider.create(this.sliderBar, {
      start: [this.sliderValue],
      behaviour: "snap",
      range: {
        min: 0,
        max: 1
      }
    });

    this.sliderBar.noUiSlider.on("update", (value) => {
      this.$emit("slider-update", Number(value[0]));
    });

    this.mainBtn.addEventListener(
      "wheel",
      (e) => {
        let noSlider = this.sliderBar.noUiSlider;
        let sliderVal = Number(noSlider.get());

        if (e.deltaY < 0) {
          noSlider.set(sliderVal + 0.1);
        } else {
          noSlider.set(sliderVal - 0.1);
        }
      },
      { passive: true }
    );
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

    &.disabled {
      cursor: not-allowed;
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
