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
                  :disable="receiveChecked.length <= 1"
                  @combobtn-click="handleOpenContextMenu($event, 100)"
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
                          @click="handleDeleteAllChecked"
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
                  <m-input placeholder="Tìm kiếm" v-model="searchValue" />
                  <div class="m-icon m-icon-search m-input-action"></div>
                </div>
                <m-button-icon
                  class="m-icon-refresh"
                  @click="handleUpdateWhenDataChanged"
                ></m-button-icon>
                <m-button-icon
                  class="m-icon-excel"
                  @click="handleExportPaymentToExcel"
                ></m-button-icon>
                <m-button @click="handleonOpenForm('', $MISAEnum.FormType.Add)"
                  >Chi tiền</m-button
                >
              </div>
            </div>
            <div class="content-grid">
              <m-table
                :data="paymentList"
                :columns="masterColumns"
                :fData="summaryData"
                :fColumns="fMasterColumns"
                :isShowCheckbox="true"
                :isShowMethod="true"
                :checkedList="receiveChecked"
                checkedKey="reId"
                :selectedId="selectedId"
                @row-dblclick="tableRowDblClick"
                @row-click="tableRowClick"
                @check-one="handleOnCheckedOne"
                @check-all="handleOnCheckedAll"
                :isCheckAll="isCheckAll"
                @delete-row="handleDelete"
                @replication-row="handleReplication"
                @edit-row="tableRowDblClick"
                :options="[
                  this.$MISAEnum.TableMethod.View,
                  this.$MISAEnum.TableMethod.Delete,
                  this.$MISAEnum.TableMethod.Replication,
                ]"
              >
              </m-table>
              <div class="content-pagination" v-if="paymentList.length > 0">
                <p class="total-record">
                  Tổng số {{ this.totalRecord }} bản ghi
                </p>
                <div class="content-pagination-right">
                  <m-combobox
                    :list="paginationLabels"
                    name="payment"
                    :defaultValue="currentPaymentOffset"
                    @update-combobox="handleOnPageSizeChange"
                    :editable="false"
                    propValue="value"
                    propText="label"
                    checkedKey="value"
                  ></m-combobox>
                  <m-pagination
                    :totalPage="totalPaymentPage"
                    :pageRange="5"
                    :currentPage="currentPage"
                    @page-change="handleOnPageChange"
                  ></m-pagination>
                </div>
              </div>
              <div class="not-found-data" v-if="paymentList.length === 0">
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
          v-if="receives.length > 0"
          :columns="detailColumns"
          :fColumns="fDetailColumns"
          :fData="summaryDetailData"
          :data="receives"
          :isShowMethod="false"
        ></m-table>
        <div class="content-pagination" v-if="paymentList.length > 0">
          <p class="total-record">
            Tổng số {{ this.totalDetailRecord }} bản ghi
          </p>
          <div class="content-pagination-right">
            <m-combobox
              :list="paginationLabels"
              name="paymentDetail"
              :defaultValue="currentPaymentDetailOffset"
              @update-combobox="handleOnPageSizeChange"
              :editable="false"
              propValue="value"
              propText="label"
              position="top"
              checkedKey="value"
            ></m-combobox>
            <m-pagination
              :totalPage="totalPaymentDetailPage"
              :pageRange="5"
              :currentPage="currentDetailPage"
              @page-change="handleOnPageChange"
            ></m-pagination>
          </div>
        </div>
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
      <div class="m-spinner-circle"></div>
    </div>
  </teleport>

  <!-- Dialog -->
  <Teleport to="body">
    <!-- Confirm Dialog -->
    <m-dialog ref="dialog"></m-dialog>
  </Teleport>
</template>

