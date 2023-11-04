<template>
  <div class="ca-receive" ref="container">
    <div class="master-detail-section">
      <div class="master-section" ref="master">
        <div class="content">
          <div class="content-body">
            <div class="content-toolbar">
              <div class="content-toolbar-left">
                <div class="m-icon m-icon-arrow-check-all"></div>
                <m-combo-button
                  ref="checkedAction"
                  text="Thực hiện hàng loạt"
                  icon="m-icon-arrow-down"
                  :class="{
                    disable: receiveChecked.length <= 1,
                  }"
                  @click.stop="handleOpenContextMenu($event, 100)"
                >
                  <template #action>
                    <teleport to="body">
                      <div
                        class="m-context-menu"
                        :style="contextMenuPostion"
                        v-if="isOpenContextMenu && contextMenuId === 100"
                        v-click-outside="handleCloseContextMenu"
                      >
                        <div class="m-context-menu-item">Ghi sổ</div>
                        <div class="m-context-menu-item">Bỏ ghi</div>
                        <div
                          class="m-context-menu-item"
                          @click="handleDeleteMulPayments"
                        >
                          Xóa
                        </div>
                      </div>
                    </teleport>
                  </template>
                </m-combo-button>
              </div>
              <div class="content-toolbar-right">
                <div class="content-search-box">
                  <m-input
                    placeholder="Tìm kiếm"
                    :value="searchValue"
                    @input="handleChangSearchValue"
                  />
                  <div class="m-icon m-icon-search m-input-action"></div>
                </div>
                <m-button-icon
                  class="m-icon-refresh"
                  @click="handleUpdateWhenDataChanged"
                ></m-button-icon>
                <m-button-icon class="m-icon-excel"></m-button-icon>
                <m-button @click="handleonOpenForm('')">Chi tiền</m-button>
              </div>
            </div>
            <div class="content-grid">
              <m-table
                :data="receiveList"
                :columns="masterColumns"
                :fData="summaryData"
                :fColumns="fMasterColumns"
                :hasSelectBox="true"
                :checkedList="receiveChecked"
                :onTableRowDblClick="tableRowClick"
                :onCheckedOne="handleOnCheckedOne"
                :onCheckedAll="handleOnCheckedAll"
              >
                <template #body="node">
                  <div class="grid w-full justify-center align-center">
                    <button class="m-td-edit p-r-6">Xem</button>
                    <button class="m-td-menu">
                      <span
                        class="m-icon m-icon-arrow-down-blue"
                        @click="handleOpenContextMenu($event, node.uuid)"
                        @dblclick="preventDblClickEvent($event)"
                      ></span>
                    </button>
                    <teleport to="body">
                      <div
                        class="m-context-menu"
                        :style="contextMenuPostion"
                        v-if="(contextMenuId === node.uuid) & isOpenContextMenu"
                        v-click-outside="handleCloseContextMenu"
                      >
                        <div class="m-context-menu-item">Nhân bản</div>
                        <div class="m-context-menu-item">Xóa</div>
                      </div>
                    </teleport>
                  </div>
                </template>
              </m-table>
              <div class="content-pagination" v-if="receiveList.length > 0">
                <p class="total-record">
                  Tổng số {{ this.totalRecord }} bản ghi
                </p>
                <div class="content-pagination-right">
                  <m-combobox
                    :list="paginationLabels"
                    name="pagination"
                    :defaultValue="{
                      label: this.$MISAResource.VI.paginationLabel.TenRecords,
                      value: 10,
                    }"
                    :onItemChange="handleOnOffsetChange"
                    :editable="false"
                    propValue="value"
                    propText="label"
                  ></m-combobox>
                  <m-pagination
                    :totalPage="totalPage"
                    :pageRange="5"
                    :currentPage="currentPage"
                  ></m-pagination>
                </div>
              </div>
              <div class="not-found-data" v-if="receiveList.length === 0">
                <img
                  src="../../assets/img/not-found.svg"
                  alt="not found data"
                />
                <p>Không có dữ liệu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-section" ref="detail">
        <div class="slide-line" @mousedown="onMouseDown" ref="slideLine"></div>
        <div class="collapse-btn" @click="handleCollapseDetail">
          <div
            class="m-icon"
            :class="{
              'm-icon-arrow-down': !isCollapseDetail,
              'm-icon-arrow-up': isCollapseDetail,
            }"
          ></div>
        </div>
        <div class="tab-items">
          <div class="tab-item">Chi tiền</div>
        </div>
        <m-table
          :columns="detailColumns"
          :data="receives"
          :isHasMethod="false"
        ></m-table>
      </div>
    </div>
  </div>

  <!-- Form -->
  <teleport to="body"> </teleport>

  <!-- Toast message -->
  <teleport to="body">
    <m-toast-list :list="toastList" position="top-right"></m-toast-list>
  </teleport>

  <!-- Loading -->
  <teleport to="body">
    <div v-show="isLoading" class="m-spinner">
      <div class="m-spinner-circle">
        <img src="../../assets/loading.svg" />
      </div>
    </div>
  </teleport>

  <!-- Dialog -->
  <Teleport to="body">
    <!-- Confirm Dialog -->
    <m-dialog ref="dialog"></m-dialog>
  </Teleport>
