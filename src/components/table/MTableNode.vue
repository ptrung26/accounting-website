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
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    isShowMethod: {
      type: Boolean,
      default: false,
    },
    isFooter: {
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
    isFocusNextRow: {
      type: Boolean,
      default: false,
    },
    rowIndex: {
      type: Number,
      default: -1,
    },
    selectedId: {
      type: String,
      default: "",
    },
    checkedKey: {
      type: String,
      default: "",
    },
    tableType: {
      type: Number,
      default: 0,
    },
    currentMenuId: {
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
      default: () => ({}),
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    rowEditMode: {
      type: String,
      default: "",
    },
    cellFocusIdx: {
      type: Number,
      default: -1,
    },
    rowFocusIdx: {
      type: Number,
      default: -1,
    },
  },
  emits: [
    "update-row",
    "row-click",
    "row-dblclick",
    "combobox-update",
    "check-one",
    "edit-row",
    "delete-row",
    "show-menu",
    "replication-row",
    "inactive-row",
    "delete-row-one",
    "value-invalid",
    "focus-next-row",
    "focus-previous-row",
    "cell-click",
  ],
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
      this.$emit("row-dblclick", data);
    },

    /**
     * Xử lý khi click hoặc focus vào item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} data
     */
    tableRowClick(data) {
      this.$emit("row-click", { data, rowIndex: this.rowIndex });
    },

    /**
     * Xử lý khi cập nhật giá trị của cell
     * @param {Object} newData giá trị mới
     * Author: ptrung26 (08/11/2023)
     */
    updateCellData(newData) {
      this.$emit("update-row", newData);
    },

    /**
     * Thực hiện cập nhập row
     * Author: ptrung26 (12/11/2023)
     * @param {Object} data
     */
    editRow(data) {
      this.$emit("edit-row", data);
    },

    /**
     * Thực hiện xóa row
     * Author: ptrung26 (12/11/2023)
     * @param {Object} data
     */
    deleteRow(data) {
      this.$emit("delete-row", data);
    },

    /**
     * Thực hiện nhân bản row
     * Author: ptrung26 (12/11/2023)
     * @param {Object} data
     */
    replicationRow(data) {
      this.$emit("replication-row", data);
    },

    /**
     * Thực hiện ngừng sử dụng row
     * Author: ptrung26 (12/11/2023)
     * @param {Object} data
     */
    inactiveRow(data) {
      this.$emit("inactive-row", data);
    },

    /**
     * Trả về lỗi của cột
     * Author: ptrung26 (20/11/2023)
     */
    getErrorForColumn(field) {
      if (this.errors && field in this.errors) {
        return this.errors[field];
      }
      return "";
    },

    /**
     * Xử lý focus vào hàng tiếp theo
     * Author: ptrung26 (22/11/2023)
     * @param {Object} params Chứa thông tin hàng và cột sẽ focus tiếp theo
     */
    handleFocusNextRow(params) {
      this.$emit("focus-next-row", params);
    },

    /**
     * Xử lý focus vào hàng trước
     * Author: ptrung26 (22/11/2023)
     * @param {Object} params Chứa thông tin hàng và cột sẽ focus trước đó
     */
    handleFocusCurrentRow(params) {
      this.$emit("focus-previous-row", params);
    },

    /**
     * Xử lý khi cell click
     * Author: ptrung26 (22/11/2023)
     * @param {Object} params Thông tin gồm hàng và cột hiện tại click
     */
    handleCellClick(params) {
      if (params) {
        this.$emit("cell-click", params);
      }
    },
  },
  watch: {
    data: {
      handler(newValue) {
        this.colData = { ...newValue };
      },
    },
    isToggleAll: {
      handler(newValue) {
        this.isOpen = newValue;
      },
      immediate: true,
    },
    rowEditState: {
      handler(newValue) {
        const [rowEditMode, isFocusNextRow] = newValue;
        this.isEditMode = rowEditMode === this.colData.uuid;

        if (this.isEditMode) {
          this.$nextTick(() => {
            if (
              this.rowFocusIdx >= 0 &&
              this.cellFocusIdx >= 0 &&
              this.rowFocusIdx === this.rowIndex
            ) {
              const cellComponent = this.$refs.tableCell[this.cellFocusIdx];
              cellComponent.focus();
            } else if (isFocusNextRow) {
              for (let i = 0; i < this.$refs.tableCell.length; i++) {
                const cellComponent = this.$refs.tableCell[i];
                if (
                  this.columns[i].columnType ===
                    this.$MISAEnum.ColumnType.Input ||
                  this.columns[i].columnType ===
                    this.$MISAEnum.ColumnType.Combobox
                ) {
                  cellComponent.focus();
                  break;
                }
              }
            } else {
              for (let i = this.$refs.tableCell.length - 1; i >= 0; i--) {
                const cellComponent = this.$refs.tableCell[i];
                if (
                  this.columns[i].columnType ===
                    this.$MISAEnum.ColumnType.Input ||
                  this.columns[i].columnType ===
                    this.$MISAEnum.ColumnType.Combobox
                ) {
                  cellComponent.focus();
                  break;
                }
              }
            }
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      isOpen: false,
      colData: this.data,
      isEditMode: false,
      rowFocus: null,
      cellFocus: null,
    };
  },
  computed: {
    colActionLength() {
      const filter = this.columns.filter(
        (column) =>
          column.columnType === this.$MISAEnum.ColumnType.Combobox ||
          column.columnType === this.$MISAEnum.ColumnType.Input
      );

      return filter.length;
    },

    rowEditState() {
      return [this.rowEditMode, this.isFocusNextRow];
    },
  },
};
</script>

<template>
  <tr
    class="m-tr"
    @dblclick="tableRowDblClick(colData)"
    @click="tableRowClick(colData)"
    :class="{
      'm-tr-focus':
        (colData && selectedId === colData[checkedKey]) ||
        checkedList.includes(colData && colData[checkedKey]),
    }"
  >
    <template v-if="isShowIndex">
      <m-table-cell
        :depth="depth"
        :data="{ ...colData }"
        :checkedList="checkedList"
        :isShowIndex="isShowIndex"
        :checkedKey="checkedKey"
        :rowIndex="rowIndex"
        :tableMode="tableMode"
        :isFooter="isFooter"
        :currentMenuId="currentMenuId"
        :isEditMode="isEditMode"
      >
      </m-table-cell>
    </template>
    <template v-if="isShowCheckbox">
      <m-table-cell
        :depth="depth"
        :data="{ ...colData }"
        :isShowCheckbox="isShowCheckbox"
        :checkedList="checkedList"
        @check-one="(data) => this.$emit('check-one', data)"
        :currentMenuId="currentMenuId"
        :checkedKey="checkedKey"
        :rowIndex="rowIndex"
        :tableMode="tableMode"
        :isFooter="isFooter"
        :tabindex="tabindex"
        :isEditMode="isEditMode"
      >
      </m-table-cell>
    </template>
    <m-table-cell
      :data="{ ...colData }"
      :column="column"
      :onToggle="toggle"
      :depth="depth"
      v-for="(column, index) in columns"
      :key="index"
      :colIndex="index"
      :colLength="colActionLength"
      :isToggleAll="isToggleAll"
      :currentMenuId="currentMenuId"
      :parentKey="parentKey"
      :checkedList="checkedList"
      :tableType="tableType"
      @updateCellData="updateCellData"
      @combobox-update="(params) => this.$emit('combobox-update', params)"
      :checkedKey="checkedKey"
      @delete-row="deleteRow"
      @delete-row-one="(index) => this.$emit('delete-row-one', index)"
      @value-invalid="(params) => this.$emit('value-invalid', params)"
      @focus-next-row="handleFocusNextRow"
      @focus-previous-row="handleFocusCurrentRow"
      @cell-click="handleCellClick"
      :rowIndex="rowIndex"
      :tableMode="tableMode"
      :isFooter="isFooter"
      :error="getErrorForColumn(column.field)"
      ref="tableCell"
      :tabindex="tabindex"
      :isEditMode="isEditMode"
    >
    </m-table-cell>
    <m-table-cell
      :depth="depth"
      v-if="isShowMethod"
      :checkedList="checkedList"
      :data="{ ...colData }"
      :tableType="tableType"
      :isShowMethod="isShowMethod"
      :currentMenuId="currentMenuId"
      :isFooter="isFooter"
      :checkedKey="checkedKey"
      @updateCellData="updateCellData"
      :rowIndex="rowIndex"
      :tabindex="tabindex"
      @show-menu="
        (id) => {
          this.$emit('show-menu', id);
        }
      "
      @delete-row="deleteRow"
      @edit-row="editRow"
      @replication-row="(data) => this.$emit('replication-row', data)"
      @inactive-row="inactiveRow"
      :options="options"
      :tableMode="tableMode"
      :isEditMode="isEditMode"
    >
    </m-table-cell>
  </tr>
  <template v-if="colData.children && isOpen">
    <template v-for="(child, index) in colData.children" :key="index">
      <m-table-node
        :columns="columns"
        :depth="depth + 1"
        :isToggleAll="isToggleAll"
        :data="{ ...child }"
        :isShowCheckbox="isShowCheckbox"
        :parentKey="parentKey"
        :checkedList="checkedList"
        :tableType="tableType"
        :isShowIndex="isShowIndex"
        :isShowMethod="isShowMethod"
        :checkedKey="checkedKey"
        @delete-row="deleteRow"
        @delete-row-one="(index) => this.$emit('delete-row-one', index)"
        @edit-row="editRow"
        @replication-row="replicationRow"
        @row-click="tableRowClick"
        @row-dblclick="tableRowDblClick"
        @inactive-row="inactiveRow"
        @value-invalid="(params) => this.$emit('value-invalid', params)"
        @show-menu="this.$emit('show-menu', child[this.checkedKey])"
        :options="options"
        :rowIndex="rowIndex"
        :tableMode="tableMode"
        :isFooter="isFooter"
        :currentMenuId="currentMenuId"
        :tabindex="tabindex"
      >
      </m-table-node>
    </template>
  </template>
</template>

<style scoped></style>
