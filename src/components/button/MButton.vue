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
  <button class="m-btn" type="button" :disabled="disable">
    <slot></slot>
  </button>
</template>

<style scoped>
@import url(@/css/components/button.css);
</style>
