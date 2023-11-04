<template>
  <div class="m-popup">
    <div class="m-popup-box m-popup-box--full">
      <div class="m-popup-header">
        <button class="button btn-recent-log">
          <div class="m-icon m-icon-recent-log"></div>
        </button>
        <p class="title">Phiếu chi PC00009</p>
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
          :disable="formType === $MISAEnum.FormType.View"
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
                tabindex="0"
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
                <m-combobox
                  class="w-full"
                  :defaultValue="{}"
                  :disable="formType === $MISAEnum.FormType.View"
                ></m-combobox>
              </div>
              <div class="l-7">
                <div class="m-label-text">Tên đối tượng</div>
                <m-input
                  :value="formValidator.values.accountObjectName"
                  :disable="formType === $MISAEnum.FormType.View"
                  class="w-full"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8">
              <div class="l-5 p-r-12">
                <div class="m-label-text">Người nhận</div>
                <m-input
                  name="account_object_contact_name"
                  :value="formValidator.values.accountObjectContactName"
                  :disable="formType === $MISAEnum.FormType.View"
                  class="w-full"
                ></m-input>
              </div>
              <div class="l-7">
                <div class="m-label-text">Địa chỉ</div>
                <m-input
                  class="w-full"
                  name="account_object_address"
                  :value="formValidator.values.accountObjectAddress"
                  :disable="formType === $MISAEnum.FormType.View"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8 w-full">
              <div class="l-12">
                <div class="m-label-text">Lý do chi</div>
                <m-input
                  class="w-full"
                  name="journal_memo"
                  :value="formValidator.values.journalMemo"
                  :disable="formType === $MISAEnum.FormType.View"
                ></m-input>
              </div>
            </div>
            <div class="grid m-b-8">
              <div class="l-5 p-r-12">
                <div class="m-label-text">Nhân viên</div>
                <m-combobox
                  class="w-full"
                  :disable="formType === $MISAEnum.FormType.View"
                ></m-combobox>
              </div>
              <div class="l-7">
                <div class="m-label-text">Kèm theo</div>
                <m-input
                  placeholder="Số lượng"
                  :disable="formType === $MISAEnum.FormType.View"
                ></m-input>
                <span class="m-l-6">chứng từ gốc</span>
              </div>
            </div>
          </div>
          <div class="l-4 grid">
            <div class="l-4 grid">
              <div class="l-12 m-b-8">
                <div class="m-label-text">Ngày hạch toán</div>
                <date-picker
                  :disabled="formType === $MISAEnum.FormType.View"
                  ref="postedDate"
                  id="postedDate"
                  value-type="YYYY/MM/DD"
                  :title-format="dateFormat"
                  format="YYYY-MM-DD"
                  :input-class="`m-input w-full ${
                    formValidator.touched.pos && formValidator.errors.postedDate
                      ? 'm-input-error'
                      : ''
                  }`"
                  :class="{
                    'm-input-error':
                      formValidator.touched.postedDate &&
                      formValidator.errors.postedDate,
                  }"
                  :input-attr="{ name: 'postedDate' }"
                  v-model:value="formValidator.values.postedDate"
                />
              </div>
              <div class="l-12 m-b-8">
                <div class="m-label-text">Ngày phiếu chi</div>
                <m-tooltip
                  position="bottom"
                  :text="
                    formValidator.touched.refdate &&
                    formValidator.errors.refdate
                  "
                >
                  <template v-slot:children>
                    <date-picker
                      :disabled="formType === $MISAEnum.FormType.View"
                      ref="refdate"
                      id="refdate"
                      value-type="YYYY/MM/DD"
                      format="YYYY-MM-DD"
                      :input-class="`m-input w-full ${
                        formValidator.touched.refdate &&
                        formValidator.errors.refdate
                          ? 'm-input-error'
                          : ''
                      }`"
                      :class="{
                        'm-input-error':
                          formValidator.touched.refdate &&
                          formValidator.errors.refdate,
                      }"
                      :input-attr="{ name: 'refdate' }"
                      v-model:value="formValidator.values.refdate"
                    />
                  </template>
                </m-tooltip>
              </div>
              <div class="l-12">
                <div class="m-label-text">Sổ phiếu chi</div>
                <m-input
                  name="refno_finance"
                  :value="formValidator.values.refnoFinance"
                  :disable="formType === $MISAEnum.FormType.View"
                  class="w-full"
                ></m-input>
              </div>
            </div>
            <div class="l-8 summary-info">
              <p class="summary-info-text">Tổng tiền</p>
              <p class="summary-info-number">
                {{
                  this.$helper.formatMoney(formValidator.values.totalAmountOc)
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="m-popup-detail">
        <p class="tab-nav">Hạch toán</p>
        <m-table :columns="detailColumns" :data="paymentDetails"></m-table>
        <div class="btn-grid-control m-t-8">
          <m-button
            class="m-btn-seconary m-r-8"
            :disable="formType === $MISAEnum.FormType.View"
            >Thêm dòng</m-button
          >
          <m-button
            class="m-btn-seconary"
            :disable="formType === $MISAEnum.FormType.View"
            >Xóa hết dòng</m-button
          >
        </div>
      </div>
      <div class="m-popup-footer">
        <m-button class="m-btn-seconary" tabindex="20">Hủy</m-button>
        <div>
          <m-button
            class="m-btn-seconary m-r-6"
            tabindex="19"
            @click="handleExecuteAction"
            >{{ formMode }}</m-button
          >
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <!-- Error Popup -->
    <m-dialog ref="dialog"></m-dialog>
  </Teleport>
</template>

<script>
import caPaymentService from "@/services/caPaymentService.js";
export default {
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
          this.$router.push("/CA/CAReceive");
        }
      } else {
        this.$router.push("/CA/CAReceive");
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

    /**
     * Xử lý khi thực thi action như sửa nhanh, cất, ..
     * Author: ptrung26 (30/10/2023)
     */
    handleExecuteAction() {
      if (this.formType === this.$MISAEnum.FormType.View) {
        this.formType = this.$MISAEnum.FormType.Edit;
      } else if (this.formType === this.$MISAEnum.FormType.Edit) {
        this.handleEditPayment();
      }
    },

    /**************** API **************/
    /**
     * Xử lý sửa phiếu chi
     * Author: ptrung26 (30/10/2023)
     */
    handleEditPayment() {},
  },
  data() {
    // form lưu trữ giá trị input, validate hiện thị lỗi trước khi submit
    const helper = this.$helper;
    const formValidator = {
      // Giá trị của input
      values: {
        state: 0,
        passEditVersion: false,
        editVersion: 145110701,
        autoRefno: false,
        modifiedBy: "Hà Vân ",
        modifiedDate: "2023-10-25T16:08:36.6556555+07:00",
        createdBy: "Hà Vân",
        createdDate: "2023-10-25T16:08:14.2452458+07:00",
        reftype: 1020,
        isValid: false,
        excelRowIndex: 0,
        isGroupInvoice: false,
        caAuditRefid: "00000000-0000-0000-0000-000000000000",
        employeeName: "Hà Vân",
        currencyId: "VND",
        journalMemo: "Chi tiền cho Quang Anh",
        accountObjectCode: "NV00008",
        employeeCode: "NV00006",
        accountObjectContactName: "Quang Anh",
        accountObjectAddress: "ha noi",
        accountObjectName: "Quang Anh",
        refnoFinance: "888",
        totalAmount: 1010000,
        totalAmountOc: 1010000,
        exchangeRate: 1,
        isSettlement: false,
        isVat: false,
        isEnvironmentVat: false,
        isSpecialVat: false,
        isImportVat: false,
        isPostedCashBookManagement: false,
        isPostedCashBookFinance: false,
        isPostedManagement: false,
        isPostedFinance: true,
        postedDate: helper.convertDate(Date.now()),
        refdate: helper.convertDate(Date.now()),
        reforder: 1698250094184,
        displayOnBook: 0,
        reasonTypeId: 23,
        employeeId: "a460056e-e801-442c-ace9-1c8065da88f0",
        branchId: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
        accountObjectId: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
        refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
        id: "1",
      },
      // Các input đã touch
      touched: {},
      // Lỗi của các input sau khi validate
      errors: {},
    };
    return {
      formValidator,
      caPaymentDetail: [
        {
          state: 0,
          passEditVersion: false,
          editVersion: 145110701,
          autoRefno: false,
          modifiedBy: "Hà Vân ",
          modifiedDate: "2023-10-25T16:08:36.6556555+07:00",
          createdBy: "Hà Vân",
          createdDate: "2023-10-25T16:08:14.2452458+07:00",
          reftype: 1020,
          isValid: false,
          excelRowIndex: 0,
          isGroupInvoice: false,
          caAuditRefid: "00000000-0000-0000-0000-000000000000",
          employeeName: "Hà Vân",
          currencyId: "VND",
          journalMemo: "Chi tiền cho Quang Anh",
          accountObjectCode: "NV00008",
          employeeCode: "NV00006",
          accountObjectContactName: "Quang Anh",
          accountObjectAddress: "ha noi",
          accountObjectName: "Quang Anh",
          refnoFinance: "888",
          totalAmount: 1010000,
          totalAmountOc: 1010000,
          exchangeRate: 1,
          isSettlement: false,
          isVat: false,
          isEnvironmentVat: false,
          isSpecialVat: false,
          isImportVat: false,
          isPostedCashBookManagement: false,
          isPostedCashBookFinance: false,
          isPostedManagement: false,
          isPostedFinance: true,
          postedDate: "2023-10-06T00:00:00.000+07:00",
          refdate: "2023-10-01T00:00:00.000+07:00",
          reforder: 1698250094184,
          displayOnBook: 0,
          reasonTypeId: 23,
          employeeId: "a460056e-e801-442c-ace9-1c8065da88f0",
          branchId: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          accountObjectId: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
          refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
          id: "1",
        },
      ],
      detailColumns: [
        {
          label: "#",
          field: "index",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Diễn giải",
          field: "description",
          columnType: this.$MISAEnum.ColumnType.Input,
        },
        {
          label: "TK Nợ",
          tooltip: "Tài khoản nợ",
          columnType: this.$MISAEnum.ColumnType.Combobox,
          tableColumns: [
            {
              label: "Số tài khoản",
              field: "accountNumber",
              columnType: this.$MISAEnum.ColumnType.View,
              expander: true,
            },
            {
              label: "Tên tài khoản",
              field: "accountName",
              columnType: this.$MISAEnum.ColumnType.View,
            },
          ],
          urlAPI: "di/accounts",
          propText: this.$MISAEnum.GeneralAccount.PropText,
          propValue: this.$MISAEnum.GeneralAccount.PropValue,
          cbbType: 1,
          width: 80,
          minWidth: 80,
        },
        {
          label: "TK Có",
          field: "creditAccount",
          tooltip: "Tài khản có",
          columnType: this.$MISAEnum.ColumnType.Combobox,
          tableColumns: [
            {
              label: "Số tài khoản",
              field: "accountNumber",
              columnType: this.$MISAEnum.ColumnType.View,
              expander: true,
            },
            {
              label: "Tên tài khoản",
              field: "accountName",
              columnType: this.$MISAEnum.ColumnType.View,
            },
          ],
          urlAPI: "di/accounts",
          propText: this.$MISAEnum.GeneralAccount.PropText,
          propValue: this.$MISAEnum.GeneralAccount.PropValue,
          cbbType: 1,
          width: 80,
          minWidth: 80,
        },
        {
          label: "Đối tượng",
          field: "accountObjectCode",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tên đối tượng",
          field: "accountObjectName",
          columnType: this.$MISAEnum.ColumnType.View,
        },
      ],
      formType: this.$MISAEnum.FormType.View,
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
    paymentDetails() {
      if (!this.caPaymentDetail) {
        return [];
      }
      const data = this.caPaymentDetail.map((item, index) => {
        return { ...item, index: index + 1 };
      });

      return data;
    },
    formMode: {
      get() {
        switch (this.formType) {
          case this.$MISAEnum.FormType.View:
            return "Sửa nhanh";
          case this.$MISAEnum.FormType.Edit:
            return "Cất";
          case this.$MISAEnum.FormType.Add:
            return "Cất";
          default:
            return "Sửa nhanh";
        }
      },
    },
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      caPaymentService
        .getById(id)
        .then((res) => {
          const { payment, paymentDetails } = res.data;
          for (const key in this.formValidator.values) {
            if (key in payment) {
              this.formValidator.values[key] = payment[key];
            }
          }
          this.caPaymentDetail = paymentDetails;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.formType = this.$MISAEnum.FormType.Add;
    }
  },
};
</script>

<style scoped>
.m-popup-box {
  background-color: #eceef1;
  padding: 0;
}
.m-popup-header {
  padding: 16px 16px 12px;
}

.m-popup-buttons {
  display: flex;
  margin-left: auto;
  gap: 0 12px;
}

.btn-recent-log {
  margin-right: 10px;
}
.title {
  font-size: 22px;
  font-family: Misa Bold;
}

.header-detail-input {
  margin-left: 24px;
}

.m-popup-body {
  padding: 6px 20px 12px;
}
.summary-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.summary-info-number {
  font-size: 36px;
  font-family: Misa Medium;
}

.m-popup-detail {
  padding: 0 20px;
  background: #fff;
  flex: 1;
}

.m-popup-detail .tab-nav {
  padding: 8px 0 8px 8px;
}

.m-popup-footer {
  background: #38393d;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
}
</style>
