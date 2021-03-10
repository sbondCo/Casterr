<template>
  <div class="dragger">
    <div class="minMaxClose">
      <div class="close" @click="manageWindow('close')">
        <Icon i="close" :wh="12" />
      </div>
      <div class="max" @click="manageWindow('maximize')">
        <Icon i="max" :wh="12" />
      </div>
      <div class="min" @click="manageWindow('minimize')">
        <Icon i="min" :wh="12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Icon from "./Icon.vue";
import { ipcRenderer } from "electron";

@Component({
  components: {
    Icon
  }
})
export default class Dragger extends Vue {
  public manageWindow(msg: string) {
    ipcRenderer.send("manage-window", msg);
  }
}
</script>

<style lang="scss">
.dragger {
  height: 18px;
  overflow: hidden;
  -webkit-app-region: drag;
  background-color: $darkAccentColor;

  .minMaxClose {
    display: flex;
    flex-direction: row-reverse;
    fill: $textPrimary;

    div {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-app-region: no-drag;
      width: 30px;
      height: 18px;
      cursor: pointer;

      &:hover {
        background-color: $lightHoverColor;
      }
    }

    .close:hover {
      background-color: $dangerColor;
    }
  }
}
</style>
