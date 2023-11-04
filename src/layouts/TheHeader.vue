<script>
export default {
  methods: {
    /**
     * Thay đổi định dạng hiện thị của date
     * Author: ptrung26 (06/10/2023)
     * @param {int} dateType giá trị của định dạng
     */
    handleChangeDateType(dateType) {
      this.dateTypeValue = dateType;
      localStorage.setItem("dateType", dateType);
      location.reload();
    },
  },
  data() {
    return {
      // Định dạng ngày tháng
      dateTypes: [
        {
          label: this.$MISAResource.VI.dateTypeLabel.dd__mm__yyyy,
          value: this.$MISAEnum.DateType.dd__mm__yyyy,
        },
        {
          label: this.$MISAResource.VI.dateTypeLabel.yyyy__mm__dd,
          value: this.$MISAEnum.DateType.yyyy__mm__dd,
        },
        {
          label: this.$MISAResource.VI.dateTypeLabel.mm__dd__yyyy,
          value: this.$MISAEnum.DateType.mm__dd__yyyy,
        },
      ],
      dateTypeValue: parseInt(localStorage.getItem("dateType")),
    };
  },
  computed: {
    /**
     * Trả về định dạng ngày tháng hiện tại
     * Author: ptrung26 (07/10/2023)
     */
    currentDateType() {
      let dateType = {
        label: "",
        value: -1,
      };
      for (let { label, value } of this.dateTypes) {
        if (this.dateTypeValue === value) {
          dateType.label = label;
          dateType.value = value;
        }
      }
      return dateType;
    },
  },
};
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="logo-container">
        <a href="/" class="m-icon m-icon-toggle"></a>
        <a href="/" class="logo"></a>
      </div>
      <m-button-icon class="m-three-stripes"></m-button-icon>
      <h3 class="header-brand">
        CÔNG TY TNHH SONG VIỆT - Misatest (Chi nhánh Đà Nẵng)
      </h3>
    </div>
    <div class="header-right">
      <m-combobox
        :list="dateTypes"
        name="dateType"
        :defaultValue="currentDateType"
        :onItemChange="handleChangeDateType"
        :style="{ 'margin-right': '12px' }"
        position="bottom"
        :editable="false"
      />
      <div class="header-actions">
        <m-button-icon class="m-icon-bell"></m-button-icon>
      </div>
      <div class="user-feature">
        <span class="user-image"></span>
        <m-combo-button
          class="user-btn"
          text="Phạm Việt Trung"
          icon="m-icon-arrow-down"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url(../css/layouts/header.css);
</style>
