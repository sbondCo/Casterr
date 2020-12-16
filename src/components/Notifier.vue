<template>
  <div ref="notifier" class="notifierContainer">
    <div class="notification">
      <span class="title">{{ desc }}</span>

      <ProgressBar :percentage="percent" />
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import Icon from "./Icon.vue";
import ProgressBar from "./ui/ProgressBar.vue";

@Component({
  components: {
    Icon,
    ProgressBar,
  },
})
export default class Notifier extends Vue {
  @Prop(String) description: string;
  @Prop(Number) percentage: number;

  data() {
    return {
      desc: this.description,
      percent: this.percentage
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
  background-color: change-color($color: $quaternaryColor, $alpha: .5);
  z-index: 9999999999999;

  .notification {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    min-width: 500px;
    min-height: 150px;
    flex-flow: column;
    border-radius: 7px;
    background-color: change-color($color: $darkAccentColor, $alpha: .99);
    box-shadow: 0 3px 2px rgba(0, 0, 0, .5);

    .title {
      font-size: 25px;
      padding: 5px;
      margin-bottom: 20px;
      text-transform: capitalize;
    }
  }
}
</style>
