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
    hasSelectBox: {
      type: Boolean,
      default: false,
    },
    idx: {
      type: Number,
      default: -1,
    },
    isParentKey: {
      type: String,
      default: "",
    },
  },
  methods: {
    /**
     * Xử lý đóng mở item con
     * Author: ptrung26 (20/10/2023)
     */
    toggle() {
      this.isOpen = !this.isOpen;
      this.onToggle(this.isOpen, this.data);
    },
    /**
     * Chặn sự kiện double click nếu click nhanh
     * Author: ptrung26 (30/09/2023)
     */
    preventDblClickEvent(event) {
      event.stopPropagation();
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

      return value;
    },

    /**
     * Xử lý hiện thị style cột theo định dạng tương ứng
     * Author: ptrung26 (25/10/2023)
     * @param {Object} column
     */
    handleShowStyleCellByType(column) {
      const styles = {};
      switch (column?.textStyle) {
        case this.$MISAEnum.ColumnTextStyle.Left:
          styles["justify-content"] = "left";
          break;
        case this.$MISAEnum.ColumnTextStyle.Center:
          styles["justify-content"] = "center";
          break;
        case this.$MISAEnum.ColumnTextStyle.Right:
          styles["justify-content"] = "right";
          break;
        default:
          styles["justify-content"] = "left";
      }

      if (column?.dataType === this.$MISAEnum.DataType.Date) {
        styles["justify-content"] = "center";
      }
      if (column?.dataType === this.$MISAEnum.DataType.Number) {
        styles["justify-content"] = "right";
      }

      return styles;
    },

    /**
     * Xử lý khi check combobox ở item
     * Author: ptrung26 (29/10/2023)
     */
    handleOnChecked() {
      if (this.data?.uuid) {
        this.$emitter.emit("onCheckedOne", this.data.uuid);
      }
    },
  },

  computed: {
    value() {
      let _v;
      if (this.data && this.column?.field) {
        _v = this.data[this.column.field];
      } else if (this.column?.value) {
        _v = this.column.value;
      } else {
        _v = "";
      }

      return this.handleShowValueByType(_v);
    },
  },

  data() {
    return {
      isOpen: false,
      style: {},
    };
  },

  created() {
    if (this.idx === 0) {
      let defaultPadding = 16;
      let distanceWithParent = 10;
      this.style["padding-left"] =
        defaultPadding + this.depth * distanceWithParent + "px";
    }
    if (this.column?.width) {
      let width = this.column.width;
      this.style.width = width + "px";
    }
    if (this.depth === 0 && this.data && this.data[this.isParentKey]) {
      this.style["font-weight"] = "bold";
    }
  },
};
</script>

<template>
  <template v-if="hasSelectBox">
    <td :class="`m-td`" :style="{ 'max-width': '60px', width: '60px' }">
      <div class="parent-cell justify-center">
        <m-input-checkbox
          @click="handleOnChecked(data)"
          :checked="checkedList.includes(data?.uuid)"
        />
      </div></td
  ></template>
  <template v-else>
    <td :class="`m-td`" :style="style">
      <div class="parent-cell" :style="handleShowStyleCellByType(column)">
        <template v-if="column?.expander && data[isParentKey]">
          <m-button-icon
            :class="{
              'm-icon-expand': !isOpen,
              'm-icon-collapse': isOpen,
            }"
            @click.stop="toggle"
            @dblclick="preventDblClickEvent"
          ></m-button-icon>
        </template>
        <template
          v-if="column?.columnType === this.$MISAEnum.ColumnType.View"
          >{{ column?.enum ? column.enum.get(value) : value }}</template
        >
        <template
          v-else-if="column?.columnType === this.$MISAEnum.ColumnType.Input"
          ><m-input :value="value"></m-input
        ></template>
        <template
          v-else-if="column?.columnType === this.$MISAEnum.ColumnType.Combobox"
        >
          <m-combobox
            :list="column?.list"
            :urlAPI="column?.urlAPI"
            :propText="column?.propText"
            :propValue="column?.propValue"
            :cbbType="column?.cbbType"
            :columns="column?.tableColumns"
            :width="column?.width"
          ></m-combobox>
        </template>
        <slot name="body"></slot>
      </div>
    </td>
  </template>
</template>

<style scoped></style>
