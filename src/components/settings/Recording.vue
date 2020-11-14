<template>
    <div class="settings">
    <span class="pageTitle">Recording Settings</span>

    <div class="setting">
      <span class="title">Video Device:</span>
      <DropDown name="videoDevice" :placeholder="videoDevice" :items="videoDevices" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">FPS:</span>
      <TextBox name="fps" :placeholder="d" type="number" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Resolution:</span>
      <DropDown name="resolution" :placeholder="resolution" :items="resolutions" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Format:</span>
      <DropDown name="format" :placeholder="format" :items="formats" @item-changed="updateSettings" />
    </div>

    <div v-if="this.isWindows" class="setting">
      <span class="title">Zero Latency:</span>
      <!-- <TickBox name="zeroLatency" :checked="zeroLatency" @item-changed="updateSettings" /> -->
    </div>

    <div v-if="this.isWindows" class="setting">
      <span class="title">Ultra Fast:</span>
      <!-- <TickBox name="ultraFast" :checked="ultraFast" @item-changed="updateSettings" /> -->
    </div>

    <div class="setting">
      <span class="title">Audio Devices To Record:</span>
      <!-- <ListBox name="audioDevicesToRecord"  @item-changed="updateSettings" /> -->
    </div>

    <div class="setting">
      <span class="title">Seperate Audio Tracks:</span>
      <!-- <TickBox name="seperateAudioTracks"  @item-changed="updateSettings" /> -->
    </div>

    <div class="setting">
      <span class="title">Thumbnail Save Folder:</span>
      <!-- <TextBox name="thumbSaveFolder"  @item-changed="updateSettings" /> -->
    </div>

    <div class="setting">
      <span class="title">Video Save Folder:</span>
      <!-- <TextBox name="videoSaveFolder"  @item-changed="updateSettings" /> -->
    </div>

    <div class="setting">
      <span class="title">Video Save Name:</span>
      <!-- <TextBox name="videoSaveName"  @item-changed="updateSettings" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown from "./../ui/DropDown.vue";
import { RecordingSettings } from "./../../ts/settings";
import "../../ts/helpers/extensions/ArrayExtensions";

@Component({
  components: {
    DropDown,
  },
})

export default class RecordingSettingsComponent extends Vue {
  data() {
    return {
      isWindows: (require("os").platform == 'win32'),
      videoDevice: "Some Mic",
      videoDevices: ["Some Mic", "A TV?", "Is this a headset?", "G40${randNum}"],
      resolution: RecordingSettings.resolution,
      resolutions: ["In-Game", "2160p", "1440p", "1080p", "720p", "480p", "360p"],
      format: RecordingSettings.format,
      formats: ["mp4", "mkv"]
    }
  }

  updateSettings(toUpdate: string, newValue: string) {
    console.log(toUpdate + ' ' + newValue);
  }
}
</script>

<style lang="scss">

</style>
