<template>
  <div class="settings">
    <span class="pageTitle">General Settings</span>

    <div class="setting">
      <span class="title">Startup Page:</span>
      <DropDown placeholder="Page setting" :items="startupPageItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown from "./../ui/DropDown.vue";
import SettingsManager from "./../../ts/settings";

SettingsManager.getSettings("Recording");

@Component({
  components: {
    DropDown,
  },
})

export default class GeneralSettings extends Vue{
  data() {
    return {
      startupPageItems: ["Recordings", "Uploads", "Settings", "Profile"]
    }
  }
}
</script>

<style lang="scss">

</style>
