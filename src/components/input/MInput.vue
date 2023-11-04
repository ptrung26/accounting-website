<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <input
    type="text"
    class="m-input"
    ref="input"
    :readonly="disable"
    :disabled="disable"
  />
</template>

<style scoped>
@import url(@/css/components/input.css);
</style>
