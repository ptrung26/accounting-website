<script>
import MTableHeader from "./MTableHeader.vue";
import { v4 as uuidv4 } from "uuid";
import MTableFooter from "./MTableFooter.vue";
export default {
  props: {
    columns: {
      type: Array,
    },
    fColumns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
    },
    fData: {
      type: Object,
      default: () => {},
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    parentKey: {
      type: String,
      default: "",
    },
    isToggleAll: {
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
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    isCheckAll: {
      type: Boolean,
      default: false,
    },
    checkedKey: {
      type: String,
      default: "",
    },
    tableType: {
      type: Number,
      default: 0,
    },
    selectedId: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    tableMode: {
      type: Number,
      default: 0,
    },
    validator: {
      type: Function,
      default: () => {},
    },
    errors: {
      type: Object,
      default: () => {},
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    isTableFocus: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MTableHeader,
    MTableFooter,
  },
  emits: [
    "update-data",
    "row-dblclick",
    "row-click",
    "check-one",
    "check-all",
    "combobox-update",
    "delete-row",
    "delete-row-one",
    "edit-row",
    "replication-row",
    "inactive-row",
    "value-invalid",
    "blur-table",
  ],
  methods: {
    /**
     Xử lý sự kiện dblclick vào item
     Author: ptrung26 (17/8/2023)
     */
    handleOnTableRowDblClick(data) {
      this.$emit("row-dblclick", data);
    },

    /**
     Xử lý sự kiện click vào item
     Author: ptrung26 (17/8/2023)
     */
    handleOnTableRowClick(data) {
      this.$emit("row-click", data);
    },

    /**
     * Xử lý việc mở context menu
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
      this.data.forEach((el) => this.addUniqueId(el));
    },

    /**
     * Xử lý khi checked item
     * Author: ptrung26 (29/10/2023)
     * @param {Object} data
     */
    handleOnCheckedOne(data) {
      this.$emit("check-one", data);
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
      this.emit("check-all", ids);
    },

    /**
     * Xử lý khi cập nhật giá trị của cell
     * @param {Object} newData giá trị mới
     * Author: ptrung26 (08/11/2023)
     */
    updateData(newData) {
      this.$emit("update-data", newData);
    },

    /**
     * Xử lý focus vào component
     * Author: ptrung26 (25/11/2023)
     */
    focus() {
      this.isFocus = true;
    },

    /**
     * Xử lý blur ra khỏi table
     * Author: ptrung26 (25/11/2023)
     */
    blur(isFocusNextRow) {
      this.isFoucs = false;
      this.$emit("blur-table", isFocusNextRow);
    },

    /**
     * Xử lý focus vào cell mong muốn
     * Author: ptrung26 (20/11/2023)
     * @param {int} rowIndex
     * @param {int} cellIndex
     */
    handleSetFocusCell(rowIndex, cellIndex) {
      if (this.$refs.tbody) {
        this.$refs.tbody.handleSetFocusCell(rowIndex, cellIndex);
      }
    },
  },
  watch: {
    data: {
      async handler(newValue) {
        this.colData = [...newValue];
        this.enrichTableData();
      },
    },
    isTableFocus: {
      handler(newValue) {
        this.isFocus = newValue;
      },
    },
  },
  data() {
    return {
      isLoading: false,
      isCollapse: true,
      colData: this.data,
      isFocus: this.isTableFocus,
    };
  },
  created() {
    // Xử lý thêm uuid vào từng item
    this.enrichTableData();
  },
};
</script>

<template>
  <table class="m-table" :tabindex="tabindex">
    <m-table-header
      :columns="columns"
      :isShowMethod="isShowMethod"
      :isShowCheckbox="isShowCheckbox"
      :tableType="tableType"
      :isShowIndex="isShowIndex"
      :isCheckAll="isCheckAll"
      @check-all="(state) => this.$emit('check-all', state)"
    ></m-table-header>
    <m-table-body
      :data="colData"
      :columns="columns"
      :isToggleAll="isToggleAll"
      :isShowCheckbox="isShowCheckbox"
      :isShowMethod="isShowMethod"
      :isCheckAll="isCheckAll"
      :parentKey="parentKey"
      :checkedList="checkedList"
      :tableType="tableType"
      :checkedKey="checkedKey"
      :selectedId="selectedId"
      :tableMode="tableMode"
      @update-data="updateData"
      @row-dblclick="handleOnTableRowDblClick"
      @row-click="handleOnTableRowClick"
      @combobox-update="(params) => this.$emit('combobox-update', params)"
      @check-one="(data) => this.$emit('check-one', data)"
      @delete-row="(data) => this.$emit('delete-row', data)"
      @delete-row-one="(index) => this.$emit('delete-row-one', index)"
      @edit-row="(data) => this.$emit('edit-row', data)"
      @replication-row="(data) => this.$emit('replication-row', data)"
      @inactive-row="(data) => this.$emit('inactive-row', data)"
      @value-invalid="(params) => this.$emit('value-invalid', params)"
      @blur-table="blur"
      :isShowIndex="isShowIndex"
      :options="options"
      :validator="validator"
      :errors="errors"
      :tabindex="tabindex"
      :isFocus="isFocus"
      ref="tbody"
    >
    </m-table-body>
    <m-table-footer
      v-if="data.length > 0 && fData && fColumns"
      :data="fData"
      :columns="fColumns"
      :isShowMethod="isShowMethod"
      :isShowCheckbox="isShowCheckbox"
      :tableType="tableType"
      :isShowIndex="isShowIndex"
      class="m-footer"
    ></m-table-footer>
  </table>
</template>

<style scoped></style>
