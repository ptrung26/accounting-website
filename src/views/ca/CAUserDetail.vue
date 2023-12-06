<script>
import caAccountService from "@/services/caAccountService";
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
    handleShowDetailGrid() {
      this.isShowDetail = !this.isShowDetail;
      if (this.isShowDetail) {
        this.$refs.detailGrid.display = "flex";
      } else {
        this.$refs.detailGrid.display = "none";
      }
    },
    /**
     * Xử lý sự kiện đóng form
     * Author: ptrung26 (19/08/2023)
     * Modified by: ptrung26 (29/09/2023)
     */
    async handleOnCloseForm() {
      // Kiểm tra các giá trị của input có giống với mặc định không
      if (
        JSON.stringify({ ...this.defaultValue }) !==
        JSON.stringify({ ...this.formValue.values })
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
      this.formValue.values[name] = value.trim();
      this.formValue.touched[name] = true;
      // Validate các giá trị
      this.validator();
    },

    /**
     * Xử lý khi combobox thay đổi
     * Author: ptrung26 (23/10/2023)
     */
    handleOnChangeCombobox(params) {
      const item = params.value;
      const propValue = params.propValue;
      if (params.name === "parentId") {
        const currentParentAccounts = this.accountFilters.filter(
          (account) => account.accountId === item[propValue]
        );
        if (currentParentAccounts.length > 0) {
          this.currentParentCode = currentParentAccounts[0].accountNumber;
        } else {
          this.currentParentCode = "";
        }
      }

      this.formValue.values[params.name] = item[propValue];
      this.formValue.touched[params.name] = true;
    },

    /**
     * Xử lý khi thay đổi giá trị checkbox
     * Author: ptrung26 (24/10/2023)
     * @param {*} e event input
     * @param {*} ref combobox ref nếu có
     */
    handleOnChangeCheckbox(e, checkboxRef) {
      const { checked, name } = e.target;
      if (!checked) {
        let value = null;
        let label = null;
        if (name === "followObject") {
          label = this.$MISAResource.VI.ObjectLabel.Customer;
          value = this.$MISAEnum.ObjectValue.Customer;
        } else {
          label = this.$MISAResource.VI.DetailByAction.OnlyWarning;
          value = this.$MISAEnum.DetailByAction.OnlyWarning;
        }

        if ((value || value === 0) && label && this.$refs[checkboxRef]) {
          this.$refs[checkboxRef].set(label, value);
        }
      }
      this.formValue.values[name] = checked;
      this.formValue.touched[name] = true;
    },

    /**
     * Xử lý reset form
     * Author: ptrung26 (31/08/2023)
     */
    handleResetForm() {
      for (let key of Object.keys(this.formValue.values)) {
        this.formValue.values[key] = null;
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
      await this.$refs.dialog?.show({
        icon: "m-icon m-icon-error m-48 flex-strink",
        title: toast.title,
        message: toast.message,
      });
    },

    /**
     * Xử lý lỗi xảy ra khi validate input
     * Author: ptrung26 (19/08/2023)
     */
    validator() {
      // Lọc và cập nhật errors từ validator
      const errors = Object.entries(this.formValue.validator).reduce(
        (acc, [key, validator]) => {
          const value = this.formValue.values[key];
          const error = validator(value);
          if (error) acc[key] = error;
          else delete this.formValue.errors[key];
          return acc;
        },
        {}
      );

      // Xóa các phần tử null hoặc undefined từ mảng errors
      Object.keys(errors).forEach((key) => {
        if (!errors[key]) delete errors[key];
      });

      // Xóa các phần tử null hoặc undefined từ formValue.errors
      Object.keys(this.formValue.errors).forEach((key) => {
        if (!this.formValue.errors[key]) delete this.formValue.errors[key];
      });

      // Gán lại giá trị cho formValue.errors sau khi lọc
      this.formValue.errors = { ...this.formValue.errors, ...errors };
    },

    /**
     * Xử lý sự kiện submit form
     * Author: ptrung26 (19/08/2023)
     * @param {string} type kiểu của form
     */
    async handleOnSubmit(type) {
      // Validate trước khi submit
      this.validator();
      const errorKeys = Object.keys(this.formValue.errors);

      // Nếu có lỗi thì hiện dialog thông tin lỗi
      if (errorKeys.length) {
        this.alertErrorMessage = this.formValue.errors[errorKeys[0]];

        for (let key of errorKeys) {
          this.formValue.touched[key] = true;
        }

        if (this.$refs.dialog) {
          // hiện thị dialog
          await this.$refs.dialog?.show({
            icon: "m-icon-error m-48",
            message: this.alertErrorMessage,
          });
        }

        // focus lại input lỗi đầu tiên được tìm thấy
        this.$nextTick(() => {
          this.handleFocusInputOrCombobox(errorKeys[0]);
        });
      } else {
        // Xử lý khi thêm nhân viên
        this.alertErrorMessage = "";
        if (
          this.type === this.$MISAEnum.FormType.Add ||
          this.type === this.$MISAEnum.FormType.Replication
        ) {
          await this.handleAddNewAccount(type);
        }
        if (this.type === this.$MISAEnum.FormType.Edit) {
          await this.handleEditAccount(type);
        }
      }
    },

    /**
     * Xử lý focus vào input hoặc combobox
     * Author: ptrung26 (04/10/2023)
     * @param name tên của input hoặc combobox muốn focus
     */
    handleFocusInputOrCombobox(name) {
      if (this.$refs[name]) {
        this.$refs[name].focus();
      }
    },

    /**
     * Xử lý hiện thị toàn màn hình form
     * Author: ptrung26 (18/10/2023)
     */
    handleToFullScreenForm() {
      this.isFullScreen = !this.isFullScreen;
    },

    /**
     * Xử lý thêm họ hàng của item con
     * Author: ptrung26 (11/11/2023)
     */
    findAncestorsAndDescendants(data, nodes, ancestorsAndDescendants = []) {
      nodes.forEach((node) => {
        const parentNode = data.find(
          (item) => item.accountId === node.parentId
        );
        const childrenNodes = data.filter(
          (item) => item.parentId === node.accountId
        );

        if (
          parentNode &&
          !ancestorsAndDescendants.some(
            (item) => item.accountId === parentNode.accountId
          )
        ) {
          ancestorsAndDescendants.push(parentNode);
          this.findAncestorsAndDescendants(
            data,
            [parentNode],
            ancestorsAndDescendants
          );
        }

        if (childrenNodes.length > 0) {
          ancestorsAndDescendants.push(...childrenNodes);
          this.findAncestorsAndDescendants(
            data,
            childrenNodes,
            ancestorsAndDescendants
          );
        }
      });

      return ancestorsAndDescendants;
    },

    /**
     * Set focus vào element
     * Author: ptrung26 (22/11/2023)
     * @param {String} refElement
     */
    handleSetFocus(refElement) {
      if (refElement && this.$refs[refElement]) {
        this.$refs[refElement].focus();
      }
    },

    handleKeyPress(event) {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        this.handleOnSubmit(this.$MISAEnum.AddStatus.Add);
      }
      if (event.ctrlKey && event.shiftKey && event.key === "S") {
        event.preventDefault();
        this.handleOnSubmit(this.$MISAEnum.AddStatus.AddAndSave);
      }
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
        const res = await caAccountService.post(this.formValue.values);

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
          this.defaultValue = { ...this.formValue.values };

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
        const { errorKey, errorMessage, status, errorCode, toast } = err;
        if (status === 400) {
          if (errorCode === 400) {
            if (errorKey) {
              const errorKeyCamelCase =
                this.$helper.camelSentence(errorKeyCamelCase);
              await this.handleShowDialog(toast);
              // Xử lý focus vào input lỗi
              this.handleSetFocus(errorKeyCamelCase);
              // Hiện thị lỗi
              this.formValue.errors[errorKeyCamelCase] = errorMessage;
              this.formValue.touched[errorKeyCamelCase] = true;
            }
          } else if (errorCode == 409) {
            await this.handleShowDialog(toast);
            // Xử lý focus vào input lỗi
            this.handleFocusInputOrCombobox("accountNumber");
            // Hiện thị lỗi
            this.formValue.errors["accountNumber"] =
              this.$MISAResource.VI.ErrorMessage.AccountDetail.AccountIsExist(
                this.formValue.values.accountNumber
              );
            this.formValue.touched["accountNumber"] = true;
          }
        } else {
          this.addToast(toast);
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
        const res = await caAccountService.put(
          this.caUser.accountId,
          this.formValue.values
        );

        // Nếu sửa thành công hiện thông báo cho người dùng
        if (res.status === this.$MISAEnum.HttpStatus.OK) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.CaUser.EditAccount,
          });
          // Cập nhật lại giá trị mặc định
          this.defaultValue = { ...this.formValue.values };
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
        const { errorKey, errorMessage, status, errorCode, toast } = err;
        if (status === 400) {
          if (errorCode === 400) {
            if (errorKey) {
              const errorKeyCamelCase =
                this.$helper.camelSentence(errorKeyCamelCase);
              await this.handleShowDialog(toast);
              // Xử lý focus vào input lỗi
              this.handleSetFocus(errorKeyCamelCase);
              // Hiện thị lỗi
              this.formValue.errors[errorKeyCamelCase] = errorMessage;
              this.formValue.touched[errorKeyCamelCase] = true;
            }
          } else if (errorCode == 409) {
            await this.handleShowDialog(toast);
            // Xử lý focus vào input lỗi
            this.handleFocusInputOrCombobox("accountNumber");
            // Hiện thị lỗi
            this.formValue.errors["accountNumber"] =
              this.$MISAResource.VI.ErrorMessage.AccountDetail.AccountIsExist;
            this.formValue.touched["accountNumber"] = true;
          }
        } else {
          this.handleAddToast(toast);
        }
      }
    },

    /**
     * Lấy toàn bộ tài khoản
     * Author: ptrung26 (23/10/2023)
     */
    async handleGetAllAcounts() {
      const res = await caAccountService.getAll();
      const accounts = res.data;
      if (this.type === this.$MISAEnum.FormType.Edit) {
        if (this.caUser?.accountNumber) {
          const parent = accounts.find(
            (account) => account.accountId === this.caUser.parentId
          );
          if (parent) {
            const filters = accounts.filter((account) => {
              return (
                account.accountNumber !== this.caUser.accountNumber ||
                account.parentId !== parent.accountId
              );
            });
            this.accountFilters = filters;
          } else {
            this.accountFilters = accounts;
          }
        }
      } else {
        this.accountFilters = accounts;
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

    titleMode: {
      get() {
        if (this.type === this.$MISAEnum.FormType.Edit) {
          return this.$MISAResource.VI.FormTitle.Account.Edit;
        }
        if (this.type === this.$MISAEnum.FormType.Replication) {
          return this.$MISAResource.VI.FormTitle.Account.Replication;
        }

        return this.$MISAResource.VI.FormTitle.Account.Add;
      },
    },
  },

  data() {
    const context = this;
    return {
      formValue: {
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
          parentId: this.caUser?.parentId,
          isParent: this.caUser?.isParent,
          inActive: this.caUser?.inActive,
        },
        // Các input đã touch
        touched: {},
        // Lỗi của các input sau khi validate
        errors: {},
        validator: {
          accountNumber(value) {
            let error = "";
            if (!value || value.trim() === "") {
              error =
                context.$MISAResource.VI.ErrorMessage.AccountDetail
                  .AccountNumberNotFound;

              // Độ dài của số tài khoản
            } else if (value.trim().length < 3) {
              error =
                context.$MISAResource.VI.ErrorMessage.AccountDetail
                  .LengthOfAccountNumberIsInvalid;
              // Phải bắt đầu là tài khoản tổng hợp
            } else if (
              context.currentParentCode &&
              !value.toString().startsWith(context.currentParentCode)
            ) {
              error =
                context.$MISAResource.VI.ErrorMessage.AccountDetail
                  .AccountNumberIsNotBeginWithGeneralAccount;
            }
            return error;
          },
          accountName(value) {
            let error = "";
            if (!value || value.trim() === "") {
              error =
                context.$MISAResource.VI.ErrorMessage.AccountDetail
                  .AccountNameNotFound;
            }

            return error;
          },
          property(value) {
            let error = "";
            if (!value && value !== 0) {
              error =
                context.$MISAResource.VI.ErrorMessage.AccountDetail
                  .PropertyNotFound;
            }
            return error;
          },
        },
      },
      alertErrorMessage: "",
      defaultValue: null,
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
      accountFilters: [],
      parent: null,
      currentParentCode: "",
      isShowDetail: false,
    };
  },

  async created() {
    // Emitter
    this.$emitter.on("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.on("onCloseDialog", this.handleOnCloseDialog);

    this.defaultValue = { ...this.formValue.values };

    this.$emitter.emit("onEnableLoading", true);
    // Lấy toàn bộ tài khoản tổng hợp
    await this.handleGetAllAcounts();
    // Lấy thông tin cha nếu có
    if (this.caUser && this.caUser["parentId"]) {
      try {
        const res = await caAccountService.getById(this.caUser["parentId"]);
        this.parent = res.data.data;
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    }
    setTimeout(() => {
      this.$emitter.emit("onEnableLoading", false);
    }, 200);

    if (this.type === this.$MISAEnum.FormType.Replication) {
      this.formValue.values.inActive = false;
      this.formValue.values.isParent = false;
    }
  },

  mounted() {
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeMount() {
    this.$emitter.off("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.off("onCloseDialog", this.handleOnCloseDialog);
    window.removeEventListener("keydown", this.handleKeyPress);
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
        <h3 class="m-popup-title">{{ titleMode }}</h3>
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
                formValue.touched.accountNumber &&
                formValue.errors.accountNumber
              "
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template v-slot:children>
                <m-input
                  :class="{
                    'm-input-error':
                      formValue.touched.accountNumber &&
                      formValue.errors.accountNumber,
                  }"
                  tabindex="1"
                  name="accountNumber"
                  v-focus
                  v-model="formValue.values.accountNumber"
                  ref="accountNumber"
                  :validator="formValue.validator.accountNumber"
                  @update:error="
                    (error) => {
                      formValue.touched.accountNumber = true;
                      formValue.errors.accountNumber = error;
                    }
                  "
                  maxlength="20"
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
                formValue.touched.accountName && formValue.errors.accountName
              "
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template #children>
                <m-input
                  :class="{
                    'm-input-error':
                      formValue.touched.accountName &&
                      formValue.errors.accountName,
                  }"
                  tabindex="2"
                  v-model="formValue.values.accountName"
                  name="accountName"
                  ref="accountName"
                  :validator="formValue.validator.accountName"
                  @update:error="
                    (error) => {
                      formValue.touched.accountName = true;
                      formValue.errors.accountName = error;
                    }
                  "
                  maxlength="128"
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
              tabindex="3"
              name="englishName"
              v-model="formValue.values.englishName"
              maxlength="128"
            />
          </div>
        </div>
        <div class="grid">
          <div class="l-4 m-popup-field p-r-12">
            <label class="m-label">
              <span class="m-label-text">Tài khoản tổng hợp</span>
            </label>
            <m-tooltip
              position="bottom"
              :text="formValue.touched.parentId && formValue.errors.parentId"
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template v-slot:children>
                <m-combobox
                  ref="parentId"
                  name="parentId"
                  :defaultValue="parent"
                  :placeholder="
                    $MISAResource.VI.generalAcoountLabel.placeholder
                  "
                  :tabindex="4"
                  :list="accountFilters"
                  :columns="[
                    {
                      label: 'Số tài khoản',
                      field: 'accountNumber',
                      columnType: this.$MISAEnum.ColumnType.View,
                      expander: true,
                      width: 120,
                      minWidth: 120,
                    },
                    {
                      label: 'Tên tài khoản',
                      field: 'accountName',
                      columnType: this.$MISAEnum.ColumnType.View,
                      width: 240,
                      minWidth: 240,
                    },
                  ]"
                  propText="accountNumber"
                  propValue="accountId"
                  :cbbType="1"
                  @update-combobox="handleOnChangeCombobox"
                  :messageNotFound="
                    this.$MISAResource.VI.ErrorMessage.AccountDetail
                      .AccountGeneralIsNotFound
                  "
                  @show-error="
                    (message) => {
                      formValue.errors.parentId = message;
                      formValue.touched.parentId = true;
                    }
                  "
                  checkedKey="accountNumber"
                ></m-combobox>
              </template>
            </m-tooltip>
          </div>
          <div class="l-4 m-popup-field p-r-12">
            <label class="m-label">
              <span class="m-label-text">Tính chất</span>
              <span class="m-input-require">*</span>
            </label>
            <m-tooltip
              position="bottom"
              :text="formValue.touched.property && formValue.errors.property"
              :tooltipType="$MISAEnum.TooltipType.Error"
            >
              <template v-slot:children>
                <m-combobox
                  name="property"
                  ref="property"
                  :placeholder="$MISAResource.VI.propertyLabel.placeholder"
                  :defaultValue="{
                    property: caUser?.property,
                    propertyName: $MISAEnum.Property.get(caUser?.property),
                  }"
                  :tabindex="5"
                  :list="PropertyList"
                  :propText="$MISAEnum.Property.PropText"
                  :propValue="$MISAEnum.Property.PropValue"
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="property"
                  :validator="formValue.validator.property"
                  @show-error="
                    (message) => {
                      formValue.touched.property = true;
                      formValue.errors.property = message;
                    }
                  "
                  :messageNotFound="
                    this.$MISAResource.VI.ErrorMessage.AccountDetail
                      .PropertyIsNotExist
                  "
                  :comboboxError="formValue.errors.property"
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
            <textarea
              name="description"
              :class="{
                'm-input-error': false,
              }"
              class="m-input m-textarea"
              tabindex="6"
              maxlength="255"
              v-model="formValue.values.description"
            />
          </div>
        </div>
        <div class="grid m-t-8">
          <div class="l-12">
            <label class="m-label">
              <m-input-checkbox
                name="isPostableInForeignCurrency"
                :checked="formValue.values.isPostableInForeignCurrency"
                @change="handleOnChangeCheckbox"
                @keyboard-enter="handleOnChangeCheckbox"
                tabindex="7"
              />
              <span class="m-l-6">Có hạch toán ngoại tệ</span>
            </label>
          </div>
        </div>
      </div>
      <div class="m-popup-control">
        <p class="fs-16 m-b-12">
          <button
            class="m-icon"
            :class="{
              'm-icon-black': !isShowDetail,
              'm-icon-black-down': isShowDetail,
            }"
            @click="handleShowDetailGrid"
          ></button
          >Theo dõi chi tiết theo
        </p>
        <div class="grid" v-show="isShowDetail" ref="detailGrid">
          <div class="grid align-center m-b-8 w-full">
            <div class="grid align-center l-6 p-r-20">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label">
                  <m-input-checkbox
                    name="followObject"
                    :checked="formValue.values.followObject"
                    @change="
                      handleOnChangeCheckbox($event, 'followObjectValue')
                    "
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followObjectValue')
                    "
                    tabindex="8"
                  />
                  <span class="m-l-6">Đối tượng</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followObjectValue"
                  ref="followObjectValue"
                  :tabindex="9"
                  :disable="!formValue.values.followObject"
                  :defaultValue="{
                    followObjectName: formValue.values.followObjectValue
                      ? $MISAEnum.ObjectValue.get(
                          formValue.values.followObjectValue
                        )
                      : $MISAResource.VI.ObjectLabel.Customer,
                    followObjectValue: formValue.values.followObjectValue
                      ? formValue.values.followObjectValue
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followObjectValue"
                ></m-combobox>
              </div>
            </div>
            <div class="grid align-center l-6">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label">
                  <m-input-checkbox
                    name="followBankAccount"
                    :checked="formValue.values.followBankAccount"
                    @change="handleOnChangeCheckbox($event)"
                    @keyboard-enter="(event) => handleOnChangeCheckbox(event)"
                    tabindex="10"
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
                    @keyboard-enter="
                      (event) => handleOnChangeCheckbox(event, 'followJobValue')
                    "
                    name="followJob"
                    :checked="formValue.values.followJob"
                    tabindex="11"
                  />
                  <span class="m-l-6">Đối tượng THCP</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followJobValue"
                  ref="followJobValue"
                  :disable="!formValue.values.followJob"
                  :defaultValue="{
                    label: formValue.values.followJobValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followJobValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followJobValue: formValue.values.followJobValue
                      ? formValue.values.followJobValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followJobValue"
                  :tabindex="12"
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
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followConstructionValue')
                    "
                    name="followConstruction"
                    :checked="formValue.values.followConstruction"
                    tabindex="13"
                  />
                  <span class="m-l-6">Công trình</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followConstructionValue"
                  ref="followConstructionValue"
                  :disable="!formValue.values.followConstruction"
                  :defaultValue="{
                    label: formValue.values.followConstructionValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followConstructionValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followConstructionValue: formValue.values
                      .followConstructionValue
                      ? formValue.values.followConstructionValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followConstructionValue"
                  :tabindex="14"
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
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followOrderValue')
                    "
                    name="followOrder"
                    :checked="formValue.values.followOrder"
                    tabindex="15"
                  />
                  <span class="m-l-6">Đơn đặt hàng</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followOrderValue"
                  ref="followOrderValue"
                  :disable="!formValue.values.followOrder"
                  :defaultValue="{
                    label: formValue.values.followOrderValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followOrderValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followOrderValue: formValue.values.followOrderValue
                      ? formValue.values.followOrderValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followOrderValue"
                  :tabindex="16"
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
                    @keyboard-enter="
                      handleOnChangeCheckbox($event, 'followSellContractValue')
                    "
                    name="followSellContract"
                    :checked="formValue.values.followSellContract"
                    tabindex="17"
                  />
                  <span class="m-l-6">Hợp đồng bán</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followSellContractValue"
                  ref="followSellContractValue"
                  :disable="!formValue.values.followSellContract"
                  :defaultValue="{
                    label: formValue.values.followSellContractValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followSellContractValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followSellContractValue: formValue.values
                      .followSellContractValue
                      ? formValue.values.followSellContractValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followSellContractValue"
                  :tabindex="18"
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
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followContractValue')
                    "
                    name="followContract"
                    :checked="formValue.values.followContract"
                    tabindex="19"
                  />
                  <span class="m-l-6">Hợp đồng mua</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followContractValue"
                  ref="followContractValue"
                  :disable="!formValue.values.followContract"
                  :defaultValue="{
                    label: formValue.values.followContractValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followContractValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followContractValue: formValue.values.followContractValue
                      ? formValue.values.followContractValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followContractValue"
                  :tabindex="20"
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
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followExpenseItemValue')
                    "
                    name="followExpenseItem"
                    :checked="formValue.values.followExpenseItem"
                    tabindex="21"
                  />
                  <span class="m-l-6">Khoản mục CP</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followExpenseItemValue"
                  ref="followExpenseItemValue"
                  :disable="!formValue.values.followExpenseItem"
                  :defaultValue="{
                    label: formValue.values.followExpenseItemValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followExpenseItemValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followExpenseItemValue: formValue.values
                      .followExpenseItemValue
                      ? formValue.values.followExpenseItemValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followExpenseItemValue"
                  :tabindex="22"
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
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(event, 'followDepartmentValue')
                    "
                    name="followDepartment"
                    :checked="formValue.values.followDepartment"
                    tabindex="23"
                  />
                  <span class="m-l-6">Đơn vị</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followDepartmentValue"
                  ref="followDepartmentValue"
                  :defaultValue="{
                    label: formValue.values.followDepartmentValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followDepartmentValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followDepartmentValue: formValue.values
                      .followDepartmentValue
                      ? formValue.values.followDepartmentValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :disable="!formValue.values.followDepartment"
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
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followDepartmentValue"
                  :tabindex="24"
                ></m-combobox>
              </div>
            </div>
            <div class="grid l-6 align-center m-b-8">
              <div class="l-6 p-r-12 grid align-center">
                <label class="m-label w-full">
                  <m-input-checkbox
                    @change="
                      handleOnChangeCheckbox(
                        $event,
                        'followStatisticalCodeValue'
                      )
                    "
                    @keyboard-enter="
                      (event) =>
                        handleOnChangeCheckbox(
                          event,
                          'followStatisticalCodeValue'
                        )
                    "
                    name="followStatisticalCode"
                    :checked="formValue.values.followStatisticalCode"
                    tabindex="25"
                  />
                  <span class="m-l-6">Mã thống kê</span>
                </label>
              </div>
              <div class="l-6">
                <m-combobox
                  name="followStatisticalCodeValue"
                  ref="followStatisticalCodeValue"
                  :disable="!formValue.values.followStatisticalCode"
                  :defaultValue="{
                    label: formValue.values.followStatisticalCodeValue
                      ? $MISAEnum.DetailByAction.get(
                          formValue.values.followStatisticalCodeValue
                        )
                      : $MISAResource.VI.DetailByAction.OnlyWarning,
                    followStatisticalCodeValue: formValue.values
                      .followStatisticalCodeValue
                      ? formValue.values.followStatisticalCodeValue
                      : $MISAEnum.DetailByAction.OnlyWarning,
                  }"
                  :list="[
                    {
                      label: $MISAResource.VI.DetailByAction.OnlyWarning,
                      followStatisticalCodeValue:
                        $MISAEnum.DetailByAction.OnlyWarning,
                    },
                    {
                      label: $MISAResource.VI.DetailByAction.MustInput,
                      followStatisticalCodeValue:
                        $MISAEnum.DetailByAction.MustInput,
                    },
                  ]"
                  propValue="followStatisticalCodeValue"
                  propText="label"
                  @update-combobox="handleOnChangeCombobox"
                  checkedKey="followStatisticalCodeValue"
                  :tabindex="26"
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
          @blur="handleSetFocus('accountNumber')"
          tabindex="29"
          >Hủy</m-button
        >
        <div>
          <m-button
            class="m-btn-seconary m-r-6"
            @click="handleOnSubmit($MISAEnum.AddStatus.Add)"
            tabindex="28"
            >Cất</m-button
          >
          <m-button
            class="p-l-12 m-btn-fff"
            @click="handleOnSubmit($MISAEnum.AddStatus.AddAndSave)"
            tabindex="27"
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

<style></style>
