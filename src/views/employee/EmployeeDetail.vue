<script>
import employeeService from "@/services/employeeService";
import departmentService from "../../services/departmentService";
export default {
  props: {
    type: Number,
    employee: Object,
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
     * @param {object} e input event
     */
    handleOnChange(e) {
      // Lấy ra tên và giá trị của input
      let { name, value } = e.target;
      // Cập nhật giá trị của form
      this.formValidator.values[name] = value.trim();
      this.formValidator.touched[name] = true;
      // Validate các giá trị
      this.formValidator.validator();
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
     * Xử lý khi lựa chọn phòng ban trong combobox
     * Author: ptrung26 (04/09/2023)
     * @param {string} value giá trị cập nhật
     */
    handleDepartmentCbChange(value) {
      this.formValidator.values["departmentId"] = value;
      this.formValidator.validator();
    },

    /**
     * Xử lý sự kiện submit form
     * Author: ptrung26 (19/08/2023)
     * @param {string} type kiểu của form
     */
    async handleOnSubmit(type) {
      // Validate trước khi submit
      this.formValidator.validator();
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

        // focus lại input lỗi
        this.$nextTick(() => {
          this.handleFocusInputOrCombobox(errorKeys[0]);
        });
      } else {
        // Xử lý khi thêm nhân viên
        if (
          this.type === this.$MISAEnum.FormType.Add ||
          this.type === this.$MISAEnum.FormType.Replication
        ) {
          await this.handleAddNewEmployee(type);
        }
        if (this.type === this.$MISAEnum.FormType.Edit) {
          await this.handleEditEmployee(type);
        }
      }
    },

    /**
     * Check giới tính của nhân viên
     * Author: ptrung26 (05/09/2023)
     * @param {int} genderId id của giới tính
     */
    getGender(genderId) {
      return genderId === this.formValidator.values.gender;
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
     * Xử lý khi thay đổi ngày tháng
     * Author: ptrung26 (07/10/2023)
     * @param {string} name tên của giá trị ngày tháng đang chọn
     */
    handleOnChangeDate(name) {
      this.formValidator.touched[name] = true;
      this.formValidator.validator();
    },

    /************************************** API **************************************/
    /**
     * Lấy tất cả department
     * Author: ptrung26 (29/08/2023)
     */
    async getAllDepartment() {
      try {
        // Gọi API để lấy tất cả department
        const res = await departmentService.getAllDepartments();
        this.departments = res.data.map((item) => {
          return {
            value: item.DepartmentId,
            label: item.DepartmentName,
          };
        });
        // Hiện thị lỗi cho người dùng nếu có theo từng HTTP status
      } catch (err) {
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          this.toastList.push(toast);
        }
      }
    },

    /**
     * Xử lý khi thêm mới nhân viên
     * Author: ptrung26 (31/08/2023)
     * @param {string} kiểu của form
     */
    async handleAddNewEmployee(type) {
      // Xử lý khi thêm nhân viên
      try {
        const res = await employeeService.post(this.formValidator.values);
        // Nếu thành công thì hiên thông báo cho người dùng
        console.log(res);
        if (res.status === this.$MISAEnum.HttpStatus.CREATED) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.AddEmployee,
          });
          // Xoá hết dữ liệu trong form
          this.handleResetForm();
          // Cập nhật lại giá trị mặc định
          this.defaultValue = { ...this.formValidator.values };
          // Tạo ra mã nhân viên mới
          await this.getEmployeeCode();
          // Cập nhật dữ liệu mới trên UI
          this.$emitter.emit("onDataChange", true);
          if (type === this.$MISAEnum.AddStatus.Add) {
            this.$emitter.emit("onCloseForm");
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
            // lỗi conflict mã nhân viên
            else if (err.response?.data?.ErrorCode === 409) {
              // Xử lý focus vào input lỗi
              this.handleFocusInputOrCombobox("employeeCode");
              // Hiện thị lỗi
              this.formValidator.errors["employeeCode"] =
                this.$MISAResource.VI.ErrorMessage.EmployeeCodeIsExist;
              this.formValidator.touched["employeeCode"] = true;
            }
          } else {
            this.handleAddToast(toast);
          }
        }
      }
    },

    /**
     * Xử lý khi sửa nhân viên
     * Author: ptrung26 (31/08/2023)
     * @param {string} kiểu của form
     */
    async handleEditEmployee(type) {
      // Lấy ra thông tin nhân viên từ prop
      try {
        // Gọi API để sửa thông tin nhân viên
        const res = await employeeService.put(this.formValidator.values);

        // Nếu sửa thành công hiện thông báo cho người dùng
        if (res.status === this.$MISAEnum.HttpStatus.OK) {
          this.handleAddToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.EditEmployee,
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

    /**
     * Xử lý tự động generate mã nhân viên khi thêm
     * Author: ptrung26 (24/09/2023)
     */
    async getEmployeeCode() {
      if (
        this.type === this.$MISAEnum.FormType.Add ||
        this.type === this.$MISAEnum.FormType.Replication
      ) {
        try {
          const res = await employeeService.generateNewEmployeeCode();
          this.formValidator.values.employeeCode = res.data;
        } catch (err) {
          let toast = this.$errorHandling.createError(
            err.response.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
            err.response?.data?.UserMessage ||
              this.$MISAResource.VI.ErrorMessage.ServerError
          );
          if (toast) {
            this.handleAddToast(toast);
          }
        }
      } else {
        this.formValidator.values.employeeCode = this.employee?.EmployeeCode;
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
    const helper = this.$helper;
    const MISAResource = this.$MISAResource;
    const MISAEnum = this.$MISAEnum;

    // form lưu trữ giá trị input, validate hiện thị lỗi trước khi submit
    const formValidator = {
      // Giá trị của input
      values: {
        employeeId: this.employee?.EmployeeId,
        employeeCode: this.employee?.EmployeeCode,
        fullName: this.employee?.FullName,
        dateOfBirth: helper
          .convertDate(
            this.employee?.DateOfBirth,
            MISAEnum.DateType.yyyy__mm__dd
          )
          .replace(/\//g, "-"),
        gender: this.employee?.Gender || MISAEnum.Gender.Male,
        employeeTitle: this.employee?.EmployeeTitle,
        departmentId: this.employee?.DepartmentId,
        employeeAddress: this.employee?.EmployeeAddress,
        employeeMobile: this.employee?.EmployeeMobile,
        employeeFax: this.employee?.EmployeeFax,
        identityNumber: this.employee?.IdentityNumber,
        identityDate: helper
          .convertDate(
            this.employee?.IdentityDate,
            MISAEnum.DateType.yyyy__mm__dd
          )
          .replace(/\//g, "-"),
        identityPlace: this.employee?.IdentityPlace,
        employeeEmail: this.employee?.EmployeeEmail,
        bankAccount: this.employee?.BankAccount,
        bankName: this.employee?.BankName,
        bankAddress: this.employee?.BankAddress,
      },
      // Các input đã touch
      touched: {},
      // Lỗi của các input sau khi validate
      errors: {},
      /**
       * Xử lý lỗi xảy ra khi validate input
       * @returns errors: Thông tin lỗi của các input sau khi validate
       * Author: ptrung26 (19/08/2023)
       */
      validator() {
        this.errors = {};

        // Validate mã nhân viên không được null
        if (!this.values.employeeCode) {
          this.errors.employeeCode =
            MISAResource.VI.ErrorMessage.EmployeeIdNotFound;
        }

        // Vlidate tên nhân viên không được null
        if (!this.values.fullName) {
          this.errors.fullName =
            MISAResource.VI.ErrorMessage.EmployeeNameNotFound;
        }
        // Tên không quá 100 kí tự
        else if (this.values.fullName.length > 100) {
          this.errors.fullName =
            MISAResource.VI.ErrorMessage.ErrorFullNameLength;
        }

        // Validate phòng ban không được null
        if (!this.values.departmentId) {
          this.errors.departmentId =
            MISAResource.VI.ErrorMessage.DepartmentNotFound;
        }

        // Validate ngày sinh và ngày tạo căn cước không được rỗng
        if (this.values.identityNumber && !this.values.identityDate) {
          this.errors.identityDate =
            MISAResource.VI.ErrorMessage.IdentityDateIsEmpty;
        }

        const dateOfBirth =
          this.values.dateOfBirth && new Date(this.values.dateOfBirth);

        const identityDate =
          this.values.identityNumber &&
          this.values.identityDate &&
          new Date(this.values.identityDate);

        // Ngày sinh không được lớn hơn ngày hiện tại
        if (dateOfBirth && dateOfBirth.getTime() > new Date().getTime()) {
          this.errors.dateOfBirth =
            MISAResource.VI.ErrorMessage.DateOfBirthIsGreaterThanCurrentDate;
        }

        // Ngày tạo căn cước không được lớn hơn ngày hiện tại
        if (identityDate && identityDate.getTime() > new Date().getTime()) {
          this.errors.identityDate =
            MISAResource.VI.ErrorMessage.IdentityDateIsGreaterThanCurrentDate;
        }

        // Ngày sinh phải nhỏ hơn ngày tạo thẻ căn cước
        if (
          identityDate &&
          dateOfBirth &&
          dateOfBirth.getTime() > identityDate.getTime()
        ) {
          this.errors.identityDate =
            MISAResource.VI.ErrorMessage.IdentityDateIsSmallerThanDateOfBirth;
        }

        // Validate email phải đúng định dạng
        if (
          this.values.employeeEmail &&
          !helper.emailValidate(this.values.employeeEmail)
        ) {
          this.errors.employeeEmail = MISAResource.VI.ErrorMessage.EmailInvalid;
        }

        // Chuyển đổi giá trị gender sang kiểu number trước khi submit
        let gender = this.values.gender;
        this.values.gender = parseInt(gender);

        // Đặt giá trị mặc định nếu ngày sinh và ngày tạo căn nước rỗng
        this.values.dateOfBirth = "1971-01-01";
        this.values.identityDate = "1971-01-01";
      },
    };

    return {
      formValidator,
      alertErrorMessage: "",
      departments: null,
      defaultValue: { ...formValidator.values },
      department: {
        label: this.employee?.DepartmentName,
        value: this.employee?.DepartmentId,
      },
    };
  },

  async created() {
    // Lấy tất cả deparment
    await this.getAllDepartment();

    // Emitter
    this.$emitter.on("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.on("onCloseDialog", this.handleOnCloseDialog);

    // Xử lý tự động generate mã nhân viên khi thêm
    await this.getEmployeeCode();
    this.defaultValue = { ...this.formValidator.values };
  },

  beforeMount() {
    this.$emitter.off("onConfirmDialog", this.handleOnCloseDialog);
    this.$emitter.off("onCloseDialog", this.handleOnCloseDialog);
  },
};
</script>

<template>
  <div class="m-popup">
    <div class="m-popup-box">
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
      <div class="m-popup-header">
        <h3 class="m-popup-title">Thông tin nhân viên</h3>
      </div>
      <div class="m-popup-control">
        <div class="grid">
          <div class="l-6 p-r-26">
            <div class="grid">
              <div class="l-4-8 p-r-6 m-popup-field">
                <label class="m-label" for="employeeCode">
                  <span class="m-label-text">Mã</span>
                  <span class="m-input-require">*</span>
                </label>
                <m-tooltip
                  position="bottom"
                  :text="
                    formValidator.touched.employeeCode &&
                    formValidator.errors.employeeCode
                  "
                >
                  <template v-slot:children>
                    <m-input
                      name="employeeCode"
                      ref="employeeCode"
                      id="employeeCode"
                      :class="{
                        'm-input-error':
                          formValidator.touched.employeeCode &&
                          formValidator.errors.employeeCode,
                      }"
                      tabindex="1"
                      @input="handleOnChange"
                      :value="formValidator.values.employeeCode"
                      v-focus
                    />
                  </template>
                </m-tooltip>
              </div>
              <div class="l-7-2 m-popup-field">
                <label class="m-label" for="fullName">
                  <span class="m-label-text">Tên</span>
                  <span class="m-input-require">*</span>
                </label>
                <m-tooltip
                  position="bottom"
                  :text="
                    formValidator.touched.fullName &&
                    formValidator.errors.fullName
                  "
                >
                  <template v-slot:children>
                    <m-input
                      name="fullName"
                      ref="fullName"
                      tabindex="2"
                      id="fullName"
                      :class="{
                        'm-input-error':
                          formValidator.touched.fullName &&
                          formValidator.errors.fullName,
                      }"
                      v-model:value="formValidator.values.fullName"
                      @input="handleOnChange"
                    />
                  </template>
                </m-tooltip>
              </div>
            </div>
            <div class="grid m-popup-field">
              <label class="m-label" for="departmentId">
                <span class="m-label-text">Đơn vị</span>
                <span class="m-input-require">*</span>
              </label>
              <m-tooltip
                position="bottom"
                :text="
                  formValidator.touched.departmentId &&
                  formValidator.errors.departmentId
                "
              >
                <template v-slot:children>
                  <m-combobox
                    class="w-full"
                    ref="departmentId"
                    id="departmentId"
                    :class="{
                      'm-input-error':
                        formValidator.touched.departmentId &&
                        formValidator.errors.departmentId,
                    }"
                    name="departmentId"
                    :list="departments || []"
                    position="bottom"
                    :tabindex="3"
                    :placeholder="
                      this.$MISAResource.VI.postionLabel.placeholder
                    "
                    :onItemChange="handleDepartmentCbChange"
                    :defaultValue="this.department"
                  ></m-combobox>
                </template>
              </m-tooltip>
            </div>
            <div class="grid m-popup-field">
              <label class="m-label" for="employeeTitle">
                <span class="m-label-text">Chức danh</span>
              </label>
              <m-input
                name="employeeTitle"
                tabindex="4"
                id="employeeTitle"
                :value="formValidator.values.employeeTitle"
                @change="handleOnChange"
              />
            </div>
          </div>
          <div class="l-6">
            <div class="grid">
              <div class="l-4-8 p-r-6 m-popup-field">
                <label class="m-label" for="dateOfBirth">
                  <span class="m-label-text">Ngày sinh</span>
                </label>
                <m-tooltip
                  position="bottom"
                  :text="
                    formValidator.touched.dateOfBirth &&
                    formValidator.errors.dateOfBirth
                  "
                >
                  <template v-slot:children>
                    <date-picker
                      ref="dateOfBirth"
                      id="dateOfBirth"
                      :placeholder="dateFormat"
                      value-type="DD/MM/YYYY"
                      :input-class="`m-input ${
                        formValidator.touched.dateOfBirth &&
                        formValidator.errors.dateOfBirth
                          ? 'm-input-error'
                          : ''
                      }`"
                      :title-format="dateFormat"
                      format="MM/DD/YYYY"
                      :class="{
                        'm-input-error':
                          formValidator.touched.dateOfBirth &&
                          formValidator.errors.dateOfBirth,
                      }"
                      :input-attr="{ name: 'dateOfBirth', tabindex: 5 }"
                      v-model:value="formValidator.values.dateOfBirth"
                      @change="handleOnChangeDate('dateOfBirth')"
                    />
                  </template>
                </m-tooltip>
              </div>
              <div class="l-7-2 p-l-10 m-popup-field">
                <label class="m-label">
                  <span class="m-label-text">Giới tính</span>
                </label>
                <div class="grid">
                  <m-input-radio
                    :tabindex="6"
                    v-for="[key, value] of Object.entries(
                      this.$MISAEnum.Gender
                    )"
                    :key="key"
                    :value="value"
                    :checked="getGender(value)"
                    name="gender"
                    :label="this.$MISAResource.VI.GenderName[key]"
                    :onChange="handleOnChange"
                  />
                </div>
              </div>
            </div>
            <div class="grid">
              <div class="l-4-8 p-r-6 m-popup-field">
                <m-tooltip position="top" text="Số chưng minh nhân dân">
                  <template v-slot:children>
                    <label class="m-label" for="identityNumber">
                      <div class="m-label-text">Số CMND</div>
                    </label>
                  </template>
                </m-tooltip>

                <m-input
                  name="identityNumber"
                  id="identityNumber"
                  tabindex="8"
                  :value="formValidator.values.identityNumber"
                  @change="handleOnChange"
                />
                <div class="m-error-message"></div>
              </div>
              <div class="l-7-2 m-popup-field">
                <label class="m-label" for="identityDate">
                  <span class="m-label-text">Ngày cấp</span>
                </label>
                <m-tooltip
                  position="bottom"
                  :text="
                    formValidator.touched.identityDate &&
                    formValidator.errors.identityDate
                  "
                >
                  <template v-slot:children>
                    <date-picker
                      ref="identityDate"
                      id="identityDate"
                      :placeholder="dateFormat"
                      :editable="true"
                      value-type="YYYY-MM-DD"
                      :input-attr="{ name: 'identityDate', tabindex: 9 }"
                      :input-class="`m-input ${
                        formValidator.touched.identityDate &&
                        formValidator.errors.identityDate
                          ? 'm-input-error'
                          : ''
                      }`"
                      :title-format="dateFormat"
                      :format="dateFormat"
                      v-model:value="formValidator.values.identityDate"
                      @change="handleOnChangeDate('identityDate')"
                    />
                  </template>
                </m-tooltip>
              </div>
            </div>
            <div class="grid m-popup-field">
              <label class="m-label" for="identityPlace">
                <span class="m-label-text">Nơi cấp</span>
              </label>
              <m-input
                name="identityPlace"
                id="identityPlace"
                tabindex="11"
                :value="formValidator.values.identityPlace"
                @change="handleOnChange"
              />
              <div class="m-error-message"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-popup-control">
        <div class="grid m-popup-field">
          <label class="m-label" for="employeeAddress">
            <span class="m-label-text">Địa chỉ</span>
          </label>
          <m-input
            name="employeeAddress"
            id="employeeAddress"
            tabindex="12"
            :value="formValidator.values.employeeAddress"
            @change="handleOnChange"
          />
          <div class="m-error-message"></div>
        </div>
        <div class="grid">
          <div class="l-3 p-r-6 m-popup-field">
            <m-tooltip text="Điện thoại di động">
              <template v-slot:children>
                <label class="m-label" for="employeeMobile">
                  <span class="m-label-text">ĐT di động</span>
                </label>
              </template>
            </m-tooltip>

            <m-input
              name="employeeMobile"
              id="employeeMobile"
              tabindex="13"
              :value="formValidator.values.employeeMobile"
              @change="handleOnChange"
            />
            <div class="m-error-message"></div>
          </div>
          <div class="l-3 p-r-6 m-popup-field">
            <m-tooltip text="Điện thoại cố định">
              <template v-slot:children>
                <label class="m-label" for="employeeFax">
                  <span class="m-label-text">ĐT cố định</span>
                </label>
              </template>
            </m-tooltip>
            <m-input
              name="employeeFax"
              id="employeeFax"
              tabindex="14"
              :value="formValidator.values.employeeFax"
              @change="handleOnChange"
            />
            <div class="m-error-message"></div>
          </div>
          <div class="l-3 m-popup-field">
            <label class="m-label" for="employeeEmail">
              <span class="m-label-text">Email</span>
            </label>
            <m-tooltip
              position="bottom"
              :text="
                formValidator.touched.employeeEmail &&
                formValidator.errors.employeeEmail
              "
            >
              <template v-slot:children>
                <m-input
                  name="employeeEmail"
                  id="employeeEmail"
                  tabindex="15"
                  :value="formValidator.values.employeeEmail"
                  :class="{
                    'm-input-error':
                      formValidator.touched.employeeEmail &&
                      formValidator.errors.employeeEmail,
                  }"
                  @input="handleOnChange"
                />
              </template>
            </m-tooltip>
            <div class="m-error-message"></div>
          </div>
        </div>
        <div class="grid">
          <div class="l-3 p-r-6 m-popup-field">
            <label class="m-label" for="bankAccount">
              <span class="m-label-text">Tài khoản ngân hàng</span>
            </label>
            <m-input
              name="bankAccount"
              id="bankAccount"
              tabindex="16"
              :value="formValidator.values.bankAccount"
              @change="handleOnChange"
            />
            <div class="m-error-message"></div>
          </div>
          <div class="l-3 p-r-6 m-popup-field">
            <label class="m-label" for="bankName">
              <span class="m-label-text">Tên ngân hàng</span>
            </label>
            <m-input
              name="bankName"
              id="bankName"
              tabindex="17"
              :value="formValidator.values.bankName"
              @change="handleOnChange"
            />
            <div class="m-error-message"></div>
          </div>
          <div class="l-3 m-popup-field">
            <label class="m-label" for="bankAddress">
              <span class="m-label-text">Chi nhánh</span>
            </label>
            <m-input
              name="bankAddress"
              id="bankAddress"
              tabindex="18"
              :value="formValidator.values.bankAddress"
              @change="handleOnChange"
            />
            <div class="m-error-message"></div>
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
