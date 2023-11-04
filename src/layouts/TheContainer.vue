<script>
import { RouterView } from "vue-router";
export default {
  setup() {
    RouterView;
  },
};
</script>

<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
@import url(../css/layouts/container.css);
</style>
