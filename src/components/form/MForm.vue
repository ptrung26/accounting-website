<script>
export default {
  props: {
    title: {
      type: String,
    },
    alertErrorMessage: {
      type: String,
    },
  },
  methods: {
    /**
     * Xử lý sự kiện đóng form
     * Author: ptrung26 (19/08/2023)
     * Modified by: ptrung26 (29/09/2023)
     */
    async handleClosePopup() {
      this.$emitter.emit("onCloseDialog");
    },

    /**
     * Xử lý sự kiện đóng form
     * Author: ptrung26 (19/08/2023)
     */
    handleOnCloseDialog() {
      this.alertErrorMessage = "";
    },
  },
};
</script>

<template>
  <div class="m-popup">
    <div class="m-popup-box">
      <div class="m-popup-header">
        <h3 class="m-popup-title">{{ title }}</h3>
      </div>
      <div class="m-popup-body">
        <template>
          <slot name="popup-body"></slot>
        </template>
      </div>
      <div class="m-popup-footer">
        <m-button
          class="m-btn-seconary"
          @click="handleOnCloseForm"
          tabindex="20"
          >Hủy</m-button
        >
        <div>
          <m-button
            class="m-btn-seconary m-r-6"
            @click="handleOnSubmit($MISAEnum.AddStatus.Add)"
            tabindex="19"
            >Cất</m-button
          >
          <m-button
            class="p-l-12"
            @click="handleOnSubmit($MISAEnum.AddStatus.AddAndSave)"
            tabindex="18"
            >Cất và thêm</m-button
          >
        </div>
      </div>

      <div class="m-popup-actions">
        <m-tooltip position="top" text="Giúp (F1)">
          <template v-slot:children>
            <m-button-icon class="m-icon-help"></m-button-icon>
          </template>
        </m-tooltip>
        <m-tooltip position="top" text="Đóng (ESC)">
          <template v-slot:children>
            <m-button-icon
              class="m-icon-close"
              v-keyboard-esc="handleOnCloseForm"
              @click="handleOnCloseForm"
              tabindex="0"
            ></m-button-icon>
          </template>
        </m-tooltip>
      </div>
    </div>
    <Teleport to="body">
      <!-- Error Popup -->
      <m-dialog ref="dialog"></m-dialog>
    </Teleport>
  </div>
</template>

<style scoped></style>
