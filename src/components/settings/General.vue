<template>
  <div class="settings">
    <span class="pageTitle">General Settings</span>

    <div class="setting">
      <span class="title">Startup Page:</span>
      <DropDown :placeholder="startupPage" :items="startupPageItems" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown from "./../ui/DropDown.vue";
import { AppSettings, GeneralSettings } from "./../../ts/settings";
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
}
</script>

<style lang="scss">

</style>
