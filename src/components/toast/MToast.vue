<script>
export default {
  props: {
    id: Number,
    status: Number,
    message: String,
  },
  methods: {
    /**
     * Xử lý xóa toast message
     * Author: ptrung26 (20/08/2023)
     */
    handleCloseToast() {
      this.$emitter.emit("onCloseToast", this.id);
    },
  },
  data() {
    const MisaEnum = this.$MISAEnum;
    const MisaResource = this.$MISAResource;
    return {
      statusIcon: {
        [MisaEnum.ToastStatus.Warning]: {
          title: MisaResource.VI.Headers.Warning,
          name: "warning",
          url: require("@/assets/img/warning-icon.png"),
        },
        [MisaEnum.ToastStatus.Success]: {
          title: MisaResource.VI.Headers.Success,
          name: "success",
          url: require("@/assets/img/success-icon.png"),
        },
        [MisaEnum.ToastStatus.Info]: {
          title: MisaResource.VI.Headers.Info,
          name: "info",
          url: require("@/assets/img/info-icon.png"),
        },
        [MisaEnum.ToastStatus.Error]: {
          title: MisaResource.VI.Headers.Error,
          name: "error",
          url: require("@/assets/img/error-icon.png"),
        },
      },
    };
  },
};
</script>
<template>
  <div class="m-toast">
    <div class="m-toast-content">
      <img :src="statusIcon[status].url" alt="toast icon" />
      <p class="m-toast-message">
        <span :class="`m-toast-${statusIcon[status].name}`">{{
          statusIcon[status].title
        }}</span>
        <span>{{ message }}</span>
      </p>
    </div>
    <div class="m-toast-btn">
      <button
        className="m-icon m-icon-close--small m-toast-close"
        @click="handleCloseToast"
      ></button>
    </div>
  </div>
</template>

<style scoped>
@import url(@/css/components/toast.css);
</style>
