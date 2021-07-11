<template>
  <div id="dropDown" class="border-med" @click="toggleDropDown()">
    <label>
      <span>{{ itemActive.name != undefined ? itemActive.name : itemActive }}</span>
      <Icon i="chevron" direction="down" wh="16" />
    </label>

    <ul ref="dropDownItems" id="dropDownItems">
      <li
        v-for="item in items"
        :key="item.id"
        :class="JSON.stringify(item) == JSON.stringify(itemActive) ? 'active' : ''"
        @click="switchItems(item)"
      >
        {{ item.name != undefined ? item.name : item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import Icon from "./../Icon.vue";

@Component({
  components: {
    Icon
  }
})
export default class DropDown extends Vue {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) activeItem: string;
  @Prop({ required: true }) items: string[] | number[] | DropDownItem[];

  itemActive = this.$props.activeItem;

  private toggleDropDown() {
    let dd = this.$el as HTMLElement;

    if (dd.classList.contains("opened")) {
      dd.classList.remove("opened");
    } else {
      dd.classList.add("opened");
    }
  }

  private switchItems(itemClicked: string | DropDownItem) {
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
  border-radius: 4px;
  transition: background-color 250ms ease;
  cursor: pointer;

  &.opened {
    ul {
      max-height: 160px;
    }

    label svg {
      transform: rotate(270deg);
    }
  }

  label {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;

    svg {
      margin-left: auto;
      fill: $textPrimary;
      transform: rotate(90deg);
      transition: transform 250ms ease;
    }
  }

  ul {
    max-height: 0;
    overflow-y: auto;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    transition: max-height 150ms ease, margin 150ms ease;

    li {
      width: 100%;
      padding: 8px;
      list-style: none;
      background-color: $secondaryColor;
      cursor: pointer;

      &.active {
        font-weight: bold;
        font-style: italic;
      }

      &:hover {
        background-color: $tertiaryColor;
      }
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
    background-color: $tertiaryColor;
  }
}
</style>
