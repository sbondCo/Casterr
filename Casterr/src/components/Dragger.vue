<template>
  <div class="dragger">
    <div class="minMaxClose">
      <div class="close">
        <Icon i="close" :wh="12" />
      </div>
      <div class="max">
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

@Component({
  components: {
    Icon,
  },
})

export default class Dragger extends Vue {
  public minimize() {
    remote.getCurrentWindow().minimize();
  }
}
</script>
