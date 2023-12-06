<script>
export default {
  emits: ["update:modelValue", "update:error"],
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
    validator: {
      type: Function,
      default: () => {},
    },
    inputType: {
      type: Number,
      default: -1,
    },
    inputError: {
      type: String,
      default: "",
    },
    modelValue: null,
  },
  data() {
    return {
      error: "",
    };
  },
  methods: {
    /**
     * Xử lý khi input thay đổi giá trị
     * Author: ptrung26 (08/10/2023)
     */
    updateModelValue(event) {
      let val = event.target.value;
      this.error = this.validator(val);
      this.$emit("update:error", this.error);
      this.$emit("update:modelValue", val);
    },

    /**
     * Xử lý sự kiện validate input theo type
     * Author: ptrung26 (11/11/2023)
     */
    validateInput(event) {
      if (
        this.inputType === this.$MISAEnum.DataType.Number ||
        this.inputType === this.$MISAEnum.DataType.Money
      ) {
        const charCode = event.key.charCodeAt(0);
        if (charCode < 48 || charCode > 57) {
          event.preventDefault();
        }
      }
    },

    /**
     * Xử lý focus input
     * Author: ptrung26 (08/10/2023)
     */
    focus() {
      this.$refs.input.focus();
    },

    /**
     * Xử lý blur input
     * Author: ptrung26 (08/10/2023)
     */
    blur() {
      this.$refs.input.blur();
    },
  },

  created() {
    this.$emitter.emit("inputField", this);
  },
};
</script>

<template>
  <input
    type="text"
    class="m-input"
    ref="input"
    :class="{
      'm-input-disabed': disable,
      'm-input-error': inputError,
    }"
    @focus="focus"
    :readonly="disable"
    :disabled="disable"
    :value="modelValue"
    autocomplete="false"
    @input="updateModelValue"
    @keypress="validateInput"
  />
</template>

<style scoped>
@import url(@/css/components/input.css);

.m-input-disabed {
  background: transparent;
}
</style>
