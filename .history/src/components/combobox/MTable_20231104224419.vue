<template>
  <table class="m-combobox-table">
    <thead class="m-combobox-thead">
      <tr class="m-combobox-tr">
        <th
          class="m-combobox-th"
          v-for="(column, index) in columns"
          :key="index"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody class="m-combobox-tbody">
      <tr
        class="m-combobox-tr"
        :class="{ 'm-combobox-tr--selected': item.uuid === selectedId }"
        v-for="(item, index) in tableData"
        :key="index"
        @click="handleOnTrClick(item)"
      >
        <td
          class="m-combobox-td"
          :class="`td-level-${item.grade}`"
          v-for="(column, index) in columns"
          :key="index"
        >
          {{ item[column.field] }}
        </td>
      </tr>
    </tbody>
  </table>
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
  },
  data() {
    return {
      tableData: this.data,
    };
  },
  watch: {
    data: {
      handler(newValue) {
        this.tableData = newValue;
      },
    },
  },
};
</script>
