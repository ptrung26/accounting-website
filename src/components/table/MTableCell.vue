<script>
export default {
  props: {
    data: {
      type: Object,
    },
    column: {
      type: Object,
    },
    onToggle: {
      type: Function,
      default: () => {},
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
    isShowMethod: {
      type: Boolean,
      default: false,
    },
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    isFooter: {
      type: Boolean,
      default: false,
    },
    colIndex: {
      type: Number,
      default: -1,
    },
    rowIndex: {
      type: Number,
      default: -1,
    },
    parentKey: {
      type: String,
      default: "",
    },
    isShowIndex: {
      type: Boolean,
      default: false,
    },
    checkedKey: {
      type: String,
      default: "",
    },
    currentMenuId: {
      type: String,
      default: "",
    },
    tableType: {
      type: Number,
      default: 0,
    },
    options: {
      type: Array,
      default: () => [],
    },
    tableMode: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
      default: "",
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    colLength: {
      type: Number,
      default: 0,
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
    "combobox-update",
    "updateCellData",
    "check-one",
    "send-data",
    "send-selected-row",
    "show-menu",
    "delete-row",
    "edit-row",
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
     */
    toggle() {
      this.isOpen = !this.isOpen;
      this.onToggle(this.isOpen, this.colData);
    },
    /**
     * Chặn sự kiện double click nếu click nhanh
     * Author: ptrung26 (30/09/2023)
     */
    preventDblClickEvent(event) {
      event.stopPropagation();
    },

    /**
     * Xử lý việc mở context menu
     * Author: ptrung26 (21/08/2023)
     */
    handleOpenContextMenu(event) {
      event.stopPropagation();
      if (this.isOpenContextMenu) {
        this.isOpenContextMenu = false;
        this.$emit("show-menu", "");
      } else {
        this.isOpenContextMenu = true;
        // Xét vị trị của menu context theo vị trí của nút
        const menuWidth = 120;
        const marginTop = 12;
        const rect = event.target.getBoundingClientRect();
        this.contextMenuPostion.top = rect.bottom + marginTop + "px";
        this.contextMenuPostion.left = rect.right - menuWidth + "px";
        this.$emit("show-menu", this.colData[this.checkedKey]);
      }
    },

    /**
     * Xử lý việc đóng context menu
     * Author: ptrung26 (24/08/2023)
     */
    handleCloseContextMenu() {
      this.isOpenContextMenu = false;
    },

    /**
     * Xử lý chuyển đổi giá trị theo kiểu dữ liệu
     * Author: ptrung26 (20/10/2023)
     * @param {String} value
     */
    handleShowValueByType(value) {
      if (this.column?.dataType === this.$MISAEnum.DataType.Date) {
        return this.$helper.convertDate(value);
      }
      if (this.column?.dataType === this.$MISAEnum.DataType.Money) {
        let number = value
          ? parseInt(value.toString().replace(/\./g, ""), 10)
          : 0;
        return this.$helper.formatMoney(number);
      }

      return value;
    },

    /**
     * Xử lý hiện thị style nội dung cột theo định dạng tương ứng
     * Author: ptrung26 (25/10/2023)
     * @param {Object} column
     */
    handleConfigStyleCellText(column) {
      const styles = {
        display: "flex",
      };
      switch (column?.textStyle) {
        case this.$MISAEnum.ColumnTextStyle.Left: {
          styles["justify-content"] = "flex-start";
          styles["text-align"] = "left";
          break;
        }
        case this.$MISAEnum.ColumnTextStyle.Center: {
          styles["justify-content"] = "center";
          styles["text-align"] = "center";
          break;
        }

        case this.$MISAEnum.ColumnTextStyle.Right: {
          styles["justify-content"] = "flex-end";
          styles["text-align"] = "right";
          break;
        }
        default: {
          styles["justify-content"] = "flex-start";
          styles["text-align"] = "left";
          break;
        }
      }

      if (column?.dataType === this.$MISAEnum.DataType.Date) {
        styles["justify-content"] = "center";
      }
      if (column?.dataType === this.$MISAEnum.DataType.Number) {
        styles["justify-content"] = "right";
      }
      if (column?.dataType === this.$MISAEnum.DataType.Money) {
        styles["justify-content"] = "right";
        styles["text-align"] = "right";
      }

      return styles;
    },

    /**
     * Xử lý hiện thị style cột theo định dạng tương ứng
     * Author: ptrung26 (25/10/2023)
     */
    handleConfigColStyle() {
      if (this.colIndex === 0 && this.tableType === 1) {
        let defaultPadding = 12;
        let distanceWithParent = 10;
        this.style["padding-left"] =
          defaultPadding + (this.depth + 1) * distanceWithParent + "px";
      }

      if (this.column?.width) {
        let width = this.column.width;
        this.style.width = width + "px";
      }
      if (this.column?.minWidth) {
        let minWidth = this.column.minWidth;
        this.style.minWidth = minWidth + "px";
      }

      if (
        this.colData &&
        this.colData.children &&
        this.colData.children.length > 0
      ) {
        this.style["font-weight"] = "bold";
      } else {
        this.style["font-weight"] = "normal";
      }

      if (this.isShowCheckbox) {
        this.style["position"] = "sticky";
      }
    },

    /**
     * Xử lý khi check checkbox
     * Author: ptrung26 (29/10/2023)
     */
    handleOnChecked() {
      if (this.colData) {
        this.$emit("check-one", this.colData);
      }
    },
    /**
     * Xử lý khi thay đổi giá trị ở combobox
     * Author: ptrung26 (08/11/2023)
     */
    handleOnChangeCombobox(params) {
      const propValue = params.propValue;
      const item = params.value;
      this.$emit("updateCellData", {
        ...this.colData,
        [this.column?.field]: item[propValue],
      });
      this.$emit("combobox-update", params);
      if (params.inputValue) {
        this.value = params.inputValue;
      }
    },
    /**
     * Xử lý khi thay đổi giá trị ở combobox
     * Author: ptrung26 (08/11/2023)
     */
    handleOnChange(e) {
      let value = e.target.value;
      if (this.column?.dataType === this.$MISAEnum.DataType.Money) {
        value = parseInt(value.toString().replace(/\./g, ""), 10);
      }
      this.$emit("updateCellData", {
        ...this.colData,
        [this.column?.field]: value,
      });
    },

    /**
     * Xử lý sự kiện onInput
     * Author: ptrung26 (14/11/2023)
     */
    handleOnInput(e) {
      this.value = this.handleShowValueByType(e.target.value);
      this.handleOnChange(e);
    },

    /**
     * Xử lý sửa hàng
     * Author: ptrung26 (11/11/2023)
     */
    handleEdit() {
      this.$emit("edit-row", this.colData);
    },

    /**
     * Xử lý xóa hàng
     * Author: ptrung26 (11/11/2023)
     */
    handleDelete() {
      this.handleCloseContextMenu();
      this.$emit("delete-row", this.colData);
    },

    /**
     * Xử lý nhân bản row
     * Author: ptrung26 (11/11/2023)
     */
    handleReplication() {
      this.handleCloseContextMenu();
      this.$emit("replication-row", this.colData);
    },

    /**
     * Xử lý ngừng sử dụng
     * Author: ptrung26 (11/11/2023)
     */
    handleInactive() {
      this.handleCloseContextMenu();
      this.$emit("inactive-row", this.colData);
    },

    /**
     * Xử lý khi column button click
     * Author: ptrung26 (12/11/2023)
     */
    handleOnColButtonExecute() {
      if (this.tableMode === this.$MISAEnum.TableMode.View) {
        return;
      }
      if (this.column?.method) {
        switch (this.column.method) {
          case this.$MISAEnum.TableMethod.Edit:
            this.$emit("edit-row", this.colData);
            break;
          case this.$MISAEnum.TableMethod.Delete:
            this.$emit("delete-row", this.colData);
            break;
          case this.$MISAEnum.TableMethod.DeleteOne: {
            this.$emit("delete-row-one", this.rowIndex);
            break;
          }
          case this.$MISAEnum.TableMethod.Replication:
            this.$emit("replication-row", this.colData);
            break;
        }
      }
    },

    /**
     * Xử lý khi giá trị combobox invalid
     * Author: ptrung26 (14/11/2023)
     * @param {String} message message lỗi
     */
    handleValidateCombobox(message) {
      this.comboboxError = message;
      this.$emit("value-invalid", {
        field: this.column.field,
        message,
        rowIndex: this.rowIndex,
        colIndex: this.colIndex,
      });
    },

    /**
     * Xử lý focus vào cell mong muốn
     * Author: ptrung26 (20/11/2023)
     * @param {int} rowIndex
     * @param {int} cellIndex
     */
    handleSetFocusCell(rowIndex, cellIndex) {
      if (this.$refs.tbody) {
        this.$refs.tbody.handleSEtFocusCell(rowIndex, cellIndex);
      }
    },

    /**
     * Xử lý sự kiện keydown tab
     * Author: ptrung26 (26/11/2023)
     */
    handleKeyDownTab(event) {
      if (event.shiftKey && event.key === "Tab") {
        if (this.colIndex === 0) {
          event.preventDefault();
          this.$emit("focus-previous-row", {
            rowIndex: this.rowIndex,
            colIndex: this.colLength - 1,
          });
        }
      } else {
        if (this.colIndex === this.colLength - 1) {
          event.preventDefault();
          this.$emit("focus-next-row", {
            rowIndex: this.rowIndex,
            colIndex: 0,
          });
        }
      }

      this.$emit("cell-click", null);
    },

    /**
     * Xử lý khi td click
     * Author: ptrung26 (25/11/2023)
     */
    handleCellClick() {
      if (!this.column) {
        return;
      }
      if (
        this.column.columnType === this.$MISAEnum.ColumnType.Combobox ||
        this.column.columnType === this.$MISAEnum.ColumnType.Input
      ) {
        this.$emit("cell-click", {
          colIndex: this.colIndex,
          rowIndex: this.rowIndex,
          data: this.colData,
        });
      }
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus();
        }
        if (this.$refs.combobox) {
          this.$refs.combobox.focus();
        }
      });
    },

    /**
     * Xử lý focus vào cell tương ứng
     * Author: ptrung26 (25/11/2023)
     */
    focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
      if (this.$refs.combobox) {
        this.$refs.combobox.focus();
      }
    },

    /**
     * Xử lý phím mũi tên để lên hàng tiếp theo
     * @param {Boolean} isUp trạng thái lên hay xuống
     */
    handleIntoRow(isUp) {
      if (isUp)
        this.$emit("focus-previous-row", {
          rowIndex: this.rowIndex,
          colIndex: this.colIndex,
        });
      else {
        this.$emit("focus-next-row", {
          rowIndex: this.rowIndex,
          colIndex: this.colIndex,
        });
      }
    },
  },
  watch: {
    data: {
      handler(newValue) {
        this.colData = { ...newValue };
        // Xử lý format lại giá trị
        if (
          this.colData &&
          this.column?.field &&
          this.column?.columnType !== this.$MISAEnum.ColumnType.Combobox
        ) {
          let inputValue = this.handleShowValueByType(
            this.colData[this.column.field]
          );
          this.value = inputValue;
          // if (
          //   inputValue !== undefined &&
          //   inputValue !== null &&
          //   inputValue !== ""
          // ) {
          //   this.value = inputValue;
          // }
        } else if (this.column?.value) {
          this.value = this.handleShowValueByType(this.column.value);
        }
      },
      immediate: true,
    },
    currentMenuId: {
      handler(newValue) {
        if (newValue === this.colData[this.checkedKey]) {
          this.isOpenContextMenu = true;
        } else {
          this.isOpenContextMenu = false;
        }
      },
    },
    error: {
      handler(newValue) {
        this.inputError = newValue;
        this.comboboxError = newValue;
      },
      immediate: true,
    },
    isToggleAll: {
      handler(newValue) {
        this.isOpen = newValue;
      },
      immediate: true,
    },
  },
  data() {
    return {
      isOpen: false,
      value: "",
      style: {},
      inputError: "",
      comboboxError: "",
      colData: this.data,
      isOpenContextMenu: false,
      contextMenuPostion: {
        top: 0,
        left: 0,
      },
    };
  },
  created() {
    this.handleConfigColStyle();
  },

  updated() {
    this.handleConfigColStyle();
  },
};
</script>

