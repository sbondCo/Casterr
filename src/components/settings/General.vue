<template>
  <div class="settings">
    <span class="pageTitle">General Settings</span>

    <div class="setting">
      <span class="title">Startup Page:</span>
      <DropDown name="startupPage" :activeItem="startupPage" :items="startupPageItems" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Recording status also start/stop recording:</span>
      <TickBox name="recordingStatusAlsoStopStartRecording" :ticked="recordingStatusAlsoStopStartRecording" @item-changed="updateSettings" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown from "./../ui/DropDown.vue";
import TickBox from "./../ui/TickBox.vue";
import SettingsManager, { SettingsFiles, AppSettings, GeneralSettings } from "./../../libs/settings";
import "../../libs/helpers/extensions";

@Component({
  components: {
    DropDown,
    TickBox
  }
})
export default class GeneralSettingsComponent extends Vue {
  data() {
    return {
      startupPage: GeneralSettings.startupPage,
      startupPageItems: AppSettings.pages,
      recordingStatusAlsoStopStartRecording: GeneralSettings.recordingStatusAlsoStopStartRecording
    };
  }

  updateSettings(toUpdate: string, newValue: any) {
    // Update settings in obj
    switch (toUpdate) {
      case "startupPage":
        GeneralSettings.startupPage = newValue;
        break;
      case "recordingStatusAlsoStopStartRecording":
        GeneralSettings.recordingStatusAlsoStopStartRecording = newValue;
        break;
    }

    // Write new settings
    SettingsManager.writeSettings(SettingsFiles.General);
  }
}
</script>

<style lang="scss"></style>
