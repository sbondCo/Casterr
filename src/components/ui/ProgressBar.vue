<template>
  <div class="progressBar">
    <div class="inner" :style="'width:' + percentage + '%'"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ProgressBar extends Vue {
  @Prop(Number) percentage!: number;
}
</script>

<style lang="scss" scoped>
.progressBar {
  width: 90%;
  height: 20px;
  background-color: $darkAccentColor;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgb(0, 0, 0, .7) inset;

  .inner {
    height: 100%;
    border-radius: 4px;
    background-color: $tertiaryColor;
    background:
      -webkit-linear-gradient(-45deg, transparent 33%, $darkAccentColor 33%, $darkAccentColor 66%, transparent 66%),
      -webkit-linear-gradient($tertiaryColor, $tertiaryColor);
    background-size: 40px 20px, 100% 100%, 100% 100%;
    transition: width 150ms ease-in-out;
    animation: progressConveyor 50s linear infinite;

    @keyframes progressConveyor {
      100% {
        background-position: 2000px 0;
      }
    }
  }
}
</style>
