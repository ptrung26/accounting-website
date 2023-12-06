<script>
import EmployeeDetail from "./EmployeeDetail.vue";
import employeeService from "../../services/employeeService";
import debounce from "lodash.debounce";
export default {
  name: "EmployeePage",
  components: {
    EmployeeDetail,
  },
  data() {
    return {
      isOpenEmployeeForm: false,
      isLoading: false,
      isDataChange: true,
      isConfirmAction: false,
      currentPage: 1,
      currentOffset: {
        label: this.$MISAResource.VI.paginationLabel.TenRecords,
        value: 10,
      },
      totalRecord: 0,
      employeeDetailType: -1,
      searchValue: "",
      queryParams: {
        page: 1,
        offset: 10,
      },
      employeeSelected: null,
      employeeList: [],
      selectList: [],
      toastList: [],
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
      columns: [
        {
          label: "Tên nhân viên",
          field: "FullName",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Giới tính",
          field: "Gender",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Số CMND",
          tooltip: "Số chứng minh nhân dân",
          field: "IdentityNumber",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Chức danh",
          field: "EmployeeTitle",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tên đơn vị",
          field: "DepartmentName",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Số tài khoản",
          field: "BankAccount",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tên ngân hàng",
          field: "BankName",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Chi nhánh TK ngân hàng",
          tooltip: "Chi nhánh tài khoản ngân hàng",
          field: "BankAddress",
          ColumnType: this.$MISAEnum.ColumnType.View,
        },
      ],
    };
  },
  methods: {
    /**
     * Xử lý việc mở form nhân viên
     * Author: ptrung26 (19/08/2023)
     */
    handleOpenForm({ type, employee }) {
      // Gán kiểu form và employee đã lựa chọn nếu có
      this.employeeDetailType = type;
      this.employeeSelected = employee;
      this.isOpenEmployeeForm = true;
    },

    /**
     * Xử lý việc đóng form nhân viên
     * Author: ptrung26 (19/08/2023)
     */
    handleCloseForm() {
      this.isOpenEmployeeForm = false;
    },

    /**
     * Xử lý xóa toast message
     * Author: ptrung26 (19/08/2023)
     */
    handleCloseToast(toastId) {
      this.toastList.pop(toastId);
    },
    /**
     * Cật nhập những cb đã chọn
     * Author: ptrung26 (24/08/2023)
     */
    handleUpdateSelectList(selectList) {
      this.selectList = [...selectList];
    },

    /**
     * Xử lý bỏ chọn tất cả
     * Author: ptrung26 (24/08/2023)
     */
    handleUnSelectAll() {
      this.selectList = [];
    },

    /**
     * Trả về giá trị giới tinh theo id tương ứng
     * Author: ptrung26 (24/08/2023)
     * @param {int} genderId id của gender
     */
    getGender(genderId) {
      if (genderId === this.$MISAEnum.Gender.Male) {
        return this.$MISAResource.VI.GenderName.Male;
      }
      if (genderId === this.$MISAEnum.Gender.Female) {
        return this.$MISAResource.VI.GenderName.Female;
      }

      return this.$MISAResource.VI.GenderName.Other;
    },

    /**
     * Cập nhật lại dữ liệu trên UI khi dữ liệu thay đổi
     * @param isAction kiểm tra trước đó có thực thi action (thêm, sửa, xóa) hay không
     * Author: ptrung26 (31/08/2023)
     */
    handleUpdateWhenDataChanged(isAction = false) {
      if (isAction) {
        this.queryParams.page = 1;
        this.currentPage = 1;
      }
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
     * Xử lý khi trang thay đổi
     * Author: ptrung26 (17/09/2023)
     * @param {Number} page trang hiện tại
     */
    handleOnPageChange(page) {
      this.currentPage = page;
      this.queryParams.page = page;
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
     * Chặn sự kiện double click nếu click nhanh
     * Author: ptrung26 (30/09/2023)
     */
    // preventDblClickEvent(event) {
    //   event.stopPropagation();
    // },

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

    /*********************************** PHẦN XỬ LÝ API ***********************************/
    /**
     * Lấy danh sách nhân viên theo tên
     * @param {string} name tên nhân viên
     * Author: ptrung26 (14/09/2023)
     */
    async handleGetEmployeeFilters() {
      try {
        const res = await employeeService.filter(this.queryParams);
        this.employeeList = res.data.result;
        this.totalRecord = res.data.totalRecord;
      } catch (err) {
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response?.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xử lý xóa nhân viên
     * Author: ptrung26 (22/08/2023)
     */
    async handleDeleteEmployee(employee) {
      const ok = await this.$refs.dialog.show({
        title: this.$MISAResource.VI.Headers.Warning,
        message: this.$MISAResource.VI.Dialog.ConfirmDeleteMessage(
          employee.EmployeeCode
        ),
      });

      if (ok) {
        try {
          // Thực hiện action xóa nhân viên
          const res = await employeeService.delete(employee.EmployeeId);
          // Nếu xóa thành công
          if (res.status === this.$MISAEnum.HttpStatus.OK) {
            this.addToast({
              id: Date.now(),
              status: this.$MISAEnum.ToastStatus.Success,
              message: this.$MISAResource.VI.SuccessMessage.DeleteEmployee,
            });
            this.handleUpdateWhenDataChanged(true);
          }
        } catch (err) {
          // Hiện thị thông báo tương ứng nếu có lỗi
          let toast = this.$errorHandling.createError(
            err.response || this.$MISAEnum.HttpStatus.SERVER_ERROR,
            err.response?.data?.UserMessage ||
              this.$MISAResource.VI.ErrorMessage.ServerError
          );
          if (toast) {
            this.addToast(toast);
          }
        }
      }
    },

    /**
     * Xử lý xóa những nhân viên đã tích chọn
     * Author: ptrung26 (07/09/2023)
     */
    async handleDeleteEmployees() {
      const ok = await this.$refs.dialog.show({
        title: this.$MISAResource.VI.Headers.Warning,
        message: this.$MISAResource.VI.Dialog.ConfirmDeleteMulMessage,
      });
      if (ok) {
        try {
          const employeeIds = this.selectList.map((item) => item.EmployeeId);
          const res = await employeeService.mulDelete(employeeIds);
          if (res.status === this.$MISAEnum.HttpStatus.OK) {
            this.addToast({
              id: Date.now(),
              status: this.$MISAEnum.ToastStatus.Success,
              message: this.$MISAResource.VI.SuccessMessage.DeleteEmployee,
            });
          }
          this.handleUpdateWhenDataChanged(true);
          this.selectList = [];
        } catch (err) {
          // Hiện thị thông báo tương ứng nếu có lỗi
          let toast = this.$errorHandling.createError(
            err.response.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
            err.response?.data?.UserMessage ||
              this.$MISAResource.VI.ErrorMessage.ServerError
          );
          if (toast) {
            this.addToast(toast);
          }
        }
      }
    },

    /**
     * Xử lý việc xuất dữ liệu nhân viên ra excel
     * Author: ptrung26 (02/10/2023)
     */
    async handleExportEmployeeToExcelFile() {
      if (this.employeeList.length === 0) {
        return;
      }

      try {
        this.isLoading = true;
        const _res = await employeeService.filter({
          page: 0,
          offset: 0,
          query: this.searchValue,
        });
        const res = await employeeService.exportEmployees(_res.data.result);
        // Xử lý dữ liệu tải về (tệp Excel)
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Tạo một đường dẫn tạm thời và tải tệp Excel
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Danh_sach_nhan_vien.xlsx"; // Tên tệp Excel khi tải về
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        // Hiện thị thông báo tương ứng nếu có lỗi
        let toast = this.$errorHandling.createError(
          err.response.status || this.$MISAEnum.HttpStatus.SERVER_ERROR,
          err.response?.data?.UserMessage ||
            this.$MISAResource.VI.ErrorMessage.ServerError
        );
        if (toast) {
          this.addToast(toast);
        }
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
          await this.handleGetEmployeeFilters();
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
        if (newValue) {
          this.queryParams.query = newValue;
          this.queryParams.page = 1;
          this.currentPage = 1;
        } else {
          delete this.queryParams["query"];
        }

        this.handleGetEmployeeFilters().finally(() => {
          this.isLoading = false;
        });
      }, 500), // Thời gian debounce
    },
    queryParams: {
      /**
       * Xử lý khi tham số truy vấn thay đổi (trang, số lượng bản ghi)
       * Author: ptrung26 (17/09/2023)
       * @param {Number} newValue giá trị tham số truy vấn mới
       */
      async handler() {
        this.isLoading = true;
        await this.handleGetEmployeeFilters();
        this.isLoading = false;
      },
      deep: true,
    },
  },
  async created() {
    // Emitter
    this.$emitter.on("onOpenForm", this.handleOpenForm);
    this.$emitter.on("onCloseForm", this.handleCloseForm);
    this.$emitter.on("onCloseToast", this.handleCloseToast);
    this.$emitter.on("onAddToast", this.addToast);
    this.$emitter.on("onDataChange", this.handleUpdateWhenDataChanged);
    this.$emitter.on("onPageChange", this.handleOnPageChange);
    this.$emitter.on("onComboboxChange", this.handleOnOffsetChange);
    this.$emitter.on("onDeleteItemTable", this.handleDeleteEmployee);
    this.$emitter.on("onUpdateSelectList", this.handleUpdateSelectList);
  },
  beforeUnmount() {
    // Hủy bỏ các emitter
    this.$emitter.off("onOpenForm", this.handleOpenForm);
    this.$emitter.off("onCloseForm", this.handleCloseForm);
    this.$emitter.off("onCloseToast", this.handleCloseToast);
    this.$emitter.off("onAddToast", this.addToast);
    this.$emitter.off("onDataChange", this.handleUpdateWhenDataChanged);
    this.$emitter.off("onPageChange", this.handleOnPageChange);
    this.$emitter.off("onComboboxChange", this.handleOnOffsetChange);
    this.$emitter.off("onDeleteItemTable", this.handleDeleteEmployee);
    this.$emitter.off("onUpdateSelectList", this.handleUpdateSelectList);
  },
};
</script>

<template>
  <!-- Content -->
  <div class="content">
    <!-- Content header -->
    <div class="content-header">
      <h3 class="content-title">Nhân viên</h3>
      <m-button
        class="m-btn"
        @click="
          handleOpenForm({ type: $MISAEnum.FormType.Add, employee: null })
        "
        >Thêm mới nhân viên</m-button
      >
    </div>
    <!-- Conntent body -->
    <div class="content-body">
      <div class="content-toolbar">
        <div v-show="selectList.length" class="content-toolbar-left">
          <p class="select-count">
            Đã chọn <b>{{ selectList.length }}</b>
          </p>
          <button class="unselect-all" @click="handleUnSelectAll">
            Bỏ chọn
          </button>
          <m-button @click="handleDeleteEmployees">Xóa tất cả</m-button>
        </div>
        <div class="content-toolbar-right">
          <div class="content-search-box">
            <m-input
              placeholder="Tìm kiếm theo mã, tên nhân viên"
              :value="searchValue"
              @input="handleChangSearchValue"
            />
            <div class="m-icon m-icon-search m-input-action"></div>
          </div>
          <m-button-icon
            class="m-icon-refresh"
            @click="handleUpdateWhenDataChanged"
          ></m-button-icon>
          <m-button-icon
            class="m-icon-excel"
            @click="handleExportEmployeeToExcelFile"
          ></m-button-icon>
        </div>
      </div>
      <div class="content-grid">
        <m-table :data="employeeList" :columns="tableTitle"></m-table>
        <div class="content-pagination" v-if="employeeList.length > 0">
          <p class="total-record">Tổng số {{ this.totalRecord }} bản ghi</p>
          <div class="content-pagination-right">
            <m-combobox
              :list="paginationLabels"
              name="pagination"
              :defaultValue="currentOffset"
              :onItemChange="handleOnOffsetChange"
              :editable="false"
            ></m-combobox>
            <m-pagination
              :totalPage="totalPage"
              :pageRange="5"
              :currentPage="currentPage"
            ></m-pagination>
          </div>
        </div>
        <div class="not-found-data" v-if="employeeList.length === 0">
          <img src="../../assets/img/not-found.svg" alt="not found data" />
          <p>Không có dữ liệu</p>
        </div>
      </div>
    </div>

    <!-- Form nhân viên -->
    <teleport to="body">
      <employee-detail
        v-if="isOpenEmployeeForm"
        :type="employeeDetailType"
        :employee="employeeSelected"
      ></employee-detail>
    </teleport>

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

    <Teleport to="body">
      <!-- Confirm Dialog -->
      <m-dialog ref="dialog"></m-dialog>
    </Teleport>
  </div>
</template>

<style scoped>
@import url(@/css/views/employee.css);
</style>
