<template>
  <div class="dragger">
    <div class="minMaxClose">
      <div class="close" @click="close">
        <Icon i="close" :wh="12" />
      </div>
      <div class="max" @click="maximize">
        <Icon i="max" :wh="12" />
      </div>
      <div class="min" @click="minimize">
        <Icon i="min" :wh="12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron';
import { Vue, Component } from 'vue-property-decorator';
import Icon from "./Icon.vue";

var window = remote.getCurrentWindow();

@Component({
  components: {
    Icon,
  },
})

export default class Dragger extends Vue {
  public close() {
    window.close();
  }

  public maximize() {
    window.maximize();
  }

  public minimize() {
    window.minimize();
  }
}
</script>
