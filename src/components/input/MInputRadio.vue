<script>
export default {
  props: {
    name: String,
    tabindex: Number,
    label: String,
    onChange: Function,
    value: Number,
    checked: Boolean,
  },
  methods: {
    /**
     * Xử lý việc chọn radio input
     * Author: ptrung26 (01/10/2023)
     */
    handleSetChecked() {
      this.$refs.radio.checked = true;
    },
  },
};
</script>

<template>
  <label
    class="m-radio m-r-20"
    v-keyboard-enter="handleSetChecked"
    :for="label"
  >
    <input
      type="radio"
      :name="name"
      :id="label"
      :checked="checked"
      :value="value"
      class="m-radio-input"
      @change="onChange"
      ref="radio"
      :tabindex="tabindex"
    />
    {{ label }}
  </label>
</template>

<style scoped>
@import url(@/css/components/input.css);
</style>
