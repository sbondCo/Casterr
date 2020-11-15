<template>
  <div class="listBoxContainer">
    <div v-for="item in items" :key="item.id">
      <div class="listBoxItem">
        <TickBox name="temp" />
        <span class="body" :title="item.title">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import TickBox from "./../ui/TickBox.vue";

export class ListBoxItem {
  // eslint-disable-next-line no-unused-vars
  constructor(private id: number, private name: string, private title: string) {}
}

@Component({
  components: {
    TickBox
  },
})

export default class ListBox extends Vue {
  @Prop(String) name!: string
  @Prop(Array) items!: Array<ListBoxItem>
}
</script>

<style lang="scss" scoped>
.listBoxContainer {
  padding: 10px;
  background-color: $secondaryColor;
  border-radius: 4px;

  .listBoxItem {
    padding: 2px;

    .body {
      cursor: help;
    }
  }
}
</style>
