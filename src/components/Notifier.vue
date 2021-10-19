<template>
  <div ref="notifier" class="notifierContainer">
    <div class="notification">
      <Icon v-if="showCancel" class="cancel" i="close" wh="15" @click.native.once="elClicked('cancel')" />
      <span class="title">{{ desc }}</span>

      <!-- Show ProgressBar is a percentage is present, otherwise show Loader  -->
      <ProgressBar v-if="percentage != null" :percentage="percent" />

      <Loader v-if="loader != null" />

      <div class="tickboxesContainer">
        <div class="boxContainer" v-for="box in tickBoxes" :key="box">
          <TickBox :name="box" :text="box" :ticked="isChecked(box)" @item-changed="tickBoxChanged" />
        </div>
      </div>

      <div class="buttonsContainer">
        <Button v-for="button in buttons" :key="button" :text="button" @click.native.once="elClicked(button)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import Icon from "./Icon.vue";
import ProgressBar from "./ui/ProgressBar.vue";
import Loader from "./ui/Loader.vue";
import Button from "./ui/Button.vue";
import TickBox from "./ui/TickBox.vue";

@Component({
  components: {
    Icon,
    ProgressBar,
    Loader,
    Button,
    TickBox
  }
})
export default class Notifier extends Vue {
  @Prop({ default: "Give us a second" }) description!: string;
  @Prop() percentage?: number;
  @Prop() loader?: boolean;
  @Prop({ default: false }) showCancel: boolean;
  @Prop() buttons: string[];
  @Prop() tickBoxes: string[];
  @Prop() tickBoxesChecked: string[];

  desc: string = this.$props.description;
  percent: number = this.$props.percentage;
  checkedTickBoxes: string[] = this.$props.tickBoxesChecked;

  elClicked(elClicked: string) {
    const chkdTickBoxes: string[] | null = this.tickBoxes?.length > 0 ? this.checkedTickBoxes : null;

    this.$emit("element-clicked", elClicked, chkdTickBoxes);
  }

  isChecked(name: string) {
    if (this.checkedTickBoxes) {
      return this.checkedTickBoxes.includes(name);
    }

    return false;
  }

  tickBoxChanged(toUpdate: string, ticked: boolean) {
    // Add to checkedTickBoxes
    if (!this.checkedTickBoxes.includes(toUpdate) && ticked) {
      this.checkedTickBoxes.push(toUpdate);
      return;
    }

    // Remove from checkedTickBoxes
    if (!ticked) {
      this.checkedTickBoxes = this.checkedTickBoxes.remove(toUpdate);
      return;
    }
  }
}
</script>

<style lang="scss">
.notifierContainer {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-color: change-color($color: $quaternaryColor, $alpha: 0.5);
  z-index: 9999999999999;

  .notification {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 18px 20px;
    min-width: 500px;
    min-height: 150px;
    flex-flow: column;
    border-radius: 7px;
    background-color: change-color($color: $darkAccentColor, $alpha: 0.99);
    box-shadow: 0 3px 2px rgba(0, 0, 0, 0.5);

    .title {
      font-size: 25px;
      padding: 5px;
      margin-bottom: 20px;
      text-transform: capitalize;
    }

    .cancel {
      position: absolute;
      top: 10px;
      right: 10px;
      fill: $textPrimary;
      transition: fill 100ms ease-in-out, transform 100ms ease-in;
      cursor: pointer;

      &:hover {
        fill: $textPrimaryHover;
        transform: scale(1.15);
      }
    }

    .tickboxesContainer {
      display: flex;
      flex-flow: column;
      justify-content: left;
      align-items: flex-start;
      margin-bottom: 20px;

      .boxContainer {
        margin-bottom: 5px;
        text-transform: capitalize;
      }
    }

    .buttonsContainer {
      display: flex;
      flex-flow: row;
      justify-content: center;
      align-items: center;

      * {
        text-transform: capitalize;

        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
