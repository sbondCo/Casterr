<template>
  <div class="textBox">
    <input
      :type="type"
      v-model="textBoxValue"
      :placeholder="placeholder"
      spellcheck="false"
      @focus="textBoxFocused"
      @blur="textBoxValueUpdated"
      :class="{ plain: plain }"
    />

    <button v-if="folderSelect" @click="selectFolder">Change</button>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { ipcRenderer } from "electron";
import * as fs from "fs";

@Component
export default class TextBox extends Vue {
  @Prop({ required: true }) name: string;
  @Prop() value?: string;
  @Prop() placeholder?: string;
  @Prop({ default: "text" }) type: string;
  @Prop({ default: false }) folderSelect: boolean;

  /**
   * If TextBox should only appear as such when hovered over.
   * When not hovered over, it will look like normal text.
   */
  @Prop({ default: false }) plain: boolean;

  textBoxValue = this.$props.value;
  textBoxValueWhenEntering = this.textBoxValue;

  textBoxFocused() {
    // Update textBoxValueWhenEntering to current
    // value for later reference when user clicks out of textBox
    this.textBoxValueWhenEntering = this.textBoxValue;
  }

  textBoxValueUpdated() {
    // Only emit item-changed event, if textBox value has actually changed since entering
    if (this.textBoxValue != this.textBoxValueWhenEntering) {
      this.$emit("item-changed", this.name, this.textBoxValue);
    }
  }

  selectFolder() {
    let defaultFolder = this.textBoxValue;

    // Pretend textBox was focused, so we can update textBoxValueWhenEntering
    this.textBoxFocused();

    ipcRenderer
      .invoke("show-open-dialog", {
        title: `Select save folder`,
        // If path in textBox exists and is a directory, set it as defaultPath in dialog
        defaultPath:
          fs.existsSync(defaultFolder) && fs.lstatSync(defaultFolder).isDirectory() ? defaultFolder : undefined,
        buttonLabel: "Select",
        properties: ["openDirectory"]
      })
      .then((reply) => {
        let folder = reply.filePaths[0];

        // If a folder was selected, set textBox value to it
        if (folder != null) {
          this.textBoxValue = folder;
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

    &.plain {
      background-color: transparent;
    }

    &[type="number"]::-webkit-inner-spin-button,
    &[type="number"]::-webkit-outer-spin-button {
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
