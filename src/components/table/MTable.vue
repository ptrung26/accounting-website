<script>
import MTableHeader from "./MTableHeader.vue";
import { v4 as uuidv4 } from "uuid";
import MTableFooter from "./MTableFooter.vue";
export default {
  props: {
    columns: {
      type: Array,
    },
    data: {
      type: Array,
    },
    fData: {
      type: Object,
      default: () => {},
    },
    fColumns: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    isParentKey: {
      type: String,
      default: "",
    },
    isToggleAll: {
      type: Boolean,
      default: false,
    },
    isHasMethod: {
      type: Boolean,
      default: true,
    },
    hasSelectBox: {
      type: Boolean,
      default: false,
    },
    onTableRowDblClick: {
      type: Function,
      default: () => {},
    },
    onCheckedOne: {
      type: Function,
      default: () => {},
    },
    onCheckedAll: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    MTableHeader,
    MTableFooter,
  },

  methods: {
    /**
     Xử lý sự kiện dblclick vào item 
     Author: ptrung26 (17/8/2023)
     */
    handleOnTableRowDblClick(data) {
      this.onTableRowDblClick(data);
    },

    /**
     * Xử lý việc  mở context menu
     * Author: ptrung26 (21/08/2023)
     */
    handleDeleteItem(data) {
      this.$emitter.emit("onDeleteItemTable", data);
    },

    /**
     * Đệ quy thêm id cho các item trong data
     * Author: ptrung26 (19/10/2023)
     * @param {object} data item hiện tại
     */
    addUniqueId(data) {
      data.uuid = uuidv4();
      if (data.children) {
        data.children.forEach((child) => this.addUniqueId(child));
      }
    },
    /**
     * Thêm id vào từng item trong data
     * Author: ptrung26 (19/10/2023);
     */
    enrichTableData() {
      this.data?.forEach((el) => this.addUniqueId(el));
    },

    /**
     * Xử lý khi checked item
     * Author: ptrung26 (29/10/2023)
     * @param {String} uuid
     * @param {Boolean} status Trạng thái của checkbox
     */
    handleOnCheckedOne(uuid, status) {
      this.onCheckedOne(uuid, status);
    },

    /**
     * Xử lý checked tất cả item
     * Author: ptrung26 (29/10/2023)
     * @param {Boolean} state Trạng thái của checkbox all
     */
    handleOnCheckedAll(status) {
      let ids = [];
      if (status) {
        ids = this.data.map((item) => item.uuid);
      }
      this.onCheckedAll(ids);
    },
  },
  data() {
    return {
      isLoading: false,
      isCollapse: true,
    };
  },
  created() {
    // Khởi tạo các emitter
    this.$emitter.on("onTableRowDblClick", this.handleOnTableRowDblClick);
    this.$emitter.on("onCheckedOne", this.handleOnCheckedOne);
    this.$emitter.on("onCheckedAll", this.handleOnCheckedAll);

    // Xử lý thêm uuid vào từng item
    this.enrichTableData();
  },
  beforeUnmount() {
    this.$emitter.off("onTableRowDblClick", this.handleOnTableRowDblClick);
    this.$emitter.off("onCheckedOne", this.handleOnCheckedOne);
  },
};
</script>

<template>
  <table class="m-table">
    <m-table-header
      :columns="columns"
      :isHasMethod="isHasMethod"
      :hasSelectBox="hasSelectBox"
    ></m-table-header>
    <m-table-body
      :data="data"
      :columns="columns"
      yyyy
      :isToggleAll="isToggleAll"
      :hasSelectBox="hasSelectBox"
      :isHasMethod="isHasMethod"
      :isParentKey="isParentKey"
      :checkedList="checkedList"
    >
      <template #body="nodeProps">
        <slot name="body" v-bind="nodeProps"></slot>
      </template>
    </m-table-body>
    <m-table-footer
      v-if="fData && fColumns"
      :data="fData"
      :columns="fColumns"
      class="m-footer"
    ></m-table-footer>
  </table>
</template>

<style scoped></style>
