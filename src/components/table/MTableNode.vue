<script>
import MTableCell from "./MTableCell.vue";
import MTableNode from "./MTableNode.vue";
export default {
  components: { MTableNode, MTableCell },
  props: {
    data: {
      type: Object,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    depth: {
      type: Number,
      default: 0,
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
    selectedId: {
      type: String,
      default: "",
    },
    onSelectRow: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    /**
     * Xử lý đóng mở item con
     * Author: ptrung26 (20/10/2023)
     * @param {Boolean} state Trạng thái mở rộng cha
     */
    toggle(state) {
      this.isOpen = state;
    },

    /**
     * Xử lý tr dbclick
     * Author: ptrung26 (20/10/2023)
     * @param {Object} data
     */
    tableRowDblClick(data) {
      this.$emitter.emit("onTableRowDblClick", data);
    },

    /**
     * Xử lý khi click hoặc focus vào item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} data
     */
    handleSelectRow(data) {
      this.onSelectRow(data);
    },
  },

  data() {
    return {
      isOpen: false,
    };
  },
};
</script>

<template>
  <tr
    class="m-tr"
    @dblclick="tableRowDblClick(data)"
    @click="handleSelectRow(data)"
    :class="{
      'm-tr-focus':
        selectedId === data?.uuid || checkedList.includes(data?.uuid),
    }"
  >
    <template v-if="hasSelectBox">
      <m-table-cell
        :depth="depth"
        :data="data"
        :hasSelectBox="hasSelectBox"
        :checkedList="checkedList"
      >
      </m-table-cell>
    </template>
    <m-table-cell
      :data="data"
      :column="column"
      :onToggle="toggle"
      :depth="depth"
      v-for="(column, index) in columns"
      :key="index"
      :isToggleAll="isToggleAll"
      :idx="index"
      :isParentKey="isParentKey"
      :checkedList="checkedList"
    >
    </m-table-cell>
    <m-table-cell :depth="depth" v-if="isHasMethod" :checkedList="checkedList">
      <template #body>
        <slot name="body" v-bind="data"></slot>
      </template>
    </m-table-cell>
  </tr>
  <template v-if="data.children && (isToggleAll || isOpen)">
    <template v-for="child in data.children" :key="child.uuid">
      <m-table-node
        :columns="columns"
        :depth="depth + 1"
        :isToggleAll="isToggleAll"
        :data="child"
        :hasSelectBox="hasSelectBox"
        :onSelectRow="onSelectRow"
        :isParentKey="isParentKey"
        :checkedList="checkedList"
      >
        <template #body>
          <slot name="body" v-bind="child"></slot>
        </template>
      </m-table-node>
    </template>
  </template>
</template>

<style scoped></style>
