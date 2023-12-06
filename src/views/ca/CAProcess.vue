<script>
export default {
  name: "CAProcess",
};
</script>

<template>
  <div class="caprocess">
    <div class="caprocess-utils">
      <div class="caprocess-area">
        <div class="div-face-button receive">
          <p class="title-button">Thu tiền</p>
        </div>
        <div class="div-face-button audit">
          <p class="title-button">Chi tiền</p>
        </div>
        <div class="div-face-button payment">
          <p class="title-button">Kiểm tra quỹ</p>
        </div>
      </div>
      <div class="caprocess-toolbar">
        <router-link to="/CAAccount" class="div-face-button">
          <div class="m-icon m-icon-calculator"></div>
          <p class="title-button">Hệ thống tài khoản</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url(@/css/views/ca/caprocess.css);
</style>
