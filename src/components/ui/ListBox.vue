<template>
  <div class="listBoxContainer">
    <div v-for="item in items" :key="item.id">
      <div class="listBoxItem">
        <TickBox
          :name="item.id.toString() + ':' + item.name"
          :ticked="shouldBeEnabled(item.id)"
          @item-changed="listBoxValueUpdated"
        />

        <span class="body" :title="item.title" :style="item.title == undefined ? '' : 'cursor: help;'">
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TickBox from "./../ui/TickBox.vue";

@Component({
  components: {
    TickBox
  }
})
export default class ListBox extends Vue {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) items: Array<ListBoxItem>;
  @Prop({ required: true }) enabled: Array<Number>;

  listBoxValueUpdated(toUpdate: string, newValue: any) {
    this.$emit("item-changed", this.name, [toUpdate.split(":"), newValue]);
  }

  shouldBeEnabled(id: Number): Boolean {
    return this.enabled.includes(id);
  }
}

export class ListBoxItem {
  // eslint-disable-next-line no-unused-vars
  constructor(private id: number | string, private name: string, private title?: string | undefined) {}
}
</script>

<style lang="scss" scoped>
.listBoxContainer {
  padding: 8px 3px;
  background-color: $secondaryColor;
  border-radius: 4px;

  .listBoxItem {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 3px;

    .body {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover .body {
      text-overflow: unset;
      white-space: pre-wrap;
      font-weight: bold;
    }
  }
}
</style>
