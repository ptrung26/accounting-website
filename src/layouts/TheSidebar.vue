<script>
export default {};
</script>

<template>
  <div class="sidebar">
    <nav>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-dashboard"></span>
        <span>Tổng quan</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sider-bank"></span>
        <span>Tiền gửi</span>
      </router-link>
      <router-link to="/CA/CAProcess" class="sidebar-item">
        <span class="m-icon m-icon-sidebar-cash"></span>
        <span>Tiền mặt</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sider-pu"></span>
        <span>Mua hàng</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sidebar-sale"></span>
        <span>Bán hàng</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sidebar-invoice"></span>
        <span>Quản lý hóa đơn</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sidebar-stock"></span>
        <span>Kho</span>
      </router-link>
      <router-link to="/" class="sidebar-item">
        <span class="m-icon m-icon-sidebar-tools"></span>
        <span>Công cụ dụng cụ</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
@import url(../css/layouts/sidebar.css);
</style>
