<script>
export default {
  props: ["text", "icon"],
  setup() {},
};
</script>

<template>
  <button class="m-combo-btn">
    <span>{{ text }}</span>
    <span class="m-icon" :class="icon"></span>
    <slot name="action"></slot>
  </button>
</template>

<style scoped></style>
