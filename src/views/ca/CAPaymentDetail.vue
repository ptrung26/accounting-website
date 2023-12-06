<template>
  <div class="m-popup payment-detail">
    <div class="m-popup-box m-popup-box--full">
      <div class="m-popup-header">
        <button class="button btn-recent-log">
          <div class="m-icon m-icon-recent-log"></div>
        </button>
        <p class="title">Phiếu chi {{ paymentForm.values.refnoFinance }}</p>
        <m-combobox
          class="header-detail-input"
          :defaultValue="{
            label: '6. Chi khác',
            value: 0,
          }"
          :list="[
            {
              label: '6. Chi khác',
              value: 0,
            },
          ]"
          propText="label"
          propValue="value"
          :readonly="formMode === $MISAEnum.FormType.View"
          checkedKey="value"
        ></m-combobox>
        <div class="m-popup-buttons">
          <m-tooltip position="top" text="Giúp (F1)">
            <template v-slot:children>
              <m-button-icon class="m-icon-help"></m-button-icon>
            </template>
          </m-tooltip>
          <m-tooltip position="top" text="Đóng (ESC)">
            <template v-slot:children>
              <m-button-icon
                class="m-icon-close"
                tabindex="-1"
                @click="handleOnCloseForm"
              ></m-button-icon>
            </template>
          </m-tooltip>
        </div>
      </div>
      <div class="m-popup-body">
        <div class="grid w-full">
          <div class="l-8 p-r-16">
            <div class="grid m-b-8">
              <div class="l-5 p-r-12">
                <div class="m-label-text">Mã đối tượng</div>
                <m-tooltip
                  position="bottom"
                  :text="
                    paymentForm.touched.supplier && paymentForm.errors.supplier
                  "
                  :tooltipType="$MISAEnum.TooltipType.Error"
                >
                  <template v-slot:children>
                    <m-combobox
                      ref="supplier"
                      name="supplier"
                      class="w-full"
                      :readonly="formMode === $MISAEnum.FormType.View"
                      urlAPI="/Supplier"
                      :cbbType="1"
                      :columns="[
                        {
                          field: 'supplierCode',
                          label: 'Đối tượng',
                          width: 120,
                          minWidth: 120,
                        },
                        {
                          field: 'supplierName',
                          label: 'Tên đối tượng',
                          width: 150,
                          minWidth: 150,
                        },
                        {
                          field: 'taxCode',
                          label: 'Mã số thuế',
                          width: 120,
                          minWidth: 120,
                        },
                        {
                          field: 'address',
                          label: 'Địa chỉ',
                          width: 180,
                          minWidth: 180,
                        },
                        {
                          field: 'telephone',
                          label: 'Số điện thoại',
                          width: 120,
                          minWidth: 120,
                        },
                      ]"
                      propText="supplierCode"
                      propValue="supplierId"
                      :defaultValue="{
                        supplierCode: payment?.accountObjectCode,
                        supplierId: payment?.accountObjectId,
                      }"
                      @update-combobox="handleOnComboboxChange"
                      :tabindex="1"
                      checkedKey="supplierId"
                      :messageNotFound="
                        this.$MISAResource.VI.ErrorMessage.PaymentDetail
                          .SuppliderCodeIsNotExist
                      "
                      @show-error="
                        (message) => {
                          paymentForm.errors.supplier = message;
                          paymentForm.touched.supplier = true;
                        }
                      "
                    ></m-combobox>
                  </template>
                </m-tooltip>
              </div>
              <div class="l-7">
                <div class="m-label-text">Tên đối tượng</div>
                <m-input
                  name="accountObjectName"
                  :value="payment?.accountObjectName"
                  :disable="formMode === $MISAEnum.FormType.View"
                  @update:modelValue="
                    (val) => {
                      this.handleChangeInput('accountObjectName', val);
                    }
                  "
                  class="w-full bg-white"
                  @focus="() => (this.isTableFocus = false)"
                  tabindex="2"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8">
              <div class="l-5 p-r-12">
                <div class="m-label-text">Người nhận</div>
                <m-input
                  name="contactName"
                  :value="paymentForm.values.contactName"
                  @change="handleOnChange"
                  :disable="formMode === $MISAEnum.FormType.View"
                  class="w-full bg-white"
                  tabindex="3"
                  @focus="() => (this.isTableFocus = false)"
                ></m-input>
              </div>
              <div class="l-7">
                <div class="m-label-text">Địa chỉ</div>
                <m-input
                  class="w-full bg-white"
                  name="account_object_address"
                  :value="paymentForm.values.accountObjectAddress"
                  v-model="paymentForm.values.accountObjectAddress"
                  :disable="formMode === $MISAEnum.FormType.View"
                  tabindex="4"
                  maxlength="255"
                  @focus="() => (this.isTableFocus = false)"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8 w-full">
              <div class="l-12">
                <div class="m-label-text">Lý do chi</div>
                <m-input
                  class="w-full bg-white"
                  name="journal_memo"
                  :value="paymentForm.values.journalMemo"
                  @change="handleOnChange"
                  @input="handleOnInput"
                  :disable="formMode === $MISAEnum.FormType.View"
                  tabindex="5"
                  @focus="() => (this.isTableFocus = false)"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8">
              <div class="l-5 p-r-12">
                <div class="m-label-text">Nhân viên</div>
                <m-tooltip
                  position="bottom"
                  :text="
                    paymentForm.touched.employee && paymentForm.errors.employee
                  "
                  :tooltipType="$MISAEnum.TooltipType.Error"
                >
                  <template v-slot:children>
                    <m-combobox
                      ref="employee"
                      name="employee"
                      class="w-full"
                      :readonly="formMode === $MISAEnum.FormType.View"
                      :cbbType="1"
                      urlAPI="Employees"
                      :columns="[
                        {
                          field: 'employeeCode',
                          label: 'Mã nhân viên',
                        },
                        {
                          field: 'fullName',
                          label: 'Tên nhân viên',
                        },
                        {
                          field: 'departmentName',
                          label: 'Đơn vị',
                        },
                        {
                          field: 'employeeMobile',
                          label: 'ĐT di động',
                          tooltip: 'Điện thoại di động',
                        },
                      ]"
                      propText="fullName"
                      propValue="employeeId"
                      :defaultValue="{
                        employeeId: this.payment?.employeeId,
                        fullName: this.payment?.fullName,
                      }"
                      :messageNotFound="
                        this.$MISAResource.VI.ErrorMessage.PaymentDetail
                          .EmployeeCodeIsNotExist
                      "
                      @show-error="
                        (message) => {
                          paymentForm.errors.employee = message;
                          paymentForm.touched.employee = true;
                        }
                      "
                      @update-combobox="handleOnComboboxChange"
                      :tabindex="6"
                      checkedKey="employeeId"
                    ></m-combobox> </template
                ></m-tooltip>
              </div>
              <div class="l-7">
                <div class="m-label-text">Kèm theo</div>
                <m-input
                  placeholder="Số lượng"
                  :disable="formMode === $MISAEnum.FormType.View"
                  :value="paymentForm.values.documentIncluded"
                  @change="
                    (e) =>
                      (paymentForm.values.documentIncluded = e.target.value)
                  "
                  class="bg-white"
                  tabindex="6"
                  :style="{ 'text-align': 'right' }"
                  @focus="() => (this.isTableFocus = false)"
                  :inputType="this.$MISAEnum.DataType.Number"
                  maxlength="14"
                ></m-input>
                <span class="m-l-6">chứng từ gốc</span>
              </div>
            </div>
          </div>
          <div class="l-4 grid">
            <div class="l-4 grid">
              <div class="l-12 m-b-8">
                <div class="m-label-text">Ngày hạch toán</div>
                <m-input
                  :disabled="formMode === $MISAEnum.FormType.View"
                  ref="postedDate"
                  id="postedDate"
                  type="date"
                  :class="{
                    'w-full': true,
                    'bg-white': true,
                    'm-input-error':
                      paymentForm.touched.pos && paymentForm.errors.postedDate,
                    'm-input-disabed': formMode === $MISAEnum.FormType.View,
                  }"
                  :value="paymentForm.values.postedDate"
                  :tabindex="7"
                  @change="
                    (event) => {
                      handleChangeDateTime(event.target.value, 'postedDate');
                    }
                  "
                />
              </div>
              <div class="l-12 m-b-8">
                <div class="m-label-text">Ngày phiếu chi</div>
                <m-tooltip
                  position="bottom"
                  :text="
                    paymentForm.touched.refDate && paymentForm.errors.refDate
                  "
                  :tooltipType="$MISAEnum.TooltipType.Error"
                >
                  <template v-slot:children>
                    <m-input
                      :disabled="formMode === $MISAEnum.FormType.View"
                      type="date"
                      name="refDate"
                      id="refDate"
                      :class="{
                        'w-full': true,
                        'bg-white': true,
                        'm-input-error':
                          paymentForm.touched.refDate &&
                          paymentForm.errors.refDate,
                        'm-input-disabed': formMode === $MISAEnum.FormType.View,
                      }"
                      :value="paymentForm.values.refDate"
                      :tabindex="8"
                      @blur="
                        (event) =>
                          handleChangeDateTime(event.target.value, 'refDate')
                      "
                    />
                  </template>
                </m-tooltip>
              </div>
              <div class="l-12">
                <div class="m-label-text">Số phiếu chi</div>
                <m-tooltip
                  position="bottom"
                  :text="
                    paymentForm.touched.refnoFinance &&
                    paymentForm.errors.refnoFinance
                  "
                  :tooltipType="$MISAEnum.TooltipType.Error"
                >
                  <template v-slot:children>
                    <m-input
                      name="refno_finance"
                      :class="{
                        'm-input-error':
                          paymentForm.touched.refnoFinance &&
                          paymentForm.errors.refnoFinance,
                      }"
                      tabindex="8"
                      v-model="paymentForm.values.refnoFinance"
                      :disable="formMode === $MISAEnum.FormType.View"
                      :validator="paymentForm.validator.refnoFinance"
                      class="w-full bg-white"
                      ref="refnoFinance"
                      @update:error="
                        (error) => {
                          paymentForm.touched.refnoFinance = true;
                          paymentForm.errors.refnoFinance = error;
                        }
                      "
                      @focus="() => (this.isTableFocus = false)"
                    ></m-input>
                  </template>
                </m-tooltip>
              </div>
            </div>
            <div class="l-8 summary-info">
              <p class="summary-info-text">Tổng tiền</p>
              <p class="summary-info-number">
                {{ this.$helper.formatMoney(paymentForm.values.totalAmount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-popup-detail">
        <p class="tab-nav">Hạch toán</p>
        <m-table
          :columns="detailColumns"
          :data="paymentDetails"
          @update-data="(newData) => (this.paymentDetails = [...newData])"
          @combobox-update="handleComboboxTableUpdate"
          @delete-row-one="handleDeleteRowOfTable"
          @value-invalid="handleValidateTableValue"
          @blur-table="handleFocusNextElemntFromTable"
          :isShowMethod="false"
          :isShowIndex="true"
          :fColumns="fColumns"
          :fData="fData"
          :tableMode="tableMode"
          :valiator="paymentDetailValidator"
          ref="paymentTable"
          :errors="paymentDetailErrors"
          :tabindex="9"
          :isTableFocus="isTableFocus"
          @focus="() => (this.isTableFocus = true)"
        ></m-table>
        <div class="btn-grid-control m-t-8">
          <m-button
            ref="add-row"
            class="m-btn-seconary m-r-8"
            :disable="formMode === $MISAEnum.FormType.View"
            @click="handleAddNewDetailToTable"
            tabindex="10"
            @keydown.tab="handleKeyDownTab"
            >Thêm dòng</m-button
          >
          <m-button
            class="m-btn-seconary"
            :disable="formMode === $MISAEnum.FormType.View"
            @click="handleRemoveAllDetailsFromTable(false)"
            tabindex="11"
            ref="delete-row"
            >Xóa hết dòng</m-button
          >
        </div>
      </div>
      <div class="m-popup-footer">
        <m-button
          class="m-btn-transparent"
          tabindex="15"
          @click="this.$router.push('/CA/CaPayment')"
          @blur="handleSetFocus('supplier')"
          @focus="() => (this.isTableFocus = false)"
          >Hủy</m-button
        >
        <div>
          <template v-if="formMode !== $MISAEnum.FormType.View">
            <m-button
              class="m-btn-transparent m-r-6"
              tabindex="14"
              @click="handleExecuteAction(this.$MISAEnum.AddStatus.AddAndView)"
              @focus="() => (this.isTableFocus = false)"
              >Cất</m-button
            >
            <m-combo-button
              :options="[
                {
                  text: 'Cất và thêm',
                  value: $MISAEnum.AddStatus.AddAndSave,
                },
                {
                  text: 'Cất và đóng',
                  value: $MISAEnum.AddStatus.Add,
                },
              ]"
              :defaultValue="{
                text: 'Cất và đóng',
                value: 1,
              }"
              @call-action="(option) => handleExecuteComboboxOption(option)"
              @combobtn-focus="() => (this.isTableFocus = false)"
              :comboboxType="1"
              :tabindex="13"
            >
            </m-combo-button>
          </template>
          <template v-else>
            <m-button
              class="m-btn-transparent m-r-6"
              @click="handleExecuteAction"
              tabindex="13"
              >Sửa</m-button
            >
            <m-button tabindex="12">Ghi sổ</m-button>
          </template>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <!-- Error Popup -->
    <m-dialog ref="dialog"></m-dialog>
  </Teleport>
  <teleport to="body">
    <m-toast-list :list="toastList" position="top-right"></m-toast-list>
  </teleport>
</template>
<script>
import caPaymentService from "@/services/caPaymentService.js";
import caPaymentDetailService from "@/services/caPaymentDetailService";
/* eslint-disable */
import caPayementService from "@/services/caPaymentService.js";
import caAccountService from "@/services/caAccountService";
export default {
  props: {
    id: { type: String, default: null },
    formType: { type: String, default: null },
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
        JSON.stringify({ ...this.paymentForm.values })
      ) {
        // Hiện thị dialog thông báo có lưu trữ lại dữ liệu trước khi đóng không
        const oke = await this.$refs.dialog?.show({
          message: this.$MISAResource.VI.Dialog.SaveDataBeforeCloseForm,
          backButton: this.$MISAResource.VI.Dialog.backButton,
          cancelButton: this.$MISAResource.VI.Dialog.cancelButton,
          icon: "m-icon-info",
        });

        // Nếu ok thì thực hiện action ngược lại thì đóng form
        if (oke) {
          await this.handleOnSubmit(this.$MISAEnum.AddStatus.AddAndSave);
        } else {
          this.$router.push("/CA/CaPayment");
        }
      } else {
        this.$router.push("/CA/CaPayment");
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
      this.paymentForm.values[name] = value.trim();
      this.paymentForm.touched[name] = true;

      // Validate các giá trị
      this.paymentValidator();
    },

    /**
     * Khi giá trị input thay đổi
     * Author: ptrung26 (22/11/2023)
     * @param {string} value
     */
    handleChangeInput(name, value) {
      if (name === "accountObjectName") {
        let paymentDetails = [...this.paymentDetails];
        paymentDetails.forEach((item) => {
          if (item.description === this.paymentForm.values.journalMemo) {
            item.description = `Chi tiền cho ${value}`;
          }
        });
        this.paymentDetails = [...paymentDetails];

        this.paymentForm.values.journalMemo = `Chi tiền cho ${value}`;
      }
    },

    /**
     * Xử lý sự kiện oninput
     * Author: ptrung26 (18/11/2023)
     * @param {Object} e
     */
    handleOnInput(e) {
      let { name, value } = e.target;
      if (name === "journal_memo") {
        let paymentDetails = [...this.paymentDetails];
        paymentDetails.forEach((item) => {
          if (item.description === this.paymentForm.values.journalMemo) {
            item.description = value;
          }
        });
        this.paymentDetails = [...paymentDetails];

        this.paymentForm.values.journalMemo = value;
      }
    },

    /**
     * Xử lý khi combobox thay đổi
     * Author: ptrung26 (23/10/2023)
     * @param {String} name Tên của combobox
     * @param {String} value giá trị thay đổi
     */
    handleOnChangeValueCombobox(name, value) {
      this.paymentForm.values[name] = value;
      this.paymentForm.touched[name] = true;
      this.paymentValidator();
    },

    /**
     * Xử lý khi thay đổi giá trị combobox
     * Author: ptrung26 (24/10/2023)
     * @param {*} e event input
     * @param {*} ref combobox ref nếu có
     */
    handleOnChangeCheckbox(e, ref) {
      const { checked, name } = e.target;
      this.paymentForm.values[name] = checked;
      this.paymentForm.touched[name] = true;
      // Nếu checkbox là false thì set lại combobox về mặc định của nó nếu có
      if (!checked) {
        if (ref && this.$refs[ref]) {
          this.$refs[ref].handleReset();
        }
      }
      this.paymentValidator();
    },

    /**
     * Xử lý reset form
     * Author: ptrung26 (31/08/2023)
     */
    handleResetForm() {
      for (let key of Object.keys(this.paymentForm.values)) {
        this.paymentForm.values[key] = null;
      }
      if (this.$refs.supplier) {
        this.$refs.supplier.set(null, null);
      }
      if (this.$refs.employee) {
        this.$refs.employee.set(null, null);
      }
      this.handleRemoveAllDetailsFromTable(true);
    },

    /**
     * Xử lý hiện dialog thông báo cho người dùng
     * Author: ptrung26 (31/08/2023)
     * @param {object} toast thông tin toast muốn hiện lên dialog
     */
    async handleShowDialog(toast) {
      await this.$refs.dialog?.show({
        message: toast.message,
        icon: "m-icon-error m-48",
      });
    },

    /**
     * Xử lý lỗi xảy ra khi validate payemnt input
     * Author: ptrung26 (19/08/2023)
     * Modifier: ptrung26 (12/11/2023)
     */
    paymentValidator() {
      this.paymentForm.errors = {};
      for (const key in this.paymentForm.validator) {
        const value = this.paymentForm.values[key];

        const error = this.paymentForm.validator[key](value);

        // Kiểm tra nếu có lỗi, thêm vào errors với key tương ứng
        if (error) {
          this.paymentForm.errors[key] = error;
        } else {
          // Nếu không có lỗi, đảm bảo xóa bỏ lỗi cũ trong trường hợp đã validate lại và không còn lỗi nữa
          if (this.paymentForm.errors[key]) {
            delete this.paymentForm.errors[key];
          }
        }
      }
    },

    /**
     * Xử lý lỗi xảy ra khi validate payemnt detail input
     * Author: ptrung26 (19/08/2023)
     * Modifier: ptrung26 (12/11/2023)
     */
    paymentDetailValidator() {
      const errors = {};
      this.paymentDetails.forEach((item, index) => {
        this.detailColumns.forEach((column) => {
          if (column.validator && typeof column.validator === "function") {
            const error = column.validator(item[column.field]);
            if (error) {
              if (!errors[index]) {
                errors[index] = {};
              }
              errors[index][column.field] = error;
            }
          }
        });
      });
      this.paymentDetailErrors = { ...errors, ...this.paymentDetailErrors };
    },

    /**
     * Xử lý sự kiện submit form
     * Author: ptrung26 (19/08/2023)
     * @param {string} type kiểu của form
     */
    async handleOnSubmit(type) {
      // Validate trước khi submit
      this.paymentValidator();
      this.paymentDetailValidator();
      const paymentErrorKeys = Object.keys(this.paymentForm.errors);
      const paymentDetailErrorKeys = Object.keys(this.paymentDetailErrors);
      // Nếu có lỗi thì hiện dialog thông tin lỗi
      if (paymentErrorKeys.length) {
        this.alertErrorMessage = this.paymentForm.errors[paymentErrorKeys[0]];
        for (let key of paymentErrorKeys) {
          this.paymentForm.touched[key] = true;
        }

        // hiện thị dialog
        await this.$refs.dialog?.show({
          message: this.alertErrorMessage,
          icon: "m-icon-error m-48",
        });

        // focus lại input lỗi
        this.$nextTick(() => {
          this.handleSetFocus(paymentErrorKeys[0]);
        });
      } else if (paymentDetailErrorKeys.length > 0) {
        let firstErrorFields =
          this.paymentDetailErrors[paymentDetailErrorKeys[0]];
        let firstErrorKey = Object.keys(firstErrorFields)[0];
        this.alertErrorMessage = firstErrorFields[firstErrorKey];
        // hiện thị dialog
        this.isTableFocus = false;
        await this.$refs.dialog.show({
          icon: "m-icon-error m-48",
          message: this.alertErrorMessage,
        });
        this.isTableFocus = true;
        const field = Object.keys(
          this.paymentDetailErrors[paymentDetailErrorKeys[0]]
        )[0];
        let cellFocusIdx = null;
        let rowFocusIdx = null;
        for (let i = 0; i < this.detailColumns.length; ++i) {
          if (this.detailColumns[i] && this.detailColumns[i].field === field) {
            cellFocusIdx = i;
            rowFocusIdx = parseInt(paymentDetailErrorKeys[0]);
          }
        }

        this.$refs.paymentTable.handleSetFocusCell(rowFocusIdx, cellFocusIdx);
      } else {
        this.alertErrorMessage = "";
        if (
          this.formMode === this.$MISAEnum.FormType.Add ||
          this.formMode === this.$MISAEnum.FormType.Replication
        ) {
          await this.handleAddPayment(type);
        }
        if (this.formMode === this.$MISAEnum.FormType.Edit) {
          await this.handleEditPayment(type);
        }
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
     * Xử lý khi thực thi action như sửa nhanh, cất, ..
     * Author: ptrung26 (30/10/2023)
     */
    handleExecuteAction(type) {
      if (this.formMode === this.$MISAEnum.FormType.View) {
        this.formMode = this.$MISAEnum.FormType.Edit;
        this.tableMode = this.$MISAEnum.TableMode.ViewAndEdit;
        this.handleSetFocus("supplier");
      } else if (this.formMode == this.$MISAEnum.FormType.Edit) {
        this.handleOnSubmit(this.$MISAEnum.AddStatus.AddAndView);
      } else if (
        this.formMode === this.$MISAEnum.FormType.Add ||
        this.formMode === this.$MISAEnum.FormType.Replication
      ) {
        this.handleOnSubmit(type);
      }
    },

    /**
     * Xử lý thêm mới một chi tiết phiếu chi rỗng vào bảng
     * Author: ptrung26 (08/11/2023)
     */
    handleAddNewDetailToTable() {
      let paymentDetail;
      let length = this.paymentDetails.length;
      if (length === 0) {
        paymentDetail = {
          description: this.paymentForm.values.journalMemo,
          debitAccount: "",
          creditAccount: "",
          amount: 0,
          accountObjectId: null,
          accountObjectName: "",
          rpId: this.paymentForm.values.reId,
        };
      } else {
        paymentDetail = { ...this.paymentDetails[length - 1] };
        paymentDetail.amount = 0;
        delete paymentDetail.rpdId;
      }
      let details = [...this.paymentDetails];
      details.push(paymentDetail);
      this.paymentDetails = [...details];
    },

    /**
     * Xử lý xóa toàn bộ chi tiết phiếu chi
     * Author: ptrung26 (08/11/2023)
     */
    async handleRemoveAllDetailsFromTable(isConfirm = false) {
      if (!isConfirm) {
        const oke = await this.$refs.dialog.show({
          message:
            this.$MISAResource.VI.Dialog.CAPayment
              .ConfirmDeleteAllPaymentDetailRow,
          cancelButton: this.$MISAResource.VI.Dialog.cancelButton,
          icon: "m-icon-warning",
        });
        if (oke) {
          this.paymentDetails = [];
          this.handleAddNewDetailToTable();
        }
      } else {
        this.paymentDetails = [];
        this.handleAddNewDetailToTable();
      }
    },

    /**
     * Xử lý khi combobox thay đổi
     * Author: ptrung26 (08/11/2023)
     * @param {Object} params
     */
    handleOnComboboxChange(params) {
      let item = params.value;
      if (params.name === "supplier") {
        console.log(item);
        let supplierName = item.supplierName || "";
        let supplierId = item.supplierId || null;
        let supplierCode = item.supplierCode || null;
        let address = item.address || "";
        this.paymentForm.values.accountObjectId = supplierId;
        this.paymentForm.values.contactName = supplierName;
        this.paymentForm.values.accountObjectAddress = address;
        let paymentDetails = [...this.paymentDetails];
        paymentDetails.forEach((paymentDetail) => {
          if (
            paymentDetail.description === this.paymentForm.values.journalMemo
          ) {
            paymentDetail.description = `Chi tiền cho ${supplierName}`;
          }
        });
        this.paymentDetails = [...paymentDetails];
        this.paymentForm.values.journalMemo = `Chi tiền cho ${supplierName}`;
        this.payment.accountObjectName = supplierName;
        this.payment.accountObjectId = supplierId;
        this.payment.accountObjectCode = supplierCode;
        let detailList = [...this.paymentDetails];
        detailList.forEach((detail) => {
          detail.accountObjectId = supplierId;
          detail.accountObjectName = supplierName;
          detail.accountObjectCode = supplierCode;
        });
        this.paymentDetails = [...detailList];
      } else if (params.name === "employee") {
        this.paymentForm.values.employeeId = item.employeeId;
      }
    },

    /**
     * Xử lý khi thay đổi trường date
     * Author: ptrung26 (13/11/2023)
     * @param {String} field Tên trường
     */
    handleChangeDateTime(date, field) {
      // if (!isNaN(new Date(date))) {
      //   date = this.$helper.convertDate(
      //     new Date(),
      //     this.$MISAEnum.DateType.yyyy__mm__dd,
      //     "-"
      //   );
      // }
      if (field === "postedDate") {
        if (
          this.paymentForm.values.postedDate === this.paymentForm.values.refDate
        ) {
          this.paymentForm.values.refDate = date;
        }
        this.paymentForm.values.postedDate = date;
      }

      if (field === "refDate") {
        console.log(date);
        this.paymentForm.values.refDate = date;
      }

      if (this.paymentForm.validator[field]) {
        let validatorFunc = this.paymentForm.validator[field];
        let error = validatorFunc(this.paymentForm.values[field]);

        if (error) {
          this.paymentForm.errors[field] = error;
          this.paymentForm.touched[field] = true;
        } else {
          delete this.paymentForm.errors[field];
        }
      }
    },

    /**
     * Xử lý khi combobox của table thay đổi
     * Author: ptrung26 (12/11/2023)
     * @param {Object} val
     */
    handleComboboxTableUpdate(val) {
      const { params, index } = val;
      const item = params.value;
      const name = params.name;
      if (name === "supplier") {
        const details = [...this.paymentDetails];
        details[index].accountObjectId = item.supplierId;
        details[index].accountObjectCode = item.supplierCode;
        details[index].accountObjectName = item.supplierName;
        this.paymentDetails = [...details];
      }
    },

    /**
     * Xử lý xóa khỏi table
     * @param {Integer} index
     */
    handleDeleteRowOfTable(index) {
      if (this.paymentDetails.length === 1) {
        return;
      }
      const filters = [...this.paymentDetails];
      filters.splice(index - 1, 1);
      this.paymentDetails = [...filters];
    },

    /**
     * Xử lý validate table value
     * @param {Object} params
     */
    handleValidateTableValue(params) {
      const { field, message, rowIndex } = params;
      if (!this.paymentDetailErrors[rowIndex]) {
        this.paymentDetailErrors[rowIndex] = {};
      }
      if (message) {
        this.paymentDetailErrors[rowIndex][field] = message;
      } else {
        delete this.paymentDetailErrors[rowIndex];
      }
    },

    /**
     * Xóa toast khỏi màn hình
     * Author: ptrung26 (26/09/2023)
     * @param {object} toast thông tin toast
     */
    removeToast(toast = {}) {
      if (!toast.id) {
        return;
      }
      const indexToRemove = this.toastList.findIndex(
        (item) => item.id === toast.id
      );
      if (indexToRemove !== -1) {
        this.toastList.splice(indexToRemove, 1);
      }
    },

    /**
     * Thêm toast mới
     * Author: ptrung26 (26/09/2023)
     * @param {object} toast thông tin toast
     */
    addToast(toast) {
      if (toast === null || toast === undefined) {
        return;
      }

      this.toastList.push(toast);

      // Lên lịch xóa mục sau 5 giây
      setTimeout(() => {
        this.removeToast(toast);
      }, 5000);
    },

    /**
     * Xử lý xóa toast message
     * Author: ptrung26 (18/10/2023)
     */
    handleCloseToast(toastId) {
      this.toastList.pop(toastId);
    },

    /**
     * Xử lý set focus cho element
     * Author: ptrung26 (25/11/2023)
     * @param {string} elementRef
     */
    handleSetFocus(elementRef) {
      if (elementRef && this.$refs[elementRef]) {
        this.$refs[elementRef].focus();
      }
    },

    /**
     * XỬ lý comboboxobx
     * Author: trung26 (19/11/2023)
     */
    handleExecuteComboboxOption(option) {
      if (option.value === this.$MISAEnum.AddStatus.Add) {
        this.handleOnSubmit(this.$MISAEnum.AddStatus.Add);
      } else {
        this.handleOnSubmit(this.$MISAEnum.AddStatus.AddAndSave);
      }
    },

    /**
     * Xử lý sự kiện keydown tab
     * Author: ptrung26 (20/11/2023)
     */
    handleKeyDownTab(event) {
      if (event.shiftKey && event.key === "Tab") {
        event.preventDefault();
        this.isTableFocus = true;
      }
    },

    /**
     * Xử lý focus vào phần tử nào khi blur ra khỏi table
     * Author: ptrung26 (22/11/2023)
     * @param {Boolean} isFocusNextElement Trạng thái focus trước hay sau table
     */
    handleFocusNextElemntFromTable(isFocusNextElement) {
      if (isFocusNextElement) {
        this.handleSetFocus("add-row");
      } else {
        this.handleSetFocus("refnoFinance");
      }
      this.isTableFocus = false;
    },

    /**
     * Xử lý sự kiện keypress
     * Author: ptrung26 - 29/12/2023
     */
    handleKeyPress(event) {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        this.handleExecuteAction(this.$MISAEnum.AddStatus.AddAndView);
      }
    },

    /**************** API **************/
    /**
     * Lấy thông tin phiếu chi
     * Author: ptrung (07/11/2023)
     * @param {String} id id của phiếu chi
     */
    async handleGetPaymentData(id) {
      try {
        const paymentRes = await caPaymentService.getById(id);
        const paymentDetailRes = await caPaymentDetailService.getByPaymentId(
          id
        );
        this.payment = paymentRes.data.data;
        Object.keys(this.paymentForm.values).forEach((key) => {
          if (key in this.payment) {
            this.paymentForm.values[key] = this.payment[key];
          }
        });
        const postedDate = this.$helper.convertDate(
          this.payment.postedDate,
          this.$MISAEnum.DateType.yyyy__mm__dd,
          "-"
        );
        const refDate = this.$helper.convertDate(
          this.payment.refDate,
          this.$MISAEnum.DateType.yyyy__mm__dd,
          "-"
        );
        this.paymentForm.values = {
          ...this.paymentForm.values,
          postedDate,
          refDate,
        };

        this.paymentDetails = paymentDetailRes.data.data;
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xử lý thêm phiếu chi mới
     * Author: ptrung26 (10/11/2023)
     */
    async handleAddPayment(type) {
      let paymentDetailList = [];
      let paymentForm = this.paymentForm;

      if (!paymentForm.values.documentIncluded) {
        paymentForm.values.documentIncluded = 0;
      }

      for (let key in paymentForm.values) {
        if (typeof paymentForm.values[key] === "string") {
          paymentForm.values[key] = paymentForm.values[key].trim();
        }
      }

      this.paymentDetails.forEach((detail) => {
        let paymentDetail = {
          description: "",
          debitAccount: "",
          creditAccount: "",
          amount: 0,
          accountObjectId: null,
        };
        Object.keys(detail).forEach((key) => {
          if (key in paymentDetail) {
            let value = detail[key];
            if (typeof value === "string") {
              value = value.trim();
            }
            paymentDetail[key] = value;
          }
        });
        paymentDetailList.push({ ...paymentDetail });
      });

      try {
        const res = await caPayementService.post(
          paymentForm.values,
          paymentDetailList
        );
        if (res.status === this.$MISAEnum.HttpStatus.CREATED) {
          this.addToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.Payment.Add,
          });

          if (type === this.$MISAEnum.AddStatus.Add) {
            this.$router.push("/CA/CaPayment");
          } else if (type === this.$MISAEnum.AddStatus.AddAndView) {
            this.formMode = this.$MISAEnum.FormType.View;
            this.tableMode = this.$MISAEnum.TableMode.View;
            const id = res.data.data.id;
            this.$router.push({ name: "CAPaymentDetail", params: { id } });
          } else {
            this.handleResetForm();
            await this.handleGetNewCode();
          }

          this.defaultValue = { ...this.paymentForm.values };
        }
      } catch (err) {
        const { errorKey, errorMessage, status, errorCode, toast } = err;
        if (status === 400) {
          if (errorCode === 400) {
            if (errorKey) {
              const errorKeyCamelCase = this.$helper.camelSentence(errorKey);
              await this.handleShowDialog(toast);
              // Xử lý focus vào input lỗi
              this.handleSetFocus(errorKeyCamelCase);
              // Hiện thị lỗi
              this.paymentForm.errors[errorKeyCamelCase] = errorMessage;
              this.paymentForm.touched[errorKeyCamelCase] = true;
            }
          } else if (errorCode == 409) {
            await this.handleShowDialog(toast);
            // Xử lý focus vào input lỗi
            this.handleSetFocus("refnoFinance");
            // Hiện thị lỗi
            this.paymentForm.errors["refnoFinance"] =
              this.$MISAResource.VI.ErrorMessage.PaymentDetail.PaymentCodeIsExist(
                this.paymentForm.values.refnoFinance
              );
            this.paymentForm.touched["refnoFinance"] = true;
          }
        } else {
          this.addToast(toast);
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
      this.accountList = accounts.filter(
        (account) => account.isParent === false
      );
      console.log(this.accountList);
    },

    /**
     * Xử lý sửa phiếu chi
     * Author: ptrung26 (30/10/2023)
     */
    async handleEditPayment(type) {
      let paymentDetailList = [];
      this.paymentDetails.forEach((detail) => {
        let paymentDetail = {
          rpId: "",
          description: "",
          debitAccount: "",
          creditAccount: "",
          amount: 0,
          accountObjectId: null,
          rpdId: "",
        };
        Object.keys(detail).forEach((key) => {
          if (key in paymentDetail) {
            paymentDetail[key] = detail[key];
          }
        });
        if (!paymentDetail.rpdId) {
          delete paymentDetail.rpdId;
        }
        paymentDetailList.push({ ...paymentDetail });
      });

      try {
        const res = await caPayementService.put(
          this.paymentForm.values,
          paymentDetailList
        );
        if (res.status === this.$MISAEnum.HttpStatus.OK) {
          this.addToast({
            id: Date.now(),
            status: this.$MISAEnum.ToastStatus.Success,
            message: this.$MISAResource.VI.SuccessMessage.Payment.Update,
          });
          if (type === this.$MISAEnum.AddStatus.Add) {
            this.$router.push("/CA/CaPayment");
          } else if (type === this.$MISAEnum.AddStatus.AddAndView) {
            this.formMode = this.$MISAEnum.FormType.View;
            this.tableMode = this.$MISAEnum.TableMode.View;
          }

          this.defaultValue = { ...this.paymentForm.values };
        }
      } catch (err) {
        const { errorKey, errorMessage, status, errorCode, toast } = err;
        if (status === 400) {
          if (errorCode === 400) {
            if (errorKey) {
              const errorKeyCamelCase = this.$helper.camelSentence(errorKey);
              await this.handleShowDialog(toast);
              // Xử lý focus vào input lỗi
              this.handleSetFocus(errorKeyCamelCase);
              // Hiện thị lỗi
              this.paymentForm.errors[errorKeyCamelCase] = errorMessage;
              this.paymentForm.touched[errorKeyCamelCase] = true;
            }
          } else if (errorCode == 409) {
            await this.handleShowDialog(toast);

            // Xử lý focus vào input lỗi
            this.handleSetFocus("refnoFinance");
            // Hiện thị lỗi
            this.paymentForm.errors["refnoFinance"] =
              this.$MISAResource.VI.ErrorMessage.PaymentDetail.PaymentCodeIsExist(
                this.paymentForm.values.refnoFinance
              );
            this.paymentForm.touched["refnoFinance"] = true;
          }
        } else {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xử lý lấy mã phiếu chi mới
     * Author: ptrung26 (02/11/2023)
     */
    async handleGetNewCode() {
      try {
        const res = await caPaymentService.getNewCode();
        this.paymentForm.values.refnoFinance = res.data.data;
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },
  },
  data() {
    const context = this;

    return {
      paymentForm: {
        // Giá trị của input
        values: {
          refnoFinance: "",
          journalMemo: "Chi tiền cho",
          totalAmount: 0,
          accountObjectId: null,
          accountObjectAddress: "",
          contactName: "",
          caType: 0,
          postedDate: context.$helper.convertDate(
            new Date(),
            context.$MISAEnum.DateType.yyyy__mm__dd,
            "-"
          ),
          refDate: context.$helper.convertDate(
            new Date(),
            context.$MISAEnum.DateType.yyyy__mm__dd,
            "-"
          ),
          employeeId: null,
          documentIncluded: null,
          reId: "",
        },
        validator: {
          refnoFinance(value) {
            let error = "";
            if (!value) {
              error =
                context.$MISAResource.VI.ErrorMessage.PaymentDetail
                  .RefnoFinanceNotFound;
            }
            const isLastByNumberRegex = /\d$/;
            const isLastByNumber = isLastByNumberRegex.test(value);
            if (!isLastByNumber) {
              error =
                context.$MISAResource.VI.ErrorMessage.PaymentDetail
                  .RefnoFinanceMustLastByNumber;
            }
            return error;
          },
          refDate(value) {
            let error = "";
            let postedDate = new Date(
              context.paymentForm.values.postedDate
            ).getTime();
            let refDate = new Date(value).getTime();
            if (refDate > postedDate) {
              error =
                context.$MISAResource.VI.ErrorMessage.PaymentDetail
                  .RefDateIsGreaterThanPostedDate;
            }
            return error;
          },
        },
        // Các input đã touch
        touched: {},
        // Lỗi của các input sau khi validate
        errors: {},
      },
      paymentDetails: [],
      payment: {},
      detailColumns: [
        {
          label: "Diễn giải",
          field: "description",
          columnType: this.$MISAEnum.ColumnType.Input,
          width: 180,
          minWidth: 180,
        },
        {
          field: "debitAccount",
          text: "debitAccount",
          label: "TK Nợ",
          tooltip: "Tài khoản nợ",
          columnType: this.$MISAEnum.ColumnType.Combobox,
          tableColumns: [
            {
              label: "Số tài khoản",
              field: "accountNumber",
              columnType: this.$MISAEnum.ColumnType.View,
              expander: true,
              width: 120,
              minWidth: 120,
            },
            {
              label: "Tên tài khoản",
              field: "accountName",
              columnType: this.$MISAEnum.ColumnType.View,
            },
          ],
          validator(value) {
            let error = "";
            if (!value) {
              error =
                context.$MISAResource.VI.ErrorMessage.PaymentDetail
                  .DebitAccountIsEmpty;
            }
            return error;
          },
          propText: this.$MISAEnum.GeneralAccount.PropText,
          propValue: this.$MISAEnum.GeneralAccount.PropValue,
          cbbType: 1,
          width: 80,
          minWidth: 80,
          messageNotFound:
            this.$MISAResource.VI.ErrorMessage.AccountDetail
              .DebitAccoutNotFound,
          checkedKey: "accountId",
          list: context.accountList,
        },
        {
          label: "TK Có",
          field: "creditAccount",
          text: "creditAccount",
          tooltip: "Tài khoản có",
          columnType: this.$MISAEnum.ColumnType.Combobox,
          tableColumns: [
            {
              label: "Số tài khoản",
              field: "accountNumber",
              columnType: this.$MISAEnum.ColumnType.View,
              expander: true,
              width: 120,
              minWidth: 120,
            },
            {
              label: "Tên tài khoản",
              field: "accountName",
              columnType: this.$MISAEnum.ColumnType.View,
            },
          ],
          list: context.accountList,
          propText: this.$MISAEnum.GeneralAccount.PropText,
          propValue: this.$MISAEnum.GeneralAccount.PropValue,
          cbbType: 1,
          width: 80,
          minWidth: 80,
          messageNotFound:
            this.$MISAResource.VI.ErrorMessage.AccountDetail
              .CreateAccountNotFound,
          checkedKey: "accountId",
          validator(value) {
            let error = "";
            if (!value) {
              error =
                context.$MISAResource.VI.ErrorMessage.PaymentDetail
                  .CreditAccountIsEmpty;
            }
            return error;
          },
        },
        {
          label: "Số tiền",
          field: "amount",
          columnType: this.$MISAEnum.ColumnType.Input,
          dataType: this.$MISAEnum.DataType.Money,
          width: 200,
          minWidth: 200,
          maxlength: 14,
        },
        {
          name: "supplier",
          label: "Đối tượng",
          field: "accountObjectId",
          text: "accountObjectCode",
          columnType: this.$MISAEnum.ColumnType.Combobox,
          urlAPI: "/Supplier",
          tableColumns: [
            {
              field: "supplierCode",
              label: "Đối tượng",
            },
            {
              field: "supplierName",
              label: "Tên đối tượng",
              minWidth: 120,
              width: 120,
            },
            {
              field: "taxCode",
              label: "Mã số thuế",
            },
            {
              field: "address",
              label: "Địa chỉ",
            },
            {
              field: "telephone",
              label: "Số điện thoại",
            },
          ],
          propText: "supplierCode",
          propValue: "supplierId",
          cbbType: 1,
          width: 120,
          minWidth: 120,
          checkedKey: "accountObjectId",
          position: "bottom-middle",
          comboboxWidth: 900,
          checkedKey: "supplierId",
        },
        {
          label: "Tên đối tượng",
          field: "accountObjectName",
          columnType: this.$MISAEnum.ColumnType.View,
          minWidth: 100,
          width: 100,
        },
        {
          width: 40,
          minWidth: 40,
          columnType: this.$MISAEnum.ColumnType.Button,
          icon: "m-icon-delete m-16",
          method: this.$MISAEnum.TableMethod.DeleteOne,
          textStyle: this.$MISAEnum.ColumnTextStyle.Center,
        },
      ],
      fColumns: [
        {
          width: 180,
          minWidth: 180,
        },
        {
          width: 80,
          minWidth: 80,
        },
        {
          width: 80,
          minWidth: 80,
        },
        {
          label: "Số tiền",
          field: "totalAmount",
          dataType: context.$MISAEnum.DataType.Money,
          columnType: context.$MISAEnum.ColumnType.View,
          width: 200,
          minWidth: 200,
        },
        {
          width: 120,
          minWidth: 120,
        },
        {
          width: 100,
          minWidth: 100,
        },
        {
          width: 40,
          minWidth: 40,
        },
      ],
      formMode: this.$MISAEnum.FormType.View,
      fData: { totalAmount: 0 },
      toastList: [],
      paymentDetailErrors: {},
      isTableFocus: false,
      tableMode: this.$MISAEnum.TableMode.View,
      defaultValue: null,
      accountList: null,
    };
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
  watch: {
    // Khi chi tiết phiếu thay đổi
    paymentDetails: {
      handler(newValue) {
        let details = [...newValue];
        // Cập nhật lại tổng tiền phiếu chi
        let totalAmount = 0;
        if (Array.isArray(details)) {
          details.forEach((item) => {
            if (item?.amount) {
              totalAmount += parseInt(item.amount);
            }
          });
          this.paymentForm.values.totalAmount = totalAmount;
          this.fData.totalAmount = totalAmount;
        }
      },
      immediate: true,
    },
  },
  created() {
    if (this.id) {
      this.handleGetPaymentData(this.id).finally(() => {
        this.defaultValue = { ...this.paymentForm.values };
      });
    } else {
      let hiddenId = localStorage.getItem("id");
      let hiddenFormMode = localStorage.getItem("formType");
      if (hiddenId && hiddenFormMode) {
        this.formMode = parseInt(hiddenFormMode);
        this.handleGetPaymentData(hiddenId).finally(async () => {
          await this.handleGetNewCode();
          this.defaultValue = { ...this.paymentForm.values };
          this.tableMode = this.$MISAEnum.TableMode.ViewAndEdit;
        });
      } else {
        this.handleGetNewCode().finally(() => {
          this.defaultValue = { ...this.paymentForm.values };
        });
        this.formMode = this.$MISAEnum.FormType.Add;
        this.tableMode = this.$MISAEnum.TableMode.ViewAndEdit;
      }
      this.handleAddNewDetailToTable();

      this.$emitter.on("onCloseToast", this.handleCloseToast);
    }
    this.handleGetAllAcounts().finally(() => {
      let columns = [...this.detailColumns];
      columns.forEach((column) => {
        if (
          column.field === "debitAccount" ||
          column.field === "creditAccount"
        ) {
          for (const key in column) {
            if (Object.prototype.hasOwnProperty.call(column, key)) {
              if (key === "list") {
                column[key] = this.accountList;
              }
            }
          }
        }
      });
      this.detailColumns = [...columns];
    });
  },
  mounted() {
    if (this.formMode !== this.$MISAEnum.FormType.View)
      this.$refs.supplier.focus();
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeMount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  },
};
</script>

<style>
.payment-detail .m-popup-box {
  background-color: #eceef1;
  padding: 0;
}
.payment-detail .m-popup-header {
  padding: 16px 16px 12px;
}

.payment-detail .m-popup-buttons {
  display: flex;
  margin-left: auto;
  gap: 0 12px;
}

.payment-detail .btn-recent-log {
  margin-right: 10px;
}
.payment-detail .title {
  font-size: 22px;
  font-family: Misa Bold;
}

.payment-detail .header-detail-input {
  margin-left: 24px;
}

.payment-detail .m-popup-body {
  padding: 6px 20px 12px;
}
.payment-detail .summary-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.payment-detail .summary-info-number {
  font-size: 36px;
  font-family: Misa Medium;
}

.payment-detail .m-popup-detail {
  padding: 0 20px;
  background: #fff;
  flex: 1;
  overflow: atuo;
}

.payment-detail .m-popup-detail .tab-nav {
  padding: 8px 0 8px 8px;
}

.payment-detail .m-popup-footer {
  background: #38393d;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
}

.payment-detail .m-footer {
  bottom: 0 !important;
}
</style>
