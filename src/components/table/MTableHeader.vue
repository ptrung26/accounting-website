<script>
import MInputCheckbox from "../input/MInputCheckbox.vue";
export default {
  components: { MInputCheckbox },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    isShowMethod: {
      type: Boolean,
      default: true,
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
      default: null,
    },
    tableType: {
      type: Number,
      default: 0,
    },
  },
  emits: ["check-all"],
  methods: {
    /**
     * Xử lý hiện thị style cột theo định dạng tương ứng
     * Author: ptrung26 (25/10/2023)
     * @param {Object} column
     */
    handleShowStyleCellByType(column) {
      const styles = {};
      styles.display = "flex";

      if (column?.dataType === this.$MISAEnum.DataType.Date) {
        styles["justify-content"] = "center";
        styles["text-align"] = "center";
      }
      if (
        column?.dataType === this.$MISAEnum.DataType.Number ||
        column?.dataType === this.$MISAEnum.DataType.Money
      ) {
        styles["justify-content"] = "flex-end";
        styles["text-align"] = "right";
      }

      if (column?.width) {
        styles["width"] = column.width + "px";
      }

      if (column?.minWidth) {
        styles["min-width"] = column.minWidth + "px";
      }

      return styles;
    },

    /**
     * Xử lý checked tất cả item
     */
    handleOnCheckedAll(e) {
      let checked = e.target.checked;
      this.$emit("check-all", checked);
    },
  },
  watch: {
    isCheckAll: {
      handler(newValue) {
        this.$refs.checkbox.$refs.checkbox.checked = newValue;
      },
    },
  },
  computed: {
    isCheckedAll() {
      return this.isCheckAll;
    },
  },
};
</script>

<template>
  <thead class="m-thead">
    <tr class="m-tr">
      <th
        class="m-th"
        v-if="isShowIndex"
        :style="{ 'max-width': '60px', width: '60px', 'text-align': 'center' }"
      >
        #
      </th>
      <th
        class="m-th"
        v-if="isShowCheckbox"
        :style="{ 'max-width': '60px', width: '60px' }"
      >
        <div class="parent-cell justify-center">
          <m-input-checkbox
            :checked="isCheckedAll"
            @change="handleOnCheckedAll"
            ref="checkbox"
          />
        </div>
      </th>
      <th class="m-th" v-for="(column, index) in columns" :key="index">
        <div
          class="parent-cell w-full"
          :style="handleShowStyleCellByType(column)"
        >
          <m-tooltip :text="column.tooltip" v-if="column.tooltip">
            <template v-slot:children> {{ column.label }} </template>
          </m-tooltip>
          <template v-else> {{ column.label }}</template>
        </div>
      </th>
      <th class="m-th" v-if="isShowMethod">
        <div class="parent-cell justify-center">Chức năng</div>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
