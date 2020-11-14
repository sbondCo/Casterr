<template>
  <div class="settings">
    <span class="pageTitle">General Settings</span>

    <div class="setting">
      <span class="title">Startup Page:</span>
      <DropDown name="startupPage" :placeholder="startupPage" :items="startupPageItems" @item-changed="updateSettings" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown from "./../ui/DropDown.vue";
import SettingsManager, { SettingsFiles, AppSettings, GeneralSettings } from "./../../ts/settings";
import "../../ts/helpers/extensions/ArrayExtensions";

@Component({
  components: {
    DropDown,
  },
})

export default class GeneralSettingsComponent extends Vue {
  data() {
    return {
      startupPage: GeneralSettings.startupPage,
      startupPageItems: AppSettings.pages
    }
  }

  updateSettings(toUpdate: string, newValue: string) {
    // Update settings in obj
    switch (toUpdate) {
      case "startupPage":
        GeneralSettings.startupPage = newValue
        break;
    }

    // Write new settings
    SettingsManager.writeSettings(SettingsFiles.General);
  }
}
</script>

<style lang="scss">

</style>
