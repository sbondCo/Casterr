<template>
  <div id="dropDown" @click="toggleDropDown()">
    <label>{{ pholder }}</label>
    <ul ref="dropDownItems" id="dropDownItems">
      <li v-for="item in dropDownItems" :key="item" @click="switchItems(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const DropDownProps = Vue.extend({
  props: {
    name: String,
    placeholder: String,
    items: Array
  }
});

@Component

export default class DropDown extends DropDownProps {
  data() {
    return {
      pholder: this.placeholder,
      dropDownItems: this.items.remove(this.placeholder)
    }
  }

  private toggleDropDown() {
    let dd = this.$el as HTMLElement;
    let items = this.$refs.dropDownItems as HTMLElement;

    if (items.classList.contains("opened")) {
      dd.style.borderRadius = "4px";
      items.classList.remove("opened");
    } else {
      dd.style.borderRadius = "4px 4px 0 0";
      items.classList.add("opened");
    }
  }

  private switchItems(itemClicked: string) {
    // Replace itemClicked on with current placeholder
    this.$data.dropDownItems.replace(itemClicked, this.$data.pholder);

    // Update pholder prop with itemClicked on
    this.$set(this.$data, 'pholder', itemClicked);

    this.$emit('item-changed', this.name, this.$data.pholder);
  }
}
</script>

<style lang="scss" scoped>
#dropDown {
  position: relative;
  display: inline-block;
  min-width: 160px;
  width: 100%;
  padding: 8px;
  background-color: $secondaryColor;
  border-radius: 4px;
  transition: background-color 250ms ease;
  cursor: pointer;

  label {
    transition: all 250ms ease;
    cursor: pointer;
  }

  ul {
    display: none;
    position: absolute;
    right: 0;
    max-height: 160px;
    width: 100%;
    margin: 8px 0 0 0;
    z-index: 1;
    overflow-y: auto;
    border-radius: 0 0 4px 4px;
    cursor: pointer;

    li {
      width: 100%;
      padding: 8px;
      list-style: none;
      background-color: $secondaryColor;
      cursor: pointer;

      &.active {
        background-color: $quaternaryColor !important;
      }

      &:hover {
        background-color: $tertiaryColor;
      }
    }

    &.opened {
      display: block;
    }

    &::-webkit-scrollbar {
      width: 5px;
      background: $primaryColor;
    }

    &::-webkit-scrollbar-thumb {
      background: $tertiaryColor;
      border-radius: 1ex;
    }
  }

  &:hover {
    background-color: $tertiaryColor;
  }
}
</style>
