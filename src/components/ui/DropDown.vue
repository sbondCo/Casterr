<template>
  <div id="dropDown" @click="toggleDropDown()">
    <label>{{ itemActive.name != undefined ? itemActive.name : itemActive }}</label>

    <ul ref="dropDownItems" id="dropDownItems">
      <li v-for="item in dropDownItems" :key="item.id" @click="switchItems(item)">
        {{ item.name != undefined ? item.name : item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";

@Component
export default class DropDown extends Vue {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) activeItem: string;
  @Prop({ required: true }) items: string[] | number[] | DropDownItem[];

  itemActive = this.$props.activeItem;

  get dropDownItems(): DropDownItem[] {
    return this.items.remove(this.activeItem);
  }

  private toggleDropDown() {
    let items = this.$refs.dropDownItems as HTMLElement;

    if (items.classList.contains("opened")) {
      items.classList.remove("opened");
    } else {
      items.classList.add("opened");
    }
  }

  private switchItems(itemClicked: string | DropDownItem) {
    // Replace itemClicked on with current activeItem
    if (typeof itemClicked == "string") {
      this.dropDownItems.replace(itemClicked, this.$data.itemActive);
    } else {
      this.dropDownItems.replace(itemClicked.name, this.$data.itemActive);
    }

    // Update itemActive prop with itemClicked on
    this.$set(this.$data, "itemActive", itemClicked);

    this.$emit("item-changed", this.name, this.$data.itemActive);
  }
}

export interface DropDownItem {
  id: string;
  name: string;
}
</script>

<style lang="scss" scoped>
#dropDown {
  min-width: 160px;
  width: 100%;
  background-color: $secondaryColor;
  border: 2px dashed $quaternaryColor;
  border-radius: 4px;
  transition: border-color 250ms ease-in-out;
  cursor: pointer;

  label {
    display: block;
    padding: 8px;
    border-radius: 4px 4px 0 0;
    transition: background-color 250ms ease;
    cursor: pointer;
  }

  ul {
    max-height: 0;
    overflow-y: auto;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    transition: max-height 150ms ease-in-out, margin 150ms ease-in-out;

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
      max-height: 160px;
    }

    &:hover {
      &::-webkit-scrollbar {
        width: 5px;
      }
    }

    &::-webkit-scrollbar {
      width: 0px;
      background: $primaryColor;
    }

    &::-webkit-scrollbar-thumb {
      background: $tertiaryColor;
      border-radius: 1ex;
    }
  }

  &:hover {
    border-color: $textPrimary;

    label {
      background-color: $tertiaryColor;
    }
  }
}
</style>
