<template>
  <div>
    <table class="m-combobox-table">
      <thead class="m-combobox-thead">
        <tr class="m-combobox-tr">
          <th
            class="m-combobox-th"
            v-for="(column, index) in columns"
            :key="index"
            :style="handleSetStyle(column)"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="m-combobox-tbody">
        <template v-if="tableData.length > 0">
          <tr
            class="m-combobox-tr"
            :class="{
              'm-combobox-tr--focus': item[checkedKey] === navId,
              'm-combobox-tr--selected': selectedId === item[checkedKey],
            }"
            v-for="(item, index) in tableData"
            :key="index"
            @click="handleOnTrClick(item)"
            ref="tr"
          >
            <td
              class="m-combobox-td"
              :class="`td-level-${item.grade}`"
              v-for="(column, index) in columns"
              :key="index"
              :style="handleSetStyle(column, item)"
            >
              {{ item[column.field] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p
      v-if="tableData.length === 0"
      style="padding: 16px; background-color: #fff; text-align: center"
    >
      Không có giá trị nào
    </p>
  </div>
</template>

<script>
export default {
  name: "MComboboxTable",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    onTrClick: {
      type: Function,
      default: () => {},
    },
    selectedId: {
      type: String,
      default: "",
    },

    checkedKey: {
      type: String,
      default: "",
    },
    focusId: {
      type: String,
      default: "",
    },
  },
  methods: {
    /**
     * Xử lý khi click vào item trong combobox
     * Author: ptrung26 (22/10/2023)
     * @param {object} item
     */
    handleOnTrClick(item) {
      this.onTrClick(item);
    },

    /**
     * Config style cho column
     * Author: ptrung26 (22/10/2023)
     * @param {Object} column
     * @param {Object} item
     */
    handleSetStyle(column, item) {
      let style = {};
      if (column.width) {
        style.width = column.width + "px";
      }

      if (column.minWidth) {
        style["min-width"] = column.minWidth + "px";
      }

      if (item?.isParent) {
        style["font-weight"] = "bold";
      }

      return style;
    },

    /**
     * Xử lý sự kiện keydown
     * Author: ptrung26 (12/11/2023)
     * @param {Object} event
     */
    handleKeyDown(event) {
      let selectedItem = null;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        selectedItem = this.data[this.selectedIndex];
        this.navId = selectedItem[this.checkedKey];
        this.$refs.tr[this.selectedIndex].scrollIntoView({
          block: "center",
          inline: "start",
          behavior: "smooth",
        });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.data.length - 1
        );
        selectedItem = this.data[this.selectedIndex];
        this.navId = selectedItem[this.checkedKey];
        this.$refs.tr[this.selectedIndex].scrollIntoView({
          block: "center",
          inline: "start",
          behavior: "smooth",
        });
      }
      if (event.key === "Enter" && this.selectedIndex !== -1) {
        event.preventDefault();
        selectedItem = this.data[this.selectedIndex];
        this.navId = selectedItem[this.checkedKey];
        this.handleOnTrClick(selectedItem);
      }
    },
  },
  data() {
    return {
      tableData: this.data,
      selectedIndex: -1,
      navId: this.focusId,
    };
  },
  watch: {
    data: {
      handler(newValue) {
        this.tableData = newValue;
      },
    },
    focusId: {
      handler(newValue) {
        this.navId = newValue;
      },
      immediate: true,
    },
  },
  created() {
    if (this.selectedId) {
      let index = this.tableData.findIndex(
        (item) => item[this.checkedKey] === this.selectedId
      );
      if (index >= 0) {
        this.selectedIndex = index;
        this.$nextTick(() => {
          this.$refs.tr[index].scrollIntoView({
            block: "center",
            inline: "start",
            behavior: "smooth",
          });
        });
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
};
</script>

<style scoped>
@import url(@/css/components/combobox.css);
</style>
