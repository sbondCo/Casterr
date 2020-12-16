<template>
  <div class="textBox">
    <input :type="type" v-model="textBoxValue" :placeholder="placeholder" spellcheck="false" @blur="textBoxValueUpdated" />

    <button v-if="folderSelect" @click="selectFolder">Change</button>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { remote } from "electron";
import * as fs from "fs";

@Component
export default class TextBox extends Vue {
  @Prop({required: true}) name: string;
  @Prop() value?: string;
  @Prop() placeholder?: string;
  @Prop({default: "text"}) type: string;
  @Prop({default: false}) folderSelect: boolean;

  data() {
    return {
      textBoxValue: this.value
    }
  }

  textBoxValueUpdated() {
    this.$emit('item-changed', this.name, this.$data.textBoxValue);
  }

  selectFolder() {
    let defaultFolder = this.$data.textBoxValue;

    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      title: `Select save folder`,

      // If path in textBox exists and is a directory, set it as defaultPath in dialog
      defaultPath: (fs.existsSync(defaultFolder) && fs.lstatSync(defaultFolder).isDirectory()) ? defaultFolder : undefined,

      buttonLabel: "Select",
      properties: ['openDirectory']
    }).then((f) => {
      let folder = f.filePaths[0];

      // If a folder was selected, set textBox value to it
      if (folder != null) {
        this.$set(this.$data, 'textBoxValue', folder);
        this.textBoxValueUpdated();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.textBox {
  position: relative;

  input {
    min-width: 160px;
    width: 100%;
    padding: 8px;
    color: $textPrimary;
    background-color: $secondaryColor;
    font-size: 16px;
    outline: none;
    border: none;
    border-radius: 4px;
    transition: background-color 250ms ease;

    &[type=number]::-webkit-inner-spin-button,
    &[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    &:hover {
      background-color: $tertiaryColor;

      & + button {
        display: none;
      }
    }
  }

  button {
    position: absolute;
    right: 0px;
    height: 100%;
    border-radius: 0 4px 4px 0;
    border: none;
    outline: none;
    padding: 5px 7px;
    font-size: 16px;
    cursor: pointer;
    background-color: $darkAccentColor;
    color: $textPrimary;
    transition: background 250ms ease;

    &:hover {
      background-color: #333440;
    }
  }
}
</style>
