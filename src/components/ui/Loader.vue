<template>
  <div class="spinner">
		<div class="item"></div>
		<div class="item"></div>
		<div class="item"></div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Loading extends Vue {}
</script>

<style lang="scss" scoped>
.spinner {
  $wh: 18px;
  $animationDuration: 1150ms;

  display: flex;
  align-items: center;

  /* 
   * Make min-height of container big enough so the
   * cubes (becos animation) don't go outside the .spinner div.
   */
  min-height: calc(#{$wh} * 2.6);

  .item {
    width: $wh;
    height: $wh;
    margin: 0 3px;
    border-radius: 25%;
    border: 2px solid $textPrimary;
    animation: throwBalls $animationDuration ease-in-out infinite;
    
    &:nth-child(1) {
      animation-delay: calc(#{$animationDuration} / 6 * -1);
    }

    &:nth-child(2) {
      animation-delay: calc(#{$animationDuration} / 6 * -2);
    }

    &:nth-child(3) {
      animation-delay: calc(#{$animationDuration} / 6 * -3);
    }

    @keyframes throwBalls {
      0%,
      100% {
        transform: translateY(75%);
      }

      50% {
        transform: translateY(-75%);
      }
    }
  }
}
</style>
