<script>
import MButton from "../button/MButton.vue";
import MPopup from "./MPopup.vue";
export default {
  props: {
    type: Number,
  },
  components: {
    MButton,
    MPopup,
  },
  methods: {
    /**
     * Reset dialog về các tham số mặc định
     * Author: ptrung26 (31/08/2023)
     */
    default() {
      this.isOpenDialog = false;
      this.title = undefined;
      this.message = undefined;
      this.backButton = null;
      this.cancelButton = null;
      this.resolvePromise = undefined;
      this.rejectPromise = undefined;
    },
    /**
     * Xử lý hiện thị dialog
     * Author: ptrung26 (31/08/2023)
     * @param {object} opts đối tượng các tham số muốn truyền vào để hiện thị trên dialog
     */
    show(opts = {}) {
      this.default();
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }
      if (opts.backButton) {
        this.backButton = opts.backButton;
      }
      if (opts.icon) {
        this.icon = opts.icon;
      }

      this.$refs.popup.open();

      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },

    /**
     * Khi xác nhận action được thực hiện
     * Author: ptrung26 (31/08/2023)
     */
    _confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },

    /**
     * Khi muốn hủy bỏ action
     * Author: ptrung26 (31/08/2023)
     */
    _cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    },
    /**
     * đóng dialog và không thực hiện gì cả
     * Author: ptrung26 (31/08/2023)
     */
    _back() {
      this.$refs.popup.close();
    },
  },
  data() {
    return {
      isOpenDialog: false,
      title: undefined,
      message: undefined,
      icon: "m-icon-warning",
      backButton: null,
      cancelButton: null,
      resolvePromise: undefined,
      rejectPromise: undefined,
    };
  },
};
</script>

<template>
  <m-popup ref="popup">
    <div class="m-dialog-box">
      <div class="m-dialog-header">
        <h3 class="m-dialog-title">{{ title }}</h3>
      </div>
      <p class="m-dialog-message">
        <span class="m-icon" :class="icon"></span>
        <span>{{ message }}</span>
      </p>
      <div class="m-dialog-footer">
        <div class="m-dialog-footer-left">
          <m-button class="m-btn-seconary" v-if="backButton" @click="_back">{{
            backButton
          }}</m-button>
        </div>
        <div class="m-dialog-footer-right">
          <m-button
            class="m-btn-seconary"
            v-if="cancelButton"
            @click="_cancel"
            >{{ cancelButton }}</m-button
          >
          <m-button @click="_confirm" v-focus>{{ okButton || "Ok" }}</m-button>
        </div>
      </div>
    </div>
  </m-popup>
</template>

<style scoped>
@import url(@/css/components/dialog.css);
</style>
