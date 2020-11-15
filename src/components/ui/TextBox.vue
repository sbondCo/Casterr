<template>
  <div class="textBox">
    <input ref="textBox" :type="type" :value="textBoxValue" :placeholder="placeholder" spellcheck="false" @blur="$emit('item-changed', name, $refs.textBox.value)" />

    <button v-if="folderSelect" @click="selectFolder">Change</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { remote } from "electron";
import * as fs from "fs";

const TextBoxProps = Vue.extend({
  props: {
    name: String,
    value: String,
    placeholder: String,
    type: String,

    folderSelect: Boolean
  }
});

@Component

export default class TextBox extends TextBoxProps {
  data() {
    return {
      textBoxValue: this.value
    }
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
