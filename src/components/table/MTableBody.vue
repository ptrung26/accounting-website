<script>
import MTableNode from "./MTableNode.vue";
export default {
  components: { MTableNode },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    isToggleAll: {
      type: Boolean,
      default: false,
    },
    hasSelectBox: {
      type: Boolean,
      default: false,
    },
    isHasMethod: {
      type: Boolean,
      default: true,
    },
    isParentKey: {
      type: String,
      default: "",
    },
  },

  methods: {
    /**
     * Xử lý sự kiện tr click
     * Author: ptrung26 (20/10/2023)
     * @param {Object} data
     */
    tableRowDblClick(data) {
      this.onTableRowDblClick(data);
    },

    /**
     * Xử lý khi click hoặc focus vào item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} data
     */
    onSelectRow(data) {
      this.selectedId = data?.uuid;
    },
  },
  data() {
    return {
      selectedId: "",
    };
  },
};
</script>

<template>
  <tbody class="m-tbody">
    <template v-for="item in data" :key="item.uuid">
      <m-table-node
        :data="item"
        :columns="columns"
        :depth="0"
        :isToggleAll="isToggleAll"
        :hasSelectBox="hasSelectBox"
        :isHasMethod="isHasMethod"
        :isParentKey="isParentKey"
        :onSelectRow="onSelectRow"
        :selectedId="selectedId"
        :checkedList="checkedList"
      >
        <template #body="nodeProps">
          <slot name="body" v-bind="nodeProps"></slot>
        </template>
      </m-table-node>
    </template>
  </tbody>
</template>

<style scoped></style>
