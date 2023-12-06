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
  <button
    class="m-icon"
    :class="{
      disable: disable,
    }"
  ></button>
</template>

<style scoped>
.disable {
  cursor: default;
}
</style>
