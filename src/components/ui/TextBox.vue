<template>
  <div class="textBox">
    <input ref="textBox" :type="type" :value="value" :placeholder="placeholder" spellcheck="false" @blur="$emit('item-changed', name, $refs.textBox.value)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const TextBoxProps = Vue.extend({
  props: {
    name: String,
    value: String,
    placeholder: String,
    type: String
  }
});

@Component

export default class TextBox extends TextBoxProps {
  
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