<script>
import caPayementService from "@/services/caPaymentService";
import caPaymentDetailService from "@/services/caPaymentDetailService";
import debounce from "lodash.debounce";
export default {
  name: "CaPayment",
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
    handleonOpenForm(id, formType) {
      let routeParams = { name: "CAPaymentDetail", query: formType };
      if (formType === this.$MISAEnum.FormType.Edit) {
        routeParams.params = { id };
      }
      if (formType === this.$MISAEnum.FormType.Replication) {
        localStorage.setItem("id", id);
        localStorage.setItem("formType", formType);
      }
      if (formType === this.$MISAEnum.FormType.Add) {
        localStorage.removeItem("id");
        localStorage.removeItem("formType");
      }

      this.$router.push(routeParams);
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
     * Xử lý khi thay đổi số bản ghi mỗi trang
     * Author: ptrung26 (26/09/2023)
     * @param {int} params Thông tin pageSize và label
     */
    handleOnPageSizeChange(params) {
      let name = params.name;
      let pageSize = params.value.value;
      let label = params.value.label;
      if (name === "payment") {
        this.currentPage = 1;
        this.paymentParams.pageSize = pageSize;
        this.paymentParams.pageNumber = 1;
        this.currentPaymentOffset.label = label;
        this.currentPaymentOffset.value = pageSize;
      }
      if (name === "paymentDetail") {
        let pageSize = params.value.value;
        this.currentDetailPage = 1;
        this.paymentDetailParams.pageSize = pageSize;
        this.paymentParams.pageNumber = 1;
        this.currentPaymentDetailOffset.label = label;
        this.currentPaymentDetailOffset.value = pageSize;
      }
    },

    /**
     * Xử lý khi trang hiện tại thay đổi
     * @param {int} page Trang hiện tại
     */
    handleOnPageChange(page) {
      this.currentPage = page;
      this.paymentParams.pageNumber = page;
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
     * Xử lý xóa toast message
     * Author: ptrung26 (18/10/2023)
     */
    handleCloseToast(toastId) {
      this.toastList.pop(toastId);
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
    tableRowDblClick(item) {
      this.handleonOpenForm(item.reId, this.$MISAEnum.FormType.Edit);
    },

    /**
     * Xử lý click item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} item
     */
    tableRowClick(item) {
      this.selectedId = item.reId;
      this.handleGetPaymentDetail(item);
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
     * @param {Object} data
     */
    handleOnCheckedOne(data) {
      if (!this.receiveChecked.includes(data.reId)) {
        this.receiveChecked.push(data.reId);
      } else {
        const filter = this.receiveChecked.filter((item) => item !== data.reId);
        this.receiveChecked = [...filter];
      }
      if (this.receiveChecked.length === this.paymentList.length) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
    },
    /**
     * Xử lý khi check tất cả item trong table
     * Author: ptrung26 (29/10/2023)
     */
    handleOnCheckedAll(state) {
      if (state === true) {
        this.receiveChecked = this.paymentList.map((item) => item.reId);
        this.isCheckAll = true;
      } else {
        this.receiveChecked = [];
      }
    },

    /**
     * Xử lý xóa phiếu chi
     * Author: ptrung26 (15/11/2023)
     */
    async handleDelete(item) {
      this.handleCloseContextMenu();
      await this.handleDeleteMulPayments([item.reId]);
    },

    /**
     * Xử lý xóa tất cả phiếu chi đã chọn
     * Author: ptrung26 (15/11/2023)
     */
    async handleDeleteAllChecked() {
      await this.handleDeleteMulPayments(this.receiveChecked);
    },

    /**
     * Xử lý nhân bản phiếu chi
     * Author: ptrung26 (16/11/2023)
     * @param {Object} item
     */
    async handleReplication(item) {
      this.handleonOpenForm(item.reId, this.$MISAEnum.FormType.Replication);
    },

    /**************************** API  *************************/
    /**
     * Xử lý get data
     */
    async handleFilterData() {
      try {
        const res = await caPayementService.filter(this.paymentParams);
        this.paymentList = res.data.data;
        if (!this.paymentParams.keyWord)
          this.summaryData.total_amount = res.data.totalAmount;
        else {
          this.summaryData.total_amount = this.paymentList.reduce(
            (total, item) => total + item.totalAmount,
            0
          );
        }
        this.totalRecord = res.data.total;
        if (this.paymentList.length > 0) {
          this.selectedId = this.paymentList[0].reId;
          await this.handleGetPaymentDetail(this.paymentList[0]);
        } else {
          this.paymentDetailList = [];
        }
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Lấy tất cả các bản ghi chi tiết
     * Author: ptrung26 (06/11/2023)
     * @param {Object} item Payment master
     */
    async handleGetPaymentDetail(item) {
      try {
        const res = await caPaymentDetailService.getByPaymentId(item.reId);
        this.paymentDetailList = res.data.data;
        this.totalDetailRecord = this.paymentDetailList.length;
        this.summaryDetailData.total_amount = this.paymentDetailList.reduce(
          (sum, currentItem) => sum + currentItem.amount,
          0
        );
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xóa nhiều phiếu chi
     * Author: ptrung26 (30/10/2023)
     */
    async handleDeleteMulPayments(payments) {
      this.handleCloseContextMenu();
      try {
        /* eslint-disable */
        let message = "";
        if (payments.length === 1) {
          message = this.$MISAResource.VI.Dialog.CAPayment.ConfirmDeletePayment;
        } else {
          message =
            this.$MISAResource.VI.Dialog.CAPayment.ConfirmDeleteMulPayment;
        }
        const ok = await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Headers.Warning,
          cancelButton: "Không",
          message,
        });
        if (ok) {
          const res = await caPayementService.deleteMul(payments);
          if (res.status === this.$MISAEnum.HttpStatus.OK) {
            this.addToast({
              id: Date.now(),
              status: this.$MISAEnum.ToastStatus.Success,
              message: this.$MISAResource.VI.SuccessMessage.Payment.DeleteMul,
            });
            this.handleUpdateWhenDataChanged(true);
            this.receiveChecked = [];
          }
        }
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xử lý việc xuất dữ liệu phiếu chi ra excel
     * Author: ptrung26 (20/11/2023)
     */
    async handleExportPaymentToExcel() {
      if (this.paymentList.length === 0) {
        return;
      }

      try {
        this.isLoading = true;
        const res = await caPayementService.exportPayments(this.searchValue);
        // Xử lý dữ liệu tải về (tệp Excel)
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Tạo một đường dẫn tạm thời và tải tệp Excel
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Danh_sach_phieu_chi.xlsx"; // Tên tệp Excel khi tải về
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },
  },
  computed: {
    totalPaymentPage: {
      /**
       * Trả về số lượng trang sau khi phân trang
       * Author: ptrung26 (24/08/2023)
       */
      get() {
        const total = Math.ceil(
          this.totalRecord / this.currentPaymentOffset.value
        );
        return total;
      },
    },
    totalPaymentDetailPage: {
      /**
       * Trả về số lượng trang sau khi phân trang
       * Author: ptrung26 (24/08/2023)
       */
      get() {
        const total = Math.ceil(
          this.totalDetailRecord / this.currentPaymentDetailOffset.value
        );
        return total;
      },
    },
    receives: {
      get() {
        const data = this.paymentDetailList.map((item, index) => {
          let result = { ...item, idx: index + 1 };
          return result;
        });
        return data;
      },
    },
  },
  watch: {
    isDataChange: {
      /**
       * Xử lý khi dữ liệu thay đổi thì hiện loading
       * Author: ptrung26 (13/08/2023)
       */
      async handler(newValue) {
        if (newValue) {
          // Load data
          this.isLoading = true;
          await this.handleFilterData();
          this.isLoading = false;
          this.isDataChange = false;
        }
      },
      immediate: true,
    },
    searchValue: {
      /**
       * Xử lý khi search thay đổi
       * Author: ptrung26 (14/09/2023)
       * @param {string} newValue giá trị search mới
       */
      handler: debounce(function (newValue) {
        this.isLoading = true;
        this.paymentParams["keyWord"] = newValue.trim();

        this.handleFilterData().finally(() => {
          this.isLoading = false;
        });
      }, 1000), // Thời gian debounce
    },
    paymentParams: {
      async handler(newValue) {
        await this.handleFilterData();
      },
      deep: true,
    },
  },
  data() {
    return {
      searchValue: "",
      currentPage: 1,
      currentDetailPage: 1,
      currentPaymentOffset: {
        label: this.$MISAResource.VI.paginationLabel.TwentyRecords,
        value: 20,
      },
      currentPaymentDetailOffset: {
        label: this.$MISAResource.VI.paginationLabel.TwentyRecords,
        value: 20,
      },
      paymentParams: {
        pageNumber: 1,
        pageSize: 20,
      },
      paymentDetailParams: {
        pageNumber: 1,
        pageSize: 20,
      },
      selectedId: "",
      totalRecord: 0,
      totalDetailRecord: 0,
      isOpenForm: false,
      isLoading: false,
      isDataChange: true,
      isConfirmAction: false,
      isReadyToDrag: false,
      isCollapseDetail: false,
      isOpenContextMenu: false,
      isCheckAll: false,
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
          columnTextStyle: this.$MISAEnum.ColumnTextStyle.Center,
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
          field: "journalMemo",
          columnType: this.$MISAEnum.ColumnType.View,
          width: 150,
        },
        {
          label: "Số tiền",
          field: "totalAmount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Money,
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
          field: "accountObjectName",
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
          dataType: this.$MISAEnum.DataType.Money,
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
          field: "debitAccount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          label: "Tài khoản có",
          field: "creditAccount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          label: "Số tiền",
          field: "amount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Money,
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
      fDetailColumns: [
        {
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 40,
        },
        {
          value: "Tổng",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Number,
          width: 80,
        },
        {
          field: "total_amount",
          columnType: this.$MISAEnum.ColumnType.View,
          dataType: this.$MISAEnum.DataType.Money,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          columnType: this.$MISAEnum.ColumnType.View,
        },
      ],
      paymentList: [],
      paymentDetailList: [],
      summaryData: { sum_label: "Tổng", total: 15, total_amount: 0 },
      summaryDetailData: { sum_label: "Tổng", total: 15, total_amount: 0 },
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
  created() {
    this.isLoading = true;
    this.handleFilterData().finally(() => {
      this.isLoading = false;
    });

    this.$emitter.on("onCloseToast", this.handleCloseToast);
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

<style>
@import url(@/css/views/ca/capayment.css);

.m-footer {
  position: sticky;
  left: 0;
  bottom: 52px;
}
</style>