<template>
  <template v-if="isShowIndex">
    <td :class="`m-td`" :style="{ 'max-width': '60px', width: '60px' }">
      <div class="parent-cell justify-center" v-if="!isFooter">
        {{ rowIndex + 1 }}
      </div>
    </td>
  </template>
  <template v-else-if="isShowCheckbox && !isFooter">
    <td :class="`m-td`" :style="{ 'max-width': '60px', width: '60px' }">
      <div class="parent-cell justify-center">
        <m-input-checkbox
          @click="handleOnChecked(colData)"
          :checked="checkedList.includes(colData && colData[checkedKey])"
        />
      </div></td
  ></template>
  <template v-else-if="isShowMethod">
    <td :class="`m-td`" :style="style">
      <template v-if="!isFooter">
        <div class="parent-cell" :style="handleConfigStyleCellText(column)">
          <div class="grid w-full justify-center align-center">
            <button
              class="m-td-edit p-r-6"
              v-if="options.includes($MISAEnum.TableMethod.View)"
              @click="handleEdit"
            >
              Xem
            </button>
            <button
              class="m-td-edit p-r-6"
              v-if="options.includes($MISAEnum.TableMethod.Edit)"
              @click="handleEdit"
            >
              Sửa
            </button>
            <button class="m-td-menu">
              <span
                class="m-icon m-icon-arrow-down-blue"
                @click="handleOpenContextMenu($event)"
                @dblclick="preventDblClickEvent($event)"
              ></span>
            </button>
            <teleport to="body">
              <div
                class="m-context-menu"
                :style="contextMenuPostion"
                v-if="isOpenContextMenu"
                v-click-outside="handleCloseContextMenu"
              >
                <div
                  class="m-context-menu-item"
                  @click="handleReplication"
                  v-if="options.includes($MISAEnum.TableMethod.Replication)"
                >
                  Nhân bản
                </div>
                <div
                  class="m-context-menu-item"
                  @click="handleDelete"
                  v-if="options.includes($MISAEnum.TableMethod.Delete)"
                >
                  Xóa
                </div>
                <div
                  class="m-context-menu-item"
                  @click="handleInactive"
                  v-if="options.includes($MISAEnum.TableMethod.InActive)"
                >
                  {{ colData.inActive ? "Sử dụng" : "Ngừng sử dụng" }}
                </div>
              </div>
            </teleport>
          </div>
        </div>
      </template>
    </td>
  </template>
  <template v-else>
    <td :class="`m-td`" :style="style" @click.capture="handleCellClick">
      <div class="parent-cell" :style="handleConfigStyleCellText(column)">
        <div
          :style="{ width: '16px', height: '16px' }"
          v-if="
            tableType === 1 &&
            column?.columnType === this.$MISAEnum.ColumnType.View &&
            colIndex === 0
          "
        >
          <template v-if="column?.expander && colData[parentKey]">
            <m-button-icon
              :class="{
                'm-icon-expand': !isOpen,
                'm-icon-collapse': isOpen,
              }"
              @click.stop="toggle"
              @dblclick="preventDblClickEvent"
            ></m-button-icon>
          </template>
        </div>
        <template v-if="column?.columnType === this.$MISAEnum.ColumnType.View"
          >{{
            column.enum !== undefined && column.enum !== null
              ? column.enum.get(value)
              : value
          }}
        </template>
        <template
          v-else-if="column?.columnType === this.$MISAEnum.ColumnType.Input"
        >
          <template
            v-if="
              (tableMode === this.$MISAEnum.TableMode.ViewAndEdit &&
                isEditMode) ||
              tableMode === this.$MISAEnum.TableMode.Default
            "
          >
            <m-input
              :value="value"
              class="w-full bg-white"
              @change="handleOnChange"
              :style="handleConfigStyleCellText(column)"
              @input="handleOnInput"
              :inputType="column?.dataType"
              :inputError="inputError"
              :maxlength="column?.maxlength"
              @keydown.tab="handleKeyDownTab"
              @keydown.down="handleIntoRow(false)"
              @keydown.up="handleIntoRow(true)"
              :tabindex="tabindex"
              ref="input"
            ></m-input>
          </template>
          <template v-else>
            {{ value }}
          </template>
          <div class="error-messsage" v-if="inputError">
            <m-tooltip
              position="bottom"
              :text="inputError"
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template v-slot:children>
                <div class="m-icon m-icon-exclamation-cell--error"></div>
              </template>
            </m-tooltip>
          </div>
        </template>
        <template
          v-else-if="column?.columnType === this.$MISAEnum.ColumnType.Combobox"
        >
          <template
            v-if="
              (tableMode === this.$MISAEnum.TableMode.ViewAndEdit &&
                isEditMode) ||
              tableMode === this.$MISAEnum.TableMode.Default
            "
          >
            <m-combobox
              :list="column?.list"
              :urlAPI="column?.urlAPI"
              :propText="column?.propText"
              :propValue="column?.propValue"
              :cbbType="column?.cbbType"
              :isEditMode="isEditMode"
              :columns="column?.tableColumns"
              :width="column?.width"
              :defaultValue="{
                [column?.propText]: colData[column?.text],
                [column?.propValue]: colData[column?.field],
              }"
              @update-combobox="handleOnChangeCombobox"
              :name="column?.name"
              :validator="column?.validator"
              @show-error="handleValidateCombobox"
              :messageNotFound="column?.messageNotFound"
              :comboboxError="comboboxError"
              class="w-full"
              :checkedKey="column?.checkedKey"
              @keydown-tab="handleKeyDownTab"
              @keydown-up="handleIntoRow(true)"
              @keydown-down="handleIntoRow(false)"
              ref="combobox"
              :position="column?.position"
              :minWidth="column?.comboboxWidth"
              :tabindex="tabindex"
              :text="value"
            ></m-combobox>
          </template>
          <template v-else>
            {{ colData[column?.text] || value }}
          </template>
          <div class="error-message" v-if="comboboxError">
            <m-tooltip
              position="bottom"
              :text="comboboxError"
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template v-slot:children>
                <div class="m-icon m-icon-exclamation-cell--error"></div>
              </template>
            </m-tooltip>
          </div>
        </template>
        <template
          v-else-if="column?.columnType === this.$MISAEnum.ColumnType.Button"
        >
          <m-button-icon
            :class="column?.icon"
            @click="handleOnColButtonExecute"
            :disable="tableMode === $MISAEnum.TableMode.View"
          ></m-button-icon>
        </template>
      </div>
    </td>
  </template>
</template>

<style scoped></style>
