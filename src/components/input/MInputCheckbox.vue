<script>
export default {
  methods: {
    /**
     * Xử lý sự kiện enter keyboard thay đổi
     * Author: ptrung26 (21/11/2023)
     * @param {Object} event
     */
    handleKeyPress(event) {
      if (event.key === "Enter") {
        const checkbox = this.$refs.checkbox;
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          this.$emit("keyboard-enter", event);
        }
      }
    },

    /**
     * Xử lý khi focus vào checkbox
     * Author: ptrung26 (12/11/2023)
     */
    handleOnFocus() {
      this.isFocus = true;
    },

    /**
     * Xử lý khi blur ra khỏi checkbox
     * Author: ptrung26 (12/11/2023)
     */
    handleOnBlur() {
      this.isFocus = false;
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
};
</script>

<template>
  <input
    type="checkbox"
    class="m-checkbox-input"
    :class="{ 'm-checkbox-input--focus': isFocus }"
    tabindex="0"
    @keypress="handleKeyPress"
    @focus="handleOnFocus"
    @blur="handleOnBlur"
    ref="checkbox"
  />
</template>

<style scoped>
@import url(@/css/components/input.css);
</style>
