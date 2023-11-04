<script>
export default {
  data: () => ({
    isVisible: false,
  }),

  methods: {
    open() {
      this.isVisible = true;
    },

    close() {
      this.isVisible = false;
    },
  },
};
</script>

<template>
  <div class="m-dialog" v-if="isVisible">
    <slot></slot>
  </div>
</template>

<style scoped>
@import url(@/css/components/dialog.css);
</style>
