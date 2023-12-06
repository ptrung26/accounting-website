<script>
import caAccountService from "@/services/caAccountService";
import CAUserDetail from "./CAUserDetail.vue"
import debounce from "lodash.debounce";
export default {
  name: "CaUser",
  components: {
    CAUserDetail,
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
      this.handleCloseContextMenu();
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
     * Xử lý sự kiện dblclick vào item ở table
     * Author: ptrung26 (21/10/2023)
     * @param {Object} data thông tin item hiện tại
     */
    tableRowDblClick(data) {
      this.handleOpenForm({
        type: this.$MISAEnum.FormType.Edit,
        caUser: data,
      });
    },

    /**
     * Bắt sự kiện thay đổi giá trị input
     * Author: ptrung26 (11/11/2023)
     * @param {object} e input event
     */
    handleChangSearchValue(e) {
      this.searchValue = e.target.value.trim();
    },

    /**
     * Xử lý nhân bản tài khoản
     * Author: ptrung26 (16/11/2023)
     * @param {Object} item
     */
    async handleReplication(item) {
      this.handleOpenForm({
        type: this.$MISAEnum.FormType.Replication,
        caUser: item,
      });
    },

    /**
     * Xử lý thêm họ hàng của item con
     * Author: ptrung26 (11/11/2023)
     * @param {Array} data Danh sách toàn bộ account
     * @param {Array} nodes Dữ liệu lọc
     * @param {Integer} searchType định dạng tìm kiếm (cha, con, cả 2)
     * @param {Array} ancestorsAndDescendants mảng gồm thông tin họ hàng của dữ liệu lọc
     */
    findAncestorsAndDescendants(
      data,
      nodes,
      searchType,
      ancestorsAndDescendants = []
    ) {
      nodes.forEach((node) => {
        // Tìm tài khoản cha
        const parentNode = data.find(
          (item) => item.accountId === node.parentId
        );
        // tìm các tài khoản con
        const childrenNodes = data.filter(
          (item) => item.parentId === node.accountId
        );

        if (searchType === 1 || searchType === 3) {
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
              searchType,
              ancestorsAndDescendants
            );
          }
        }

        if (searchType === 2 || searchType === 3) {
          if (childrenNodes.length > 0) {
            ancestorsAndDescendants.push(...childrenNodes);
          }

          this.findAncestorsAndDescendants(
            data,
            childrenNodes,
            searchType,
            ancestorsAndDescendants
          );
        }
      });

      return ancestorsAndDescendants;
    },

    /**
     * Xử lý dblclick item trong table
     * Author: ptrung26 (29/10/2023)
     * @param {Object} item
     */
    tableRowClick(item) {
      this.selectedId = item.reId;
    },

    /**
     * Xử lý mở rộng toàn bộ tabl cây
     * Author: ptrung26 (30/10/2023)
     */
    handleToggleAllTable() {
      this.isToggleAll = !this.isToggleAll;
    },

    /******************** API *******************************/

    /**
     * Xử lý lọc dữ liệu
     * Author: ptrung26 (03/11/2023)
     */
    async handleFilterData() {
      try {
        const res = await caAccountService.filter(this.queryParams);
        let _res = await caAccountService.filter({
          pageSize: 0,
          pageNumber: 0,
        });
        this.data = _res.data.data;
        let dataFilter = res.data.data;
        let uniqueByAccountNumber = [...dataFilter];
        /// Hiện thị cả họ hàng tài khoản nếu chỉ tìm thấy cha hoặc con
        if (this.searchValue) {
          // Dữ liệu lọc ban đầu
          let nodes = [...dataFilter];
          dataFilter = this.findAncestorsAndDescendants(
            this.data,
            nodes,
            this.$MISAEnum.FilterDataType.FindAncestorsAndDescendants,
            nodes
          );

          uniqueByAccountNumber = Array.from(
            dataFilter
              .reduce((acc, obj) => acc.set(obj.accountNumber, obj), new Map())
              .values()
          );
        }

        // Gán lại danh sách để hiện thị trên table
        this.caUserList = uniqueByAccountNumber;
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
        }
      }
    },

    /**
     * Xử lý xóa item
     * Author: ptrung26 (20/10/2023)
     * @param {object} item item muốn xóa
     */
    async handleDeleteItem(item) {
      this.handleCloseContextMenu();
      if (item["isParent"]) {
        await this.$refs.dialog.show({
          title: this.$MISAResource.VI.Title.DeleteError,
          icon: "m-icon m-icon-error m-48 flex-shrink",
          message:
            this.$MISAResource.VI.ErrorMessage.AccountDetail
              .ErrorDeleteBecauseItIsParent,
        });
      } else {
        const ok = await this.$refs.dialog.show({
          icon: "m-icon m-icon-warning",
          cancelButton: "Không",
          message: this.$MISAResource.VI.Dialog.CaUser.ConfirmDeleteAccount(
            item["accountNumber"]
          ),
        });
        if (ok) {
          try {
            const res = await caAccountService.delete(item["accountId"]);
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
            const { status, errorCode, toast } = err;
            if (status === 400) {
              if (errorCode === 400) {
                await this.$refs.dialog.show({
                  message: toast.message,
                  icon: "m-icon-error m-48",
                });
              }
            } else {
              this.addToast(toast);
            }
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
      this.handleCloseContextMenu();

      const accountIdList = [];
      let inactive = false;

      // Nếu là tài khoản chưa sử dụng
      if (item["inActive"]) {
        const parent = this.data.find(
          (_item) => _item.accountId === item.parentId
        );
        if (parent !== undefined) {
          // Nếu có kiểm tra xem tài khoản cha đang ở trạng thái ngừng sử dụng không
          if (parent["inActive"]) {
            await this.$refs.dialog.show({
              icon: "m-icon-error m-48 flex-shrink",
              message:
                this.$MISAResource.VI.Dialog.CaUser
                  .CantSetActiveBecauseParentIsInActive,
            });
            return;
          }
        }
        if (item["isParent"]) {
          // Hỏi xem có muốn thiết lập sử dụng cho tài khoản con không ?
          const ok = await this.$refs.dialog.show({
            cancelButton: "Không",
            icon: "m-icon m-icon-warning",
            message: this.$MISAResource.VI.Dialog.CaUser.SetAllChildrenActive,
          });
          // Nếu có
          if (ok) {
            const descentantsOfAccount = this.findAncestorsAndDescendants(
              this.data,
              [item],
              this.$MISAEnum.FilterDataType.FindDescendants,
              []
            );

            accountIdList.push(
              ...descentantsOfAccount.map((item) => item.accountId)
            );
          }
        }
        accountIdList.push(item.accountId);
        inactive = false;
      } else {
        if (item["isParent"]) {
          // Chuyển tất cả con và cha về đều về thành chưa sử dụng
          const descentantsOfAccount = this.findAncestorsAndDescendants(
            this.data,
            [item],
            this.$MISAEnum.FilterDataType.FindDescendants,
            []
          );
          accountIdList.push(
            ...descentantsOfAccount.map((item) => item.accountId)
          );
        }
        accountIdList.push(item.accountId);
        inactive = true;
      }
      try {
        let accountFilters = [...this.caUserList];
        let accountList = [...this.data];
        accountFilters.forEach((item) => {
          if (accountIdList.includes(item.accountId)) {
            item["inActive"] = inactive;
          }
        });
        accountList.forEach((item) => {
          if (accountIdList.includes(item.accountId)) {
            item["inActive"] = inactive;
          }
        });
        this.caUserList = [...accountFilters];
        this.data = [...accountList];
        await caAccountService.updateMulState(accountIdList, inactive);
      } catch (err) {
        const { toast } = err;
        if (toast !== undefined) {
          this.addToast(toast);
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
        pageSize: 0,
        pageNumber: 0,
      },
      caUserSelected: null,
      data: [],
      caUserList: [],
      caUserTree: [],
      selectList: [],
      toastList: [],
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
      selectedId: "",
      isToggleAll: false,
    };
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
    caUserList: {
      handler(newValue) {
        /// Tạo ra danh sách dạng cây
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
    searchValue: {
      /**
       * Xử lý khi search thay đổi
       * Author: ptrung26 (14/09/2023)
       * @param {string} newValue giá trị search mới
       */
      handler: debounce(function (newValue) {
        this.isLoading = true;
        if (newValue) {
          this.queryParams.columns = ["AccountNumber", "AccountName"];
        } else {
          delete this.queryParams.columns;
        }

        this.queryParams["keyWord"] = newValue;

        this.handleFilterData().finally(() => {
          this.isLoading = false;
          this.isToggleAll = true;
        });
      }, 800), // Thời gian debounce
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
              :value="searchValue"
              @input="handleChangSearchValue"
            />
            <div class="m-icon m-icon-search m-input-action"></div>
          </div>
          <button class="expand-all" @click="handleToggleAllTable">
            {{ isToggleAll ? "Thu gọn" : "Mở rộng" }}
          </button>
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
          :isShowMethod="true"
          :selectedId="selectedId"
          parentKey="isParent"
          checkedKey="accountId"
          :tableType="1"
          @row-dblclick="tableRowDblClick"
          @row-click="tableRowClick"
          @delete-row="handleDeleteItem"
          @replication-row="handleReplication"
          @edit-row="tableRowDblClick"
          @inactive-row="handleInActive"
          :isToggleAll="isToggleAll"
          :options="[
            this.$MISAEnum.TableMethod.Edit,
            this.$MISAEnum.TableMethod.Delete,
            this.$MISAEnum.TableMethod.Replication,
            this.$MISAEnum.TableMethod.InActive,
          ]"
        >
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
        <div class="m-spinner-circle"></div>
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
