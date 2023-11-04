<script>
import MInputCheckbox from "../input/MInputCheckbox.vue";
export default {
  components: { MInputCheckbox },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    isHasMethod: {
      type: Boolean,
      default: true,
    },
    hasSelectBox: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    /**
     * Xử lý hiện thị style cột theo định dạng tương ứng
     * Author: ptrung26 (25/10/2023)
     * @param {Object} column
     */
    handleShowStyleCellByType(column) {
      const styles = {};
      if (column?.dataType === this.$MISAEnum.DataType.Date) {
        styles["justify-content"] = "center";
      }
      if (column?.dataType === this.$MISAEnum.DataType.Number) {
        styles["justify-content"] = "right";
      }

      return styles;
    },

    /**
     * Xử lý checked tất cả item
     */
    handleonCheckedAll() {
      this.isCheckedAll = !this.isCheckedAll;
      this.$emitter.emit("onCheckedAll", this.isCheckedAll);
    },
  },

  data() {
    return {
      isCheckedAll: false,
      style: {},
    };
  },
  created() {
    if (this.column?.width) {
      let width = this.column.width;
      this.style.width = width + "px";
    }
  },
};
</script>

<template>
  <thead class="m-thead" style="style">
    <tr class="m-tr">
      <th
        class="m-th"
        v-if="hasSelectBox"
        :style="{ 'max-width': '60px', width: '60px' }"
      >
        <div class="parent-cell justify-center">
          <m-input-checkbox @click="handleonCheckedAll" />
        </div>
      </th>
      <th class="m-th" v-for="(column, index) in columns" :key="index">
        <div class="parent-cell" :style="handleShowStyleCellByType(column)">
          <m-tooltip :text="column.tooltip" v-if="column.tooltip">
            <template v-slot:children> {{ column.label }} </template>
          </m-tooltip>
          <template v-else> {{ column.label }}</template>
        </div>
      </th>
      <th class="m-th" v-if="isHasMethod">
        <div class="parent-cell justify-center">Chức năng</div>
      </th>
    </tr>
  </thead>
</template>

<style scoped></style>
