<template>
  <tfoot>
    <m-table-node
      :data="data"
      :columns="columns"
      :depth="0"
      :isToggleAll="isToggleAll"
      :hasSelectBox="hasSelectBox"
      :isHasMethod="isHasMethod"
    >
    </m-table-node>
  </tfoot>
</template>

<script>
import MTableNode from "./MTableNode.vue";
export default {
  components: { MTableNode },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    isToggleAll: {
      type: Boolean,
      default: false,
    },
    onTableRowDblClick: {
      type: Function,
      default: () => {},
    },
    hasSelectBox: {
      type: Boolean,
      default: false,
    },
    isHasMethod: {
      type: Boolean,
      default: true,
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
  },
};
</script>
