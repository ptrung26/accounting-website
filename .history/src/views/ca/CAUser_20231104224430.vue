<script>
import caUserService from "@/services/caUserService";
import CAUserDetail from "./CAUserDetail.vue";
export default {
  name: "CaUser",
  components: {
    CAUserDetail,
  },
  data() {
    return {
      isOpenForm: false,
      isLoading: false,
      isDataChange: true,
      isConfirmAction: false,
      isOpenContextMenu: false,
      contextMenuId: null,
      contextMenuPostion: {
        top: 0,
        left: 0,
      },
      totalRecord: 0,
      caUserDetailType: -1,
      searchValue: "",
      queryParams: {
        page: 1,
        offset: 10,
      },
      caUserSelected: null,
      caUserList: [],
      caUserTree: [],
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
        {
          label: "Tính chất",
          field: "property",
          enum: this.$MISAEnum.Property,
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Tên tiếng anh",
          field: "englishName",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Diễn giải",
          field: "description",
          columnType: this.$MISAEnum.ColumnType.View,
        },
        {
          label: "Trạng thái",
          field: "inActive",
          enum: this.$MISAEnum.ActiveState,
          columnType: this.$MISAEnum.ColumnType.View,
        },
      ],
    };
  },
  methods: {
    /**
     * Chặn sự kiện double click nếu click nhanh
     * Author: ptrung26 (30/09/2023)
     */
    preventDblClickEvent(event) {
      event.stopPropagation();
    },

    /**
     * Xử lý việc mở form kế toán
     * Author: ptrung26 (18/10/2023)
     */
    handleOpenForm({ type, caUser }) {
      // Gán kiểu form và caUser đã lựa chọn nếu có
      this.caUserDetailType = type;
      this.caUserSelected = caUser;
      this.isOpenForm = true;
    },

    /**
     * Xử lý việc đóng form kế toán
     * Author: ptrung26 (18/10/2023)
     */
    handleCloseForm() {
      this.isOpenForm = false;
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
        this.contextMenuPostion.top = event.clientY + marginTop + "px";
        this.contextMenuPostion.left = event.clientX - menuWidth + "px";
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
     * Xử lý xóa toast message
     * Author: ptrung26 (18/10/2023)
     */
    handleCloseToast(toastId) {
      this.toastList.pop(toastId);
    },

    /**
     * Cập nhật lại dữ liệu trên UI khi dữ liệu thay đổi
     * Author: ptrung26 (31/08/2023)
     */
    handleUpdateWhenDataChanged() {
      this.isDataChange = true;
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
     * Xử lý sự kiện dblclick vào item ở table
     * Author: ptrung26 (21/10/2023)
     * @param {Object} data thông tin item hiện tại
     */
    onTableRowDblClick(data) {
      this.handleOpenForm({
        type: this.$MISAEnum.FormType.Edit,
        caUser: data,
      });
    },

    /******************** API *******************************/

    /**
     * Xử lý lọc dữ liệu
     * Author: ptrung26 (03/11/2023)
     */
    async handleFilterData() {
      try {
        const res = await caUserService.filter();
        this.caUserList = res.data.data;
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Xử lý xóa item
     * Author: ptrung26 (20/10/2023)
     * @param {object} item item muốn xóa
     */
    async handleDeleteItem(item) {
      if (item["isParent"]) {
        await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Title.DeleteError,
          message:
            this.$MISAResource.VI.ErrorMessage.CaUserDetail
              .ErrorDeleteBecauseItIsParent,
        });
      } else {
        const ok = await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Headers.Info,
          message: this.$MISAResource.VI.Dialog.CaUser.ConfirmDeleteAccount(
            item["accountNumber"]
          ),
        });
        if (ok) {
          try {
            const res = await caUserService.delete(item["accountId"]);
            if (res.status === this.$MISAEnum.HttpStatus.OK) {
              this.addToast({
                id: Date.now(),
                status: this.$MISAEnum.ToastStatus.Success,
                message:
                  this.$MISAResource.VI.SuccessMessage.CaUser.DeleteAccount,
              });
              this.handleUpdateWhenDataChanged(true);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    },

    /**
     * Xử lý ngừng sử dụng tài khoản
     * Author: ptrung26 (22/10/2023)
     * @param {Object} item
     */
    async handleInActive(item) {
      /* eslint-disable */
      // Nếu trạng thái là ngừng sử dụng
      if (item["inActive"]) {
        // Nếu item là cha, hỏi xem có muốn set cho toàn bộ con sang trạng thái sử dụng không
        if (item["isParent"]) {
          const ok = await this.$refs.dialog.show({
            title: this.$MISAResource.VI.Headers.Info,
            message: this.$MISAResource.VI.Dialog.CaUser.SetAllChildrenActive,
          });
          if (ok) {
            // Làm gì đó
          }
        }
        // Chuyển đổi item sang trạng thái sử dụng
        item["isActive"] = false;
        try {
          const res = await caUserService.put(item);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      }
      // Nếu trạng thái là sử dụng
      else {
        item["inActive"] = true;
        try {
          const res = await caUserService.put(item);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      }
    },

    /**
     * Hiện thị loading dữ liệu
     * Author: ptrung26 (20/10/2023)
     */
    enableLoading(state) {
      this.isLoading = state;
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
          this.isLoading = false;
          this.isDataChange = false;
        }
      },
      immediate: true,
    },
    caUserList: {
      handler(newValue) {
        let list = JSON.parse(JSON.stringify(newValue));
        let map = {};
        let roots = [];

        for (let i = 0; i < list.length; i += 1) {
          map[list[i].accountId] = i;
          list[i].children = [];
        }

        for (let i = 0; i < list.length; i += 1) {
          let node = list[i];
          if (map[node.parentId] !== undefined) {
            list[map[node.parentId]].children.push(node);
          } else {
            roots.push(node);
          }
        }
        this.caUserTree = [...roots];
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // Emitter
    this.$emitter.on("onCloseForm", this.handleCloseForm);
    this.$emitter.on("onCloseToast", this.handleCloseToast);
    this.$emitter.on("onAddToast", this.addToast);
    this.$emitter.on("onDataChange", this.handleUpdateWhenDataChanged);
    this.$emitter.on("onEnableLoading", this.enableLoading);

    // Call API
    this.isLoading = true;
    this.handleFilterData().finally(() => {
      this.isLoading = false;
    });
  },
  beforeUnmount() {
    // Hủy bỏ các emitter
    this.$emitter.off("onCloseForm", this.handleCloseForm);
    this.$emitter.off("onCloseToast", this.handleCloseToast);
    this.$emitter.off("onAddToast", this.addToast);
    this.$emitter.off("onDataChange", this.handleUpdateWhenDataChanged);
    this.$emitter.off("onEnableLoading", this.enableLoading);
  },
};
</script>

<template>
  <!-- Content -->
  <div class="content">
    <!-- Content header -->
    <div class="content-header">
      <h3 class="content-title">Hệ thống tài khoản</h3>
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
          <m-button>Xóa tất cả</m-button>
        </div>
        <div class="content-toolbar-right">
          <div class="content-search-box">
            <m-input
              placeholder="Tìm kiếm theo mã, tên kế toán"
              v-model="searchValue"
            />
            <div class="m-icon m-icon-search m-input-action"></div>
          </div>
          <button class="expand-all">Mở rộng</button>
          <m-button-icon
            class="m-icon-refresh"
            @click="handleUpdateWhenDataChanged"
          ></m-button-icon>
          <m-button
            class="btn-add"
            @click="
              handleOpenForm({ type: $MISAEnum.FormType.Add, caUser: null })
            "
            >Thêm</m-button
          >
        </div>
      </div>
      <div class="content-grid">
        <m-table
          :data="caUserTree"
          :columns="columns"
          :onTableRowDblClick="onTableRowDblClick"
          isParentKey="isParent"
        >
          <template #body="node">
            <div class="grid w-full justify-center align-center">
              <button
                class="m-td-edit p-r-6"
                @click.stop="
                  handleOpenForm({
                    type: $MISAEnum.FormType.Edit,
                    caUser: node,
                  })
                "
                @dblclick="preventDblClickEvent($event)"
              >
                Sửa
              </button>
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
                  <div
                    class="m-context-menu-item"
                    @click="
                      handleOpenForm({
                        type: $MISAEnum.FormType.Replication,
                        caUser: node,
                      })
                    "
                  >
                    Nhân bản
                  </div>
                  <div
                    class="m-context-menu-item"
                    @click="handleDeleteItem(node)"
                    @dblclick="preventDblClickEvent($event)"
                  >
                    Xóa
                  </div>
                  <div
                    class="m-context-menu-item"
                    @click="handleInActive(node)"
                  >
                    {{
                      node["inActive"] === true
                        ? this.$MISAResource.VI.ActiveMenu.inactive
                        : this.$MISAResource.VI.ActiveMenu.active
                    }}
                  </div>
                </div>
              </teleport>
            </div>
          </template>
        </m-table>
        <!-- Content pagination -->
        <div class="content-pagination" v-if="caUserList.length > 0">
          <p class="total-record">
            Tổng số {{ this.caUserList.length }} bản ghi
          </p>
        </div>
        <!-- If data not found -->
        <div class="not-found-data" v-if="caUserList.length === 0">
          <img src="../../assets/img/not-found.svg" alt="not found data" />
          <p>Không có dữ liệu</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <teleport to="body">
      <CAUserDetail
        v-if="isOpenForm"
        :type="caUserDetailType"
        :caUser="caUserSelected"
        position="right"
      ></CAUserDetail>
    </teleport>

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
  </div>
</template>

<style scoped>
@import url(@/css/views/ca/caUser.css);
</style>
