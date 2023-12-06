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
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    isShowMethod: {
      type: Boolean,
      default: false,
    },
    parentKey: {
      type: String,
      default: "",
    },
    isShowIndex: {
      type: Boolean,
      default: false,
    },
    tableType: {
      type: Number,
      default: 0,
    },
    checkedKey: {
      type: String,
      default: "",
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
    errors: {
      type: Object,
      default: () => ({}),
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    isFocus: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update-data",
    "row-click",
    "row-dblclick",
    "combobox-update",
    "check-one",
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
     * Xử lý sự kiện tr dblclick
     * Author: ptrung26 (20/10/2023)
     * @param {Object} data
     */
    tableRowDblClick(data) {
      this.$emit("row-dblclick", data);
    },

    /**
     * Xử lý sự kiện tr click
     * Author: ptrung26 (20/10/2023)
     * @param {Object} data
     */
    tableRowClick(params) {
      this.$emit("row-click", params.data);
      this.rowEditMode = params.data.uuid;
      this.rowFocusIdx = params.rowIndex;
    },

    /**
     * Xử lý khi focus vào row
     * Author: ptrung26 (25/11/2023)
     * @param {Object} data
     */
    tablerowFocusIdx(data) {
      this.$emit("row-click", data);
      this.rowEditMode = data.uuid;
    },

    /**
     * Xử lý khi cập nhật giá trị của cell
     * @param {Object} newData giá trị mới
     * Author: ptrung26 (08/11/2023)
     */
    updateRowData(index, newData) {
      const updatedData = [...this.data];
      updatedData[index] = newData;
      this.$emit("update-data", updatedData);
    },

    /**
     * Xử lý focus vào row tiếp theo
     * Author: ptrung26 (25/11/2023)
     * @param {Object} params Chứa thông tin hàng và cột sẽ focus tiếp theo
     */
    handleFocusRow(params) {
      this.rowFocusIdx = params.rowIndex + 1;
      this.cellFocusIdx = params.colIndex;
      this.isFocusNextRow = true;
      if (this.rowFocusIdx === this.colData.length) {
        this.$emit("blur-table", true);
        this.rowEditMode = null;
        this.rowFocusIdx = 0;
        this.cellFocusIdx = 0;
        return;
      }
      this.tablerowFocusIdx(this.colData[this.rowFocusIdx]);
    },

    /**
     * Xử lý focus row trước đó
     * Author: ptrung26 (25/11/2023)
     */
    handleFocusPreviousRow(params) {
      this.rowFocusIdx = params.rowIndex - 1;
      this.cellFocusIdx = params.colIndex;
      this.isFocusNextRow = false;
      if (this.rowFocusIdx < 0) {
        this.$emit("blur-table", false);
        this.rowEditMode = null;
        this.rowFocusIdx = 0;
        this.cellFocusIdx = 0;
        return;
      }
      this.tablerowFocusIdx(this.colData[this.rowFocusIdx]);
    },

    /**
     * Xử lý sự kiện cell click
     * Author: ptrung26 (20/11/2023)
     * @param {Object} params
     */
    handleCellClick(params) {
      if (!params) {
        return;
      }
      this.cellFocusIdx = params.colIndex;
      this.rowFocusIdx = params.rowIndex;
      this.tablerowFocusIdx(this.colData[this.rowFocusIdx]);
    },

    /**
     * Xử lý focus vào cell mong muốn
     * Author: ptrung26 (20/11/2023)
     * @param {int} rowIndex
     * @param {int} cellIndex
     */
    handleSetFocusCell(rowIndex, cellIndex) {
      this.cellFocusIdx = cellIndex;
      this.rowFocusIdx = rowIndex;
    },
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        this.colData = [...newValue];
        if (oldValue && oldValue.length < newValue.length) {
          this.rowFocusIdx = this.colData.length - 1;
          this.cellFocusIdx = 0;
          if (this.rowFocusIdx >= 0) {
            this.rowEditMode = this.colData[this.rowFocusIdx].uuid;
            this.isFocusNextRow = true;
          }
        }
      },
    },
    isFocus: {
      handler(newValue) {
        if (!this.colData || !this.colData.length) {
          return;
        }

        if (newValue) {
          if (this.rowFocusIdx >= this.colData.length) {
            this.rowFocusIdx = this.colData.length - 1;
            this.cellFocusIdx = 0;
          }
          this.rowEditMode = this.colData[this.rowFocusIdx].uuid;
          this.isFocusNextRow = true;
        } else {
          this.rowFocusIdx = 0;
          this.cellFocusIdx = 0;
        }
      },
    },
  },
  data() {
    return {
      colData: this.data,
      currentMenuId: "",
      rowEditMode: "",
      isFocusNextRow: false,
      rowFocusIdx: 0,
      cellFocusIdx: 0,
    };
  },
};
</script>

<template>
  <tbody class="m-tbody">
    <template v-for="(item, index) in colData" :key="index">
      <m-table-node
        :data="{ ...item }"
        :tabindex="tabindex"
        :columns="columns"
        :isToggleAll="isToggleAll"
        :isShowCheckbox="isShowCheckbox"
        :isShowMethod="isShowMethod"
        :isShowIndex="isShowIndex"
        :rowIndex="index"
        :currentMenuId="currentMenuId"
        :parentKey="parentKey"
        :selectedId="selectedId"
        :checkedList="checkedList"
        :checkedKey="checkedKey"
        :tableType="tableType"
        @update-row="updateRowData(index, $event)"
        @row-dblclick="tableRowDblClick"
        @row-click="tableRowClick"
        @combobox-update="
          (params) => this.$emit('combobox-update', { params, index })
        "
        @check-one="(data) => this.$emit('check-one', data)"
        @show-menu="(id) => (currentMenuId = id)"
        @delete-row="(data) => this.$emit('delete-row', data)"
        @delete-row-one="(index) => this.$emit('delete-row-one', index)"
        @edit-row="(data) => this.$emit('edit-row', data)"
        @replication-row="(data) => this.$emit('replication-row', data)"
        @inactive-row="(data) => this.$emit('inactive-row', data)"
        @value-invalid="(params) => this.$emit('value-invalid', params)"
        :options="options"
        :tableMode="tableMode"
        :errors="errors[index]"
        :rowEditMode="rowEditMode"
        :rowFocusIdx="rowFocusIdx"
        :cellFocusIdx="cellFocusIdx"
        @focus-next-row="handleFocusRow"
        :isFocusNextRow="isFocusNextRow"
        @focus-previous-row="handleFocusPreviousRow"
        @cell-click="handleCellClick"
      >
      </m-table-node>
    </template>
  </tbody>
</template>

<style scoped></style>
