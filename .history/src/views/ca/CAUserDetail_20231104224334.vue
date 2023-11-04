<script>
import caUserService from "@/services/caUserService";
export default {
  props: {
    type: Number,
    caUser: {
      type: Object,
    },
    position: {
      type: String,
      default: "middle",
    },
  },
  methods: {
    /**
     * Xử lý sự kiện đóng form
     * Author: ptrung26 (19/08/2023)
     * Modified by: ptrung26 (29/09/2023)
     */
    async handleOnCloseForm() {
      // Kiểm tra các giá trị của input có giống với mặc định không
      if (
        JSON.stringify({ ...this.defaultValue }) !==
        JSON.stringify({ ...this.formValidator.values })
      ) {
        // Hiện thị dialog thông báo có lưu trữ lại dữ liệu trước khi đóng không
        const oke = await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Headers.Info,
          message: this.$MISAResource.VI.Dialog.SaveDataBeforeCloseForm,
          backButton: this.$MISAResource.VI.Dialog.backButton,
          cancelButton: this.$MISAResource.VI.Dialog.cancelButton,
          icon: "m-icon-info",
        });

        // Nếu ok thì thực hiện action ngược lại thì đóng form
        if (oke) {
          await this.handleOnSubmit();
        } else {
          this.$emitter.emit("onCloseForm");
        }
      } else {
        this.$emitter.emit("onCloseForm");
      }
    },

    /**
     * Xử lý sự kiện đóng form
     * Author: ptrung26 (19/08/2023)
     */
    handleOnCloseDialog() {
      this.alertErrorMessage = "";
    },

    /**
     * Xử lý sự kiện thay đổi giá trị input
     * Author: ptrung26 (19/08/2023)
     * Modified by ptrung26 (23/10/2023)
     * @param {object} e input event
     */
    handleOnChange(e) {
      // Lấy ra tên và giá trị của input
      let { name, value } = e.target;

      // Cập nhật giá trị của form
      this.formValidator.values[name] = value.trim();
      this.formValidator.touched[name] = true;
      // Validate các giá trị
      this.validator();
    },

    /**
     * Xử lý khi combobox thay đổi
     * Author: ptrung26 (23/10/2023)
     * @param {String} name Tên của combobox
     * @param {String} value giá trị thay đổi
     */
    handleOnChangeValueCombobox(name, value) {
      this.formValidator.values[name] = value;
      this.formValidator.touched[name] = true;
      this.validator();
    },

    /**
     * Xử lý khi thay đổi giá trị combobox
     * Author: ptrung26 (24/10/2023)
     * @param {*} e event input
     * @param {*} ref combobox ref nếu có
     */
    handleOnChangeCheckbox(e, ref) {
      const { checked, name } = e.target;
      this.formValidator.values[name] = checked;
      this.formValidator.touched[name] = true;
      // Nếu checkbox là false thì set lại combobox về mặc định của nó nếu có
      if (!checked) {
        if (ref && this.$refs[ref]) {
          this.$refs[ref]?.handleReset();
        }
      }
      this.validator();
    },

    /**
     * Xử lý reset form
     * Author: ptrung26 (31/08/2023)
     */
    handleResetForm() {
      for (let key of Object.keys(this.formValidator.values)) {
        this.formValidator.values[key] = null;
      }
    },

    /**
     * Xử lý thêm toast thông báo cho người dùng
     * Author: ptrung26 (31/08/2023)
     * @param {object} toast thông tin toast muốn thêm vào danh sách
     */
    handleAddToast(toast) {
      this.$emitter.emit("onAddToast", toast);
    },

    /**
     * Xử lý hiện dialog thông báo cho người dùng
     * Author: ptrung26 (31/08/2023)
     * @param {object} toast thông tin toast muốn hiện lên dialog
     */
    async handleShowDialog(toast) {
      await this.$refs.dialog.show({
        title: toast.title,
        message: toast.message,
      });
    },

    /**
     * Xử lý lỗi xảy ra khi validate input
     * Author: ptrung26 (19/08/2023)
     */
    validator() {
      this.formValidator.errors = {};
      // Validate số tài khoản
      if (!this.formValidator.values.accountNumber) {
        this.formValidator.errors.accountNumber =
          this.$MISAResource.VI.ErrorMessage.CaUserDetail.AccountNumberNotFound;

        // Độ dài của số tài khoản
      } else if (this.formValidator.values.accountNumber?.length < 3) {
        this.formValidator.errors.accountNumber =
          this.$MISAResource.VI.ErrorMessage.CaUserDetail.LengthOfAccountNumberIsInvalid;

        // Phải bắt đầu là tài khoản tổng hợp
      } else if (
        this.$refs.parentId &&
        this.$refs.parentId.getCbbValue() &&
        !this.formValidator.values.accountNumber
          .toString()
          .startsWith(this.$refs.parentId.getCbbValue())
      ) {
        this.formValidator.errors.accountNumber =
          this.$MISAResource.VI.ErrorMessage.CaUserDetail.AccountNumberIsNotBeginWithGeneralAccount;
      }

      if (!this.formValidator.values.accountName) {
        this.formValidator.errors.accountName =
          this.$MISAResource.VI.ErrorMessage.CaUserDetail.AccountNameNotFound;
      }
    },

    /**
     * Xử lý sự kiện submit form
     * Author: ptrung26 (19/08/2023)
     * @param {string} type kiểu của form
     */
    async handleOnSubmit(type) {
      // Validate trước khi submit
      this.validator();
      const errorKeys = Object.keys(this.formValidator.errors);

      // Nếu có lỗi thì hiện dialog thông tin lỗi
      if (errorKeys.length) {
        this.alertErrorMessage = this.formValidator.errors[errorKeys[0]];
        for (let key of errorKeys) {
          this.formValidator.touched[key] = true;
        }

        // hiện thị dialog
        await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Title.Error,
          message: this.alertErrorMessage,
        });

        // focus lại input lỗi đầu tiên được tìm thấy
        this.$nextTick(() => {
          this.handleFocusInputOrCombobox(errorKeys[0]);
        });
      } else {
        // Xử lý khi thêm nhân viên
        if (
          this.type === this.$MISAEnum.FormType.Add ||
          this.type === this.$MISAEnum.FormType.Replication
        ) {
          await this.handleAddNewAccount(type);
        }
        if (this.type === this.$MISAEnum.FormType.Edit) {
          await this.handleEditNewAccount(type);
        }
      }
    },

    /**
     * Xử lý focus vào input hoặc combobox
     * Author: ptrung26 (04/10/2023)
     * @param name tên của input hoặc combobox muốn focus
     */
    handleFocusInputOrCombobox(name) {
      if (this.$refs[name]?.$refs?.input) {
        this.$refs[name]?.$refs?.input.focus();
      } else if (this.$refs[name]?.$refs?.combobox) {
        this.$refs[name]?.$refs?.combobox.focus();
      }
    },

    /**
     * Xử lý hiện thị toàn màn hình form
     * Author: ptrung26 (18/10/2023)
     */
    handleToFullScreenForm() {
      this.isFullScreen = !this.isFullScreen;
    },

    /************************************** API **************************************/
    /**
     * Xử lý khi thêm mới tài khoản
     * Author: ptrung26 (23/10/2023)
     * @param {string} kiểu của form
     */
    async handleAddNewAccount(type) {
      // Xử lý khi thêm tài khoản
      try {
        const res = await caUserService.post(this.formValidator.values);
        // Nếu thành công thì hiên thông báo cho người dùng
        if (res.status === this.$MISAEnum.HttpStatus.CREATED) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.CaUser.AddAccount,
          });

          // Xoá hết dữ liệu trong form
          this.handleResetForm();
          // Cập nhật lại giá trị mặc định
          this.defaultValue = { ...this.formValidator.values };

          // Cập nhật dữ liệu mới trên UI
          this.$emitter.emit("onDataChange", true);
          if (type === this.$MISAEnum.AddStatus.Add) {
            this.$emitter.emit("onCloseForm");
          }

          // Focus lại input
          this.$nextTick(() => {
            if (this.$refs?.accountNumber?.$refs?.input) {
              this.$refs?.accountNumber?.$refs?.input.focus();
            }
          });
        }
      } catch (err) {
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response?.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          // lỗi input phía người dùng
          if (err.response?.status === 400) {
            await this.handleShowDialog(toast);

            // focus vào giá trị input lỗi đầu tiên
            // lỗi validate input
            if (err.response?.data?.ErrorCode === 400) {
              if (err.response?.data?.Errors) {
                const errors = err.response?.data?.Errors;
                const errorKeys = Object.keys(errors);
                if (errorKeys.length) {
                  this.$nextTick(() => {
                    const errorKeyCamelCase = this.$helper.camelSentence(
                      errorKeys[0]
                    );
                    // Xử lý focus vào input lỗi
                    this.handleFocusInputOrCombobox(errorKeyCamelCase);
                    // Hiện thị lỗi
                    this.formValidator.errors[errorKeyCamelCase] =
                      errors[errorKeys[0]];
                    this.formValidator.touched[errorKeyCamelCase] = true;
                  });
                }
              }
            }
            // lỗi conflict tài khoản
            else if (err.response?.data?.ErrorCode === 409) {
              // Xử lý focus vào input lỗi
              this.handleFocusInputOrCombobox("accountNumber");
              // Hiện thị lỗi
              this.formValidator.errors["accountNumber"] =
                this.$MISAResource.VI.ErrorMessage.CaUserDetail.AccountIsExist;
              this.formValidator.touched["accountNumber"] = true;
            }
          } else {
            this.handleAddToast(toast);
          }
        }
      }
    },

    async handleEditNewAccount(type) {
      // Xử lý khi thêm tài khoản
      try {
        const res = await caUserService.put(
          this.caUser.accountId,
          this.formValidator.values
        );
        // Nếu thành công thì hiên thông báo cho người dùng
        if (res.status === this.$MISAEnum.HttpStatus.OK) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.CaUser.EditAccount,
          });

          // Cập nhật lại giá trị mặc định
          this.defaultValue = { ...this.formValidator.values };

          // Cập nhật dữ liệu mới trên UI
          this.$emitter.emit("onDataChange", true);
          if (type === this.$MISAEnum.AddStatus.Add) {
            this.$emitter.emit("onCloseForm");
          }

          // Focus lại input
          this.$nextTick(() => {
            if (this.$refs?.accountNumber?.$refs?.input) {
              this.$refs?.accountNumber?.$refs?.input.focus();
            }
          });
        }
      } catch (err) {
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response?.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          this.handleAddToast(toast);
        }
      }
    },

    /**
     * Xử lý khi sửa tài khoản
     * Author: ptrung26 (24/10/2023)
     * @param {string} kiểu của form
     */
    async handleEditAccount(type) {
      // Lấy ra thông tin tài khoản từ prop
      try {
        // Gọi API để sửa thông tin tài khoản
        const res = await caUserService.put(this.formValidator.values);

        // Nếu sửa thành công hiện thông báo cho người dùng
        if (res.status === this.$MISAEnum.HttpStatus.OK) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.EditAccount,
          });
          // Cập nhật lại giá trị mặc định
          this.defaultValue = { ...this.formValidator.values };
          // Cập nhật dữ liệu mới trên UI
          this.$emitter.emit("onDataChange", true);
          if (type === this.$MISAEnum.AddStatus.Add) {
            this.handleOnCloseForm();
          }

          // Focus lại input
          this.$nextTick(() => {
            if (this.$refs?.employeeCode?.$refs?.input) {
              this.$refs?.employeeCode?.$refs?.input.focus();
            }
          });
        }
      } catch (err) {
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          // Badrequest: lỗi input phía người dùng
          if (err.response?.status === 400) {
            await this.handleShowDialog(toast);
            // focus vào giá trị input lỗi đầu tiên
            if (err.response?.data?.Errors) {
              const errors = err.response?.data?.Errors;
              const errorKeys = Object.keys(errors);
              if (errorKeys.length) {
                this.$nextTick(() => {
                  const errorKeyCamelCase = this.$helper.camelSentence(
                    errorKeys[0]
                  );
                  // Xử lý focus vào input lỗi
                  this.handleFocusInputOrCombobox(errorKeyCamelCase);
                  // Hiện thị lỗi
                  this.formValidator.errors[errorKeyCamelCase] =
                    errors[errorKeys[0]];
                  this.formValidator.touched[errorKeyCamelCase] = true;
                });
              }
            }
          } else {
            this.handleAddToast(toast);
          }
        }
      }
    },
  },

  computed: {
    dateFormat: {
      /**
       * Trả về định dạng date tương ứng
       * Author: ptrung26 (07/10/2023)
       */
      get() {
        let val = localStorage.getItem("dateType");
        let dateType = 0;
        if (val) {
          dateType = parseInt(val);
        }
        switch (dateType) {
          case this.$MISAEnum.DateType.dd__mm__yyyy:
            return `DD/MM/YYYY`;
          case this.$MISAEnum.DateType.mm__dd__yyyy:
            return `MM/DD/YYYY`;
          case this.$MISAEnum.DateType.yyyy__mm__dd:
            return `YYYY/MM/DD`;
          default:
            return `DD/MM/YYYY`;
        }
      },
    },
  },

  data() {
    // form lưu trữ giá trị input, validate hiện thị lỗi trước khi submit
    const formValidator = {
      // Giá trị của input
      values: {
        accountNumber: this.caUser?.accountNumber,
        accountName: this.caUser?.accountName,
        property: this.caUser?.property,
        englishName: this.caUser?.englishName,
        description: this.caUser?.description,
        followObject: this.caUser?.followObject,
        followObjectValue: this.caUser?.followObjectValue,
        followJob: this.caUser?.followJob,
        followJobValue: this.caUser?.followJobValue,
        followOrder: this.caUser?.followOrder,
        followOrderValue: this.caUser?.followOrderValue,
        followContract: this.caUser?.followContract,
        followContractValue: this.caUser?.followContractValue,
        followDepartment: this.caUser?.followDepartment,
        followDepartmentValue: this.caUser?.followDepartmentValue,
        followBankAccount: this.caUser?.followBankAccount,
        followConstruction: this.caUser?.followConstruction,
        followConstructionValue: this.caUser?.followConstructionValue,
        followSellContract: this.caUser?.followSellContract,
        followSellContractValue: this.caUser?.followSellContractValue,
        followExpenseItem: this.caUser?.followExpenseItem,
        followExpenseItemValue: this.caUser?.followExpenseItemValue,
        followStatisticalCode: this.caUser?.followStatisticalCode,
        followStatisticalCodeValue: this.caUser?.followStatisticalCodeValue,
        isPostableInForeignCurrency: this.caUser?.isPostableInForeignCurrency,
      },
      // Các input đã touch
      touched: {},
      // Lỗi của các input sau khi validate
      errors: {},
    };

    return {
      formValidator,
      alertErrorMessage: "",
      defaultValue: { ...formValidator.values },
      isFullScreen: false,
      PropertyList: [
        {
          property: this.$MISAEnum.Property.First,
          propertyName: this.$MISAResource.VI.PropertyLabel.First,
        },
        {
          property: this.$MISAEnum.Property.Second,
          propertyName: this.$MISAResource.VI.PropertyLabel.Second,
        },
        {
          property: this.$MISAEnum.Property.Third,
          propertyName: this.$MISAResource.VI.PropertyLabel.Third,
        },
        {
          property: this.$MISAEnum.Property.Fourth,
          propertyName: this.$MISAResource.VI.PropertyLabel.Fourth,
        },
      ],
      parent: null,
    };
  },

  async created() {
    // Emitter
    this.$emitter.on("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.on("onCloseDialog", this.handleOnCloseDialog);

    this.defaultValue = { ...this.formValidator.values };

    // Lấy thông tin cha nếu có
    this.$emitter.emit("onEnableLoading", true);
    if (this.caUser && this.caUser["parentId"]) {
      try {
        const res = await caUserService.getById(this.caUser["parentId"]);
        console.log(res);
        this.parent = res.data.data;
      } catch (err) {
        console.log(err);
      }
    }
    setTimeout(() => {
      this.$emitter.emit("onEnableLoading", false);
    }, 200);
  },

  beforeMount() {
    this.$emitter.off("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.off("onCloseDialog", this.handleOnCloseDialog);
  },
};
</script>

<template>
  <div class="m-popup" :class="{ 'm-popup--right': position === 'right' }">
    <div
      class="m-popup-box"
      ref="popup"
      :style="{ width: isFullScreen ? 'calc(100% - 12px)' : '800px' }"
    >
      <div class="to-full-screen" @click="handleToFullScreenForm">
        <div
          class="m-icon"
          :class="{
            'm-icon-arrow-left': !isFullScreen,
            'm-icon-arrow-right': isFullScreen,
          }"
        ></div>
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
            ></m-button-icon>
          </template>
        </m-tooltip>
      </div>
      <div class="m-popup-header">
        <h3 class="m-popup-title">Sửa tài khoản</h3>
      </div>
      <div class="m-popup-control">
        <div class="grid">
          <div class="l-4 m-popup-field">
            <label class="m-label">
              <span class="m-label-text">Số tài khoản</span>
              <span class="m-input-require">*</span>
            </label>
            <m-tooltip
              position="bottom"
              :text="
                formValidator.touched.accountNumber &&
                formValidator.errors.accountNumber
              "
            >
              <template v-slot:children>
                <m-input
                  :class="{
                    'm-input-error':
                      formValidator.touched.accountNumber &&
                      formValidator.errors.accountNumber,
                  }"
                  tabindex="0"
                  name="accountNumber"
                  @input="handleOnChange"
                  v-focus
                  :value="formValidator.values.accountNumber"
                  ref="accountNumber"
                />
              </template>
            </m-tooltip>
          </div>
        </div>
        <div class="grid">
          <div class="l-6 m-popup-field p-r-16">
            <label class="m-label">
              <span class="m-label-text">Tên tài khoản</span>
              <span class="m-input-require">*</span>
            </label>
            <m-tooltip
              :text="
                formValidator.touched.accountName &&
                formValidator.errors.accountName
              "
            >
              <template #children>
                <m-input
                  :class="{
                    'm-input-error':
                      formValidator.touched.accountName &&
                      formValidator.errors.accountName,
                  }"
                  tabindex="1"
                  @input="handleOnChange"
                  :value="formValidator.values.accountName"
                  name="accountName"
                />
              </template>
            </m-tooltip>
          </div>
          <div class="l-6 m-popup-field">
            <label class="m-label">
              <span class="m-label-text">Tên tiếng anh</span>
            </label>
            <m-input
              :class="{
                'm-input-error': false,
              }"
              tabindex="2"
              @input="handleOnChange"
              name="englishName"
              :value="formValidator.values.englishName"
            />
          </div>
        </div>
        <div class="grid">
          <div class="l-4 m-popup-field p-r-12">
            <label class="m-label">
              <span class="m-label-text">Tài khoản tổng hợp</span>
              <span class="m-input-require">*</span>
            </label>
            <m-tooltip position="bottom">
              <template v-slot:children>
                <m-combobox
                  ref="parentId"
                  name="parentId"
                  :defaultValue="parent"
                  :placeholder="
                    $MISAResource.VI.generalAcoountLabel.placeholder
                  "
                  :tabindex="3"
                  urlAPI="Accounts"
                  :columns="[
                    {
                      label: 'Số tài khoản',
                      field: 'accountNumber',
                      columnType: this.$MISAEnum.ColumnType.View,
                      expander: true,
                      width: 120,
                    },
                    {
                      label: 'Tên tài khoản',
                      field: 'accountName',
                      columnType: this.$MISAEnum.ColumnType.View,
                      width: 120,
                    },
                  ]"
                  :propText="$MISAEnum.GeneralAccount.PropText"
                  :propValue="$MISAEnum.GeneralAccount.propValue"
                  :cbbType="1"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </template>
            </m-tooltip>
          </div>
          <div class="l-4 m-popup-field p-r-12">
            <label class="m-label">
              <span class="m-label-text">Tính chất</span>
            </label>
            <m-tooltip position="bottom">
              <template v-slot:children>
                <m-combobox
                  name="property"
                  :placeholder="$MISAResource.VI.propertyLabel.placeholder"
                  :defaultValue="{
                    property: caUser?.property,
                    propertyName: $MISAEnum.Property.get(caUser?.property),
                  }"
                  :tabindex="4"
                  :list="PropertyList"
                  :propText="$MISAEnum.Property.PropText"
                  :propValue="$MISAEnum.Property.PropValue"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </template>
            </m-tooltip>
          </div>
        </div>
        <div class="grid">
          <div class="l-12">
            <label class="m-label">
              <span class="m-label-text">Diễn giải</span>
            </label>
            <m-input
              name="description"
              :class="{
                'm-input-error': false,
              }"
              tabindex="5"
              @input="handleOnChange"
            />
          </div>
        </div>
        <div class="grid m-t-8">
          <div class="l-12">
            <label class="m-label">
              <m-input-checkbox
                tabindex="6"
                name="isPostableInForeignCurrency"
                :value="!formValidator.values.isPostableInForeignCurrency"
                @change="handleOnChange"
              />
              <span class="m-l-6">Có hạch toán ngoại tệ</span>
            </label>
          </div>
        </div>
      </div>
      <div class="m-popup-control">
        <p class="fs-16 m-b-12">Theo dõi chi tiết theo</p>
        <div class="grid">
          <div class="grid align-center m-b-8 w-full">
            <div class="grid align-center l-6 p-r-20">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label">
                  <m-input-checkbox
                    name="followObject"
                    :checked="formValidator.values.followObject"
                    @change="
                      handleOnChangeCheckbox($event, 'followObjectValue')
                    "
                  />
                  <span class="m-l-6">Đối tượng</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followObjectValue"
                  ref="followObjectValue"
                  :disable="!formValidator.values.followObject"
                  :defaultValue="{
                    followObjectName: formValidator.values.followObjectValue
                      ? $MISAEnum.ObjectValue.get(
                          formValidator.values.followObjectValue
                        )
                      : $MISAResource.VI.ObjectLabel.Customer,
                    followObjectValue: formValidator.values.followObjectValue
                      ? formValidator.values.followObjectValue
                      : $MISAEnum.ObjectValue.Customer,
                  }"
                  :list="[
                    {
                      followObjectName: $MISAResource.VI.ObjectLabel.Customer,
                      followObjectValue: $MISAEnum.ObjectValue.Customer,
                    },
                    {
                      followObjectName: $MISAResource.VI.ObjectLabel.Supplier,
                      followObjectValue: $MISAEnum.ObjectValue.Supplier,
                    },
                    {
                      followObjectName: $MISAResource.VI.ObjectLabel.Employee,
                      followObjectValue: $MISAEnum.ObjectValue.Employee,
                    },
                  ]"
                  propValue="followObjectValue"
                  propText="followObjectName"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
            <div class="grid align-center l-6">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label">
                  <m-input-checkbox
                    name="followBankAccount"
                    :checked="formValidator.values.followBankAccount"
                    @change="handleOnChangeCheckbox($event)"
                  />
                  <span class="m-l-6">Tài khoản ngân hàng</span>
                </label>
              </div>
            </div>
          </div>
          <div class="grid align-center m-b-8 w-full">
            <div class="grid l-6 p-r-20 align-center">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="handleOnChangeCheckbox($event, 'followJobValue')"
                    name="followJob"
                    :checked="formValidator.values.followJob"
                  />
                  <span class="m-l-6">Đối tượng THCP</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followJobValue"
                  ref="followJobValue"
                  :disable="!formValidator.values.followJob"
                  :defaultValue="{
                    label: formValidator.values.followJobValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followJobValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followJobValue: $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followJobValue: $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followJobValue: $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followJobValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
            <div class="grid l-6 align-center">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followConstructionValue')
                    "
                    name="followConstruction"
                    :checked="formValidator.values.followConstruction"
                  />
                  <span class="m-l-6">Công trình</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followConstructionValue"
                  ref="followConstructionValue"
                  :disable="!formValidator.values.followConstruction"
                  :defaultValue="{
                    label: formValidator.values.followConstructionValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followConstructionValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followConstructionValue:
                      $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followConstructionValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followConstructionValue:
                        $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followConstructionValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
          </div>
          <div class="grid align-center m-b-8 w-full">
            <div class="grid l-6 p-r-20 align-center">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="handleOnChangeCheckbox($event, 'followOrderValue')"
                    name="followOrder"
                    :checked="formValidator.values.followOrder"
                  />
                  <span class="m-l-6">Đơn đặt hàng</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followOrderValue"
                  ref="followOrderValue"
                  :disable="!formValidator.values.followOrder"
                  :defaultValue="{
                    label: formValidator.values.followOrderValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followOrderValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followOrderValue: $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followOrderValue: $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followOrderValue: $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followOrderValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
            <div class="grid l-6 align-center m-b-8">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followSellContractValue')
                    "
                    name="followSellContract"
                    :checked="formValidator.values.followSellContract"
                  />
                  <span class="m-l-6">Hợp đồng bán</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followSellContractValue"
                  ref="followSellContractValue"
                  :disable="!formValidator.values.followSellContract"
                  :defaultValue="{
                    label: formValidator.values.followSellContractValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followSellContractValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    detailByBuyContractKind:
                      $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followSellContractValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followSellContractValue:
                        $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followSellContractValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
          </div>
          <div class="grid align-center m-b-8 w-full">
            <div class="grid l-6 p-r-20 align-center">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followContractValue')
                    "
                    name="followContract"
                    :checked="formValidator.values.detailByContract"
                  />
                  <span class="m-l-6">Hợp đồng mua</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followContractValue"
                  ref="followContractValue"
                  :disable="!formValidator.values.followContract"
                  :defaultValue="{
                    label: formValidator.values.followContractValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followContractValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followContractValue: $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followContractValue: $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followContractValue: $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followContractValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
            <div class="grid l-6 align-center m-b-8">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followExpenseItemValue')
                    "
                    name="followExpenseItem"
                    :checked="formValidator.values.followExpenseItem"
                  />
                  <span class="m-l-6">Khoản mục CP</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followExpenseItemValue"
                  ref="followExpenseItemValue"
                  :disable="!formValidator.values.followExpenseItem"
                  :defaultValue="{
                    label: formValidator.values.followExpenseItemValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followExpenseItemValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followExpenseItemValue:
                      $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followExpenseItemValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followExpenseItemValue:
                        $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followExpenseItemValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
          </div>
          <div class="grid align-center m-b-8 w-full">
            <div class="grid l-6 p-r-20 align-center">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followDepartmentValue')
                    "
                    name="followDepartment"
                    :checked="formValidator.values.followDepartment"
                  />
                  <span class="m-l-6">Đơn vị</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followDepartmentValue"
                  ref="followDepartmentValue"
                  :defaultValue="{
                    label: formValidator.values.followDepartmentValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followDepartmentValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followDepartmentValue: $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :disable="!formValidator.values.followDepartment"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followDepartmentValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followDepartmentValue: $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followDepartmentValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
            <div class="grid l-6 align-center m-b-8">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox($event, 'followExpenseItemValue')
                    "
                    name="followExpenseItem"
                    :checked="formValidator.values.followExpenseItem"
                  />
                  <span class="m-l-6">Mã thống kê</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followExpenseItemValue"
                  ref="followExpenseItemValue"
                  :disable="!formValidator.values.followExpenseItem"
                  :defaultValue="{
                    label: formValidator.values.followExpenseItemValue
                      ? $MISAEnum.DetailByAction.get(
                          formValidator.values.followExpenseItemValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followExpenseItemValue:
                      $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followExpenseItemValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followExpenseItemValue:
                        $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followExpenseItemValue"
                  propText="label"
                  :onItemChange="handleOnChangeValueCombobox"
                ></m-combobox>
              </div>
            </div>
          </div>
        </div>
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
    </div>
    <Teleport to="body">
      <!-- Error Popup -->
      <m-dialog ref="dialog"></m-dialog>
    </Teleport>
  </div>
</template>

<style scoped></style>
