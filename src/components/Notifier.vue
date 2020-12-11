<template>
  <div ref="notifier" class="notifierContainer hidden">
    <div class="notification">
      <span class="title">{{ description }}</span>

      <!-- <ProgressBar Percentage=@percentage /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Icon from "./Icon.vue";

@Component({
  components: {
    Icon,
  },
})
export default class Notifier extends Vue {
  data() {
    return {
      description: "",
      percentage: 0
    }
  }

  public notify(working: boolean, desc: string, percent: number) {
    let notifier = this.$refs.notifier as HTMLElement;

    if (working) {
      notifier.classList.remove("hidden");
      console.log(desc, percent)
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
    background-color: change-color($color: $darkAccentColor, $alpha: .85);
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
