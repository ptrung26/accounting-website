<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    /**
     * Xử lý focus vào button
     * Author: ptrung26 (25/11/2023)
     */
    focus() {
      this.$refs.btn.focus();
    },
  },
};
</script>

<template>
  <button
    class="m-btn"
    type="button"
    :disabled="disable"
    ref="btn"
    :class="{ disable: disable }"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
@import url(@/css/components/button.css);
</style>
