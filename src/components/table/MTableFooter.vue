<template>
  <tfoot>
    <m-table-node
      :data="data"
      :columns="columns"
      :isToggleAll="isToggleAll"
      :isShowCheckbox="isShowCheckbox"
      :isFooter="true"
      :isShowIndex="isShowIndex"
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
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    isShowMethod: {
      type: Boolean,
      default: false,
    },
    isShowIndex: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