</template>

<script>
export default {
  name: "CAReceive",
  methods: {
    /**
     * Chặn sự kiện double click nếu click nhanh
     * Author: ptrung26 (30/09/2023)
     */
    preventDblClickEvent(event) {
      event.stopPropagation();
    },

    /**
     * Xử lý form payment detail
     * Author: ptrung26 (29/10/2023)
     */
    handleonOpenForm(id) {
      if (id) {
        this.$router.push(`/CAPaymentDetail/${id}`);
      } else {
        this.$router.push("/CAPaymentDetail");
      }
    },

    /**
     * Xử lý việc mở context menu
     * Author: ptrung26 (21/08/2023)
     */
    handleOpenContextMenu(event, index) {
      event.stopPropagation();
      if (this.contextMenuId === index && this.isOpenContextMenu) {
        this.isOpenContextMenu = false;
      } else {
        this.isOpenContextMenu = true;
        this.contextMenuId = index;
        // Xét vị trị của menu context theo vị trí của nút
        const menuWidth = 120;
        const marginTop = 12;
        const rect = event.target.getBoundingClientRect();
        this.contextMenuPostion.top = rect.bottom + marginTop + "px";
        this.contextMenuPostion.left = rect.right - menuWidth + "px";
      }
    },

    /**
     * Xử lý việc đóng context menu
     * Author: ptrung26 (24/08/2023)
     */
    handleCloseContextMenu() {
      this.isOpenContextMenu = false;
    },

    /**
     * Cập nhật lại dữ liệu trên UI khi dữ liệu thay đổi
     * Author: ptrung26 (31/08/2023)
     */
    handleUpdateWhenDataChanged() {
      this.isDataChange = true;
    },

    /**
     * Bắt sự kiện thay đổi giá trị input
     * Author: ptrung26 (14/09/2023)
     * @param {object} e input event
     */
    handleChangSearchValue(e) {
      this.searchValue = e.target.value;
    },

    /**
     * Xử lý khi thay đổi số bản ghi mỗi trang
     * Author: ptrung26 (26/09/2023)
     * @param {int} offset số lượng bản ghi mỗi trang
     */
    handleOnOffsetChange(offset) {
      this.currentPage = 1;
      this.queryParams.offset = offset;
      this.queryParams.page = 1;

      // Thay đổi label hiện thị offset
      for (let { label, value } of this.paginationLabels) {
        if (value === offset) {
          this.currentOffset.value = value;
          this.currentOffset.label = label;
        }
      }
    },

    /**
     * Xóa toast khỏi màn hình
     * Author: ptrung26 (26/09/2023)
     * @param {object} toast thông tin toast
     */
    removeToast(toast) {
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
      this.toastList.push(toast);

      // Lên lịch xóa mục sau 5 giây
      setTimeout(() => {
        this.removeToast(toast);
      }, 5000);
    },

    /**
     * Xử lý dblclick item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} item
     */
    tableRowClick(item) {
      this.handleonOpenForm(item.refid);
    },

    /**
     * Xử lý sự kiện mouse down
     * Author: ptrung26 (29/10/2023)
     */
    onMouseDown() {
      this.isReadyToDrag = true;
    },

    /**
     * Xử lý sự kiện mouse move
     * Author: ptrung26 (29/10/2023)
     */
    onMouseMove(event) {
      if (this.isReadyToDrag) {
        const container = this.$refs.container;
        const master = this.$refs.master;
        const clientY = event.clientY;
        const containerRect = container.getBoundingClientRect();
        const top = containerRect.top;
        const bottom = containerRect.bottom;
        const height = containerRect.height;
        const min = top;
        const max = bottom;
        if (min <= clientY && clientY <= max) {
          const percent = ((clientY - min) / height) * 100;
          master.style.height = Math.floor(percent) + "%";
        }
      }
    },

    /**
     * Xử lý sự kiện mouse up
     * Author: ptrung26 (29/10/2023)
     */
    onMouseUp() {
      this.isReadyToDrag = false;
    },

    /**
     * Xử lý phóng to hoặc thu nhỏ mục chi tiết
     * Author: ptrung26 (29/10/2023)
     */
    handleCollapseDetail() {
      if (!this.isCollapseDetail) {
        const height = this.$refs.slideLine.getBoundingClientRect().height;
        const margin = 8;
        this.$refs.master.style.height = `calc(100% - ${height + margin}px)`;
      } else {
        this.$refs.master.style.height = "0";
      }
      this.isCollapseDetail = !this.isCollapseDetail;
    },

    /**
     * Xử lý khi check một item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {String} id id của item
     */
    handleOnCheckedOne(id) {
      if (!this.receiveChecked.includes(id)) {
        this.receiveChecked.push(id);
      } else {
        const filter = this.receiveChecked.filter((item) => item !== id);
        this.receiveChecked = [...filter];
      }
    },
    /**
     * Xử lý khi check tất cả item trong table
     * Author: ptrung26 (29/10/2023)
     */
    handleOnCheckedAll(ids) {
      this.receiveChecked = ids;
    },

    async handleDeleteMulPayments() {
      try {
        /* eslint-disable */
        const ok = await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Headers.Warning,
          cancelButton: "Không",
          message:
            this.$MISAResource.VI.Dialog.CAPayment.ConfirmDeleteMulPayment,

          if(ok) {
            // Lam gi do
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  computed: {
    totalPage: {
      /**
       * Trả về số lượng trang sau khi phân trang
       * Author: ptrung26 (24/08/2023)
       */
      get() {
        const total = Math.ceil(this.totalRecord / this.currentOffset.value);
        return total;
      },
    },
    receives: {
      get() {
        const data = this.receiveDetailList?.map((item, index) => {
          let result = { ...item, idx: index + 1 };
          return result;
        });
        return data;
      },
    },
  },
  data() {
    return {
      searchValue: "",
      currentPage: 1,
      currentOffset: {
        label: this.$MISAResource.VI.paginationLabel.TenRecords,
        value: 10,
      },
      totalRecord: 0,
      isOpenForm: false,
      isLoading: false,
      isDataChange: true,
      isConfirmAction: false,
      isReadyToDrag: false,
      isCollapseDetail: false,
      isOpenContextMenu: false,
      contextMenuId: null,
      contextMenuPostion: {
        top: 0,
        left: 0,
      },
      toastList: [],
      receiveChecked: [],
      masterColumns: [
        {
          label: "Ngày hạch toán",
          field: "postedDate",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Date,
          width: 150,
        },
        {
          label: "Ngày chứng tử",
          field: "refDate",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Date,
          width: 150,
        },
        {
          label: "Số chứng tử",
          field: "refnoFinance",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          label: "Diễn giải",
          field: "description",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          label: "Số tiền",
          field: "caba_amount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          label: "Mã đối tượng",
          field: "accountObjectCode",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          label: "Đối tượng",
          field: "receiver",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          label: "Địa chỉ",
          field: "accountObjectAddress",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
      ],
      fMasterColumns: [
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 80,
        },
        {
          value: "Tổng",
          columnType: this.$MISAEnum.ColumnType.View,
          textStyle: this.$MISAEnum.ColumnTextStyle.Center,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          field: "total_amount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
      ],
      detailColumns: [
        {
          label: "#",
          field: "idx",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 40,
        },
        {
          label: "Diễn giải",
          field: "description",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tài khoản nợ",
          field: "debit_account",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          label: "Tài khoản có",
          field: "debit_account",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          label: "Số tiền",
          field: "amount_oc",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
        },
        {
          label: "Đối tượng",
          field: "",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tên đối tượng",
          field: "",
          columnType: this.$MISAEnum.ColumnType.View,
        },
      ],
      receiveList: [
        {
          refid: "2738449d-bba9-4055-a4aa-018834129b51",
          account_object_id: "8741f597-54ec-44f7-8965-758622c1f214",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698249033990,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00011",
          currency_id: "VND",
          receiver: "Hà Vân",
          journal_memo: "Chi tiền cho Hà Vân",
          account_object_contact_name: "Hà Vân",
          account_object_name: "Hà Vân",
          accountObjectCode: "HVAN",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145101600,
          group_invoice_type: 0,
          caba_refno: "PC00011",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "0452ba7d-a016-4b6a-a402-6ac905a31777",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246166661,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00010",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145079163,
          group_invoice_type: 0,
          caba_refno: "PC00010",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "d395652b-866a-4662-8625-e52cd67550b4",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246162240,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00009",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145078941,
          group_invoice_type: 0,
          caba_refno: "PC00009",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "5ad863f0-3035-4076-aa68-6da628d9b31c",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246158362,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00008",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145078766,
          group_invoice_type: 0,
          caba_refno: "PC00008",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "64afd542-c9c9-4a23-a96b-7462e4124957",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246151396,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00007",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          accountObjectAddress: "fycccchcchh",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145087620,
          group_invoice_type: 0,
          caba_refno: "PC00007",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "00aa1f4a-c4cd-4bb5-9c15-372cd664aafd",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246131484,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00006",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145078548,
          group_invoice_type: 0,
          caba_refno: "PC00006",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "a6dd568c-33e1-4d33-abf7-9de3c5bf6d02",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698246108777,
          ca_type: 1,
          refDate: "2023-10-25T00:00:00.000+07:00",
          postedDate: "2023-10-25T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00005",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145078443,
          group_invoice_type: 0,
          caba_refno: "PC00005",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "ad4580fa-7679-4633-a469-edc2432e6766",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698144421136,
          ca_type: 1,
          refDate: "2023-10-24T00:00:00.000+07:00",
          postedDate: "2023-10-24T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00004",
          currency_id: "VND",
          journal_memo: "Chi tiền cho aa",
          account_object_name: "aa",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 144892875,
          group_invoice_type: 0,
          caba_refno: "PC00004",
          reftype: 1020,
          created_date: "2023-10-24T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-24T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "34191c44-2386-4dcf-b4f9-c5ef25542497",
          account_object_id: "503d0f4b-ac6e-4c9f-b739-ad44f9e654e4",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          employee_id: "bb7395b6-9e62-42b4-8516-4ba994bdd60c",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698249101235,
          ca_type: 1,
          refDate: "2023-10-15T00:00:00.000+07:00",
          postedDate: "2023-10-21T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00012",
          currency_id: "VND",
          receiver: "iiiiiiii",
          journal_memo: "Chi tiền cho Đỗ Huyền",
          document_included: "191",
          account_object_contact_name: "iiiiiiii",
          account_object_name: "Đỗ Huyền",
          accountObjectCode: "DHUYEN",
          employee_name: "Lê Hằng",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145295407,
          group_invoice_type: 0,
          caba_refno: "PC00012",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-26T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "a152f537-3de4-4cec-b45c-e8b4fe6e38cc",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1697731359489,
          ca_type: 1,
          refDate: "2023-10-19T00:00:00.000+07:00",
          postedDate: "2023-10-19T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: false,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00003",
          currency_id: "VND",
          journal_memo: "Chi tiền cho",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 143600214,
          group_invoice_type: 0,
          caba_refno: "PC00003",
          reftype: 1020,
          created_date: "2023-10-19T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-19T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "55ea3c95-1033-4c02-901d-76a87fb8bff5",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1697710043746,
          ca_type: 1,
          refDate: "2023-10-19T00:00:00.000+07:00",
          postedDate: "2023-10-19T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: false,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00002",
          currency_id: "VND",
          journal_memo: "Chi tiền cho",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 143420592,
          group_invoice_type: 0,
          caba_refno: "PC00002",
          reftype: 1020,
          created_date: "2023-10-19T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-19T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "e8589bf0-a1d1-4463-bce4-e9ab75f3dca0",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1697643935848,
          ca_type: 1,
          refDate: "2023-10-18T00:00:00.000+07:00",
          postedDate: "2023-10-18T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: false,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "PC00001",
          currency_id: "VND",
          journal_memo: "Chi tiền cho",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 143420448,
          group_invoice_type: 0,
          caba_refno: "PC00001",
          reftype: 1020,
          created_date: "2023-10-18T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-19T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "5e10a185-25ac-44dc-9dcc-8a7552c27f2d",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1697643763482,
          ca_type: 1,
          refDate: "2023-10-18T00:00:00.000+07:00",
          postedDate: "2023-10-18T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: false,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "abcd1235abc",
          currency_id: "VND",
          journal_memo: "Chi tiền cho",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 143214806,
          group_invoice_type: 0,
          caba_refno: "abcd1235abc",
          reftype: 1020,
          created_date: "2023-10-18T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-18T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "68f8b11e-6365-407e-878f-a4fed7224cf3",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1697643720623,
          ca_type: 1,
          refDate: "2023-10-18T00:00:00.000+07:00",
          postedDate: "2023-10-18T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: false,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 0,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 0,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "abcd1234",
          currency_id: "VND",
          journal_memo: "Chi tiền cho",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 143214319,
          group_invoice_type: 0,
          caba_refno: "abcd1234",
          reftype: 1020,
          created_date: "2023-10-18T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-18T00:00:00.000+07:00",
          modified_by: "Hà Vân",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
        {
          refid: "d5c748b3-7781-48a3-877f-e9cce0d4d513",
          account_object_id: "c3ecf352-0523-47b2-991d-c55c2ef43bbc",
          branch_id: "fc731db5-c78c-4f30-bb62-a5f2470e067a",
          employee_id: "a460056e-e801-442c-ace9-1c8065da88f0",
          reason_type_id: 23,
          include_invoice: 0,
          display_on_book: 0,
          reforder: 1698250094184,
          ca_type: 1,
          refDate: "2023-10-01T00:00:00.000+07:00",
          postedDate: "2023-10-06T00:00:00.000+07:00",
          is_value_decrement_from_stock: false,
          is_freight_service: false,
          is_posted_finance: true,
          is_posted_management: false,
          outward_exported_status: 0,
          is_invoice_exported: false,
          is_paid: false,
          is_posted_cash_book_finance: false,
          is_posted_cash_book_management: false,
          is_posted_inventory_book_finance: false,
          is_posted_inventory_book_management: false,
          is_settlement: false,
          settlement_type: 0,
          total_sale_amount_oc: 0,
          total_sale_amount: 0,
          exchange_rate: 1,
          total_export_tax_amount_oc: 0,
          total_amount_oc: 1010000,
          total_export_tax_amount: 0,
          caba_amount_oc: 0,
          caba_amount: 0,
          total_discount_amount: 0,
          total_freight_amount: 0,
          total_inward_amount: 0,
          total_special_consume_tax_amount_oc: 0,
          total_special_consume_tax_amount: 0,
          total_custom_before_amount: 0,
          total_amount: 1010000,
          total_import_tax_amount_oc: 0,
          total_import_tax_amount: 0,
          total_vat_amount_oc: 0,
          total_vat_amount: 0,
          total_discount_amount_oc: 0,
          refnoFinance: "888",
          currency_id: "VND",
          receiver: "Quang Anh",
          journal_memo: "Chi tiền cho Quang Anh",
          account_object_contact_name: "Quang Anh",
          account_object_name: "Quang Anh",
          accountObjectAddress: "ha noi",
          accountObjectCode: "NV00008",
          employee_name: "Hà Vân",
          branch_name: "(SMECloud) CÔNG TY TNHH SONG SONG (Misa Test)_ G1",
          reason_type_name: "Chi khác",
          edit_version: 145110701,
          group_invoice_type: 0,
          caba_refno: "888",
          reftype: 1020,
          created_date: "2023-10-25T00:00:00.000+07:00",
          created_by: "Hà Vân",
          modified_date: "2023-10-25T00:00:00.000+07:00",
          modified_by: "Hà Vân ",
          auto_refno: false,
          pass_edit_version: false,
          state: 0,
        },
      ],
      receiveDetailList: [
        {
          description: "Chi tiền cho aa",
          debit_account: "1111",
          credit_account: "1111",
          amount_oc: 0,
        },
      ],
      summaryData: { sum_label: "Tổng", total: 15, total_amount: 1010000 },
      paginationLabels: [
        { label: this.$MISAResource.VI.paginationLabel.TenRecords, value: 10 },
        {
          label: this.$MISAResource.VI.paginationLabel.TwentyRecords,
          value: 20,
        },
        {
          label: this.$MISAResource.VI.paginationLabel.ThirtyRecords,
          value: 30,
        },
        {
          label: this.$MISAResource.VI.paginationLabel.FiftyRecords,
          value: 50,
        },
        {
          label: this.$MISAResource.VI.paginationLabel.OneHundredRecords,
          value: 100,
        },
      ],
    };
  },
  mounted() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  },
};
</script>

<style scoped>
@import url(@/css/views/ca/careceive.css);
</style>
