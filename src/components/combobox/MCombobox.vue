<script>
import MISAResource from "../../utils/MISAResource.js";
import publicAPI from "@/config/api.js";
import MComboboxTable from "./MTable.vue";
import { v4 as uuidv4 } from "uuid";
export default {
  components: { MComboboxTable },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: "",
    },
    cbbType: {
      type: Number,
      default: 0,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    propText: {
      type: String,
      default: "",
    },
    propValue: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    onItemChange: {
      type: Function,
      default: () => {},
    },
    placeholder: {
      type: String,
      default: MISAResource.VI.comboboxLabel.placeholder,
    },
    urlAPI: {
      type: String,
      default: "",
    },
    isLoadData: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "top",
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
    },
  },
  methods: {
    /**
     * Xử lý việc đóng hoặc mở menu combobox
     * Author: ptrung26 (19/08/2023)
     * Modified by: ptrung26 (30/09/2023)
     */
    async handleToggleMenu() {
      if (this.disable) {
        return;
      }

      // Thiết lập dữ liệu ban đầu
      this.dataFilter = this.data;

      // Thay đổi trạng thái của combobox
      this.isOpenMenu = !this.isOpenMenu;

      // Thiết lập focus vào combobox
      if (this.isOpenMenu) {
        this.$refs.combobox.focus();
      }

      // Thiết lập vị trí của combobox
      this.handleCustomPosition();

      // Nếu chọn bằng mũi tên
      if (this.navIdx !== -1) {
        const idx = this.navIdx;
        const item = this.data[idx];
        this.hanldeSelectItem(item, idx);
        this.navIdx = -1;
      }
    },

    /**
     * Xử lý việc đóng menu combobox
     * Author: ptrung26 (19/08/2023)
     */
    handleCloseMenu() {
      this.isOpenMenu = false;
    },

    /**
     * Xử lý việc lựa chọn phần tử trong menu combobox
     * Author: ptrung26 (19/08/2023)
     * Modifed by: ptrung26 (09/10/2023)
     * @param {Object} item
     * @param {String} name
     */
    hanldeSelectItem(item) {
      this.selectedId = item.uuid;
      this.selectedItem = item;
      this.cbbValue = item[this.propText];
      this.onItemChange(this.name, item[this.propValue]);
      this.$refs.input.focus();
      this.handleCloseMenu();
    },

    /**
     * Xử lý ví trị của dropdown trước khi hiện lên
     * Author: 01/10/2023
     */
    async handleCustomPosition() {
      if (this.isOpenMenu && this.$refs.combobox) {
        const combobox = this.$refs.combobox;
        const comboboxRect = combobox.getBoundingClientRect();
        let left = comboboxRect.left;
        let bottom = comboboxRect.bottom;
        let width = comboboxRect.width;

        // Thiết lập vị trí;
        this.dropdownPosition.left = left + "px";
        this.dropdownPosition.top = bottom + "px";

        // Thiết lập kích thược
        this.dropdownSize["min-width"] = width + "px";
      }
    },

    /**
     * Xử lý việc di chuyện quả các phần tử
     * Author: ptrung26 (1/10/2023)
     */
    handleNavItem(direction) {
      if (direction === "down") {
        // Xử lý khi ấn phím mũi tên xuống
        if (this.navIdx < this.dataFilter.length - 1) {
          this.navIdx++;
        }
      } else if (direction === "up") {
        // Xử lý khi ấn phím mũi tên lên
        if (this.navIdx > 0) {
          this.navIdx--;
        }
      }
    },

    /**
     * Xử lý khi focus vào combobox
     * Author: ptrung26 (09/10/2023)
     */
    async handleOnFocus() {
      if (this.disable) {
        return;
      }

      this.isOpenMenu = true;
      this.isFocus = true;
      this.handleCustomPosition();
    },

    /**
     * Xử lý khi ấn nút tab
     * Author: ptrung26 (09/10/2023)
     */
    handleOnKeydownTab() {
      this.handleCloseMenu();
      this.isFocus = false;
    },

    /**
     * Xử lý khi giá trị input thay đổi
     * Author: ptrung26 (09/10/2023)
     * @param {object} e input event
     */
    async handleInputOnChange(e) {
      let { value } = e.target;
      this.cbbValue = value;
      this.dataFilter = this.data.filter((item) =>
        item[this.propText].toLowerCase().includes(value.toLowerCase())
      );
      this.navIdx = -1;
    },

    /**
     * Xử lý khi click ra ngoài combobox
     * Author: ptrung26 (22/10/2023)
     */
    onClickOutSide() {
      this.handleCloseMenu();
      this.isFocus = false;
    },

    /**
     * Xử lý khi click vào item trên combobox
     * @param {Object} item
     */
    handleOnTrClick(item) {
      this.hanldeSelectItem(item);
    },

    /**
     * Đệ quy thêm id cho các item trong data
     * Author: ptrung26 (22/10/2023)
     * @param {object} data item hiện tại
     */
    addUniqueId(data) {
      data.uuid = uuidv4();
      if (data.children) {
        data.children.forEach((child) => this.addUniqueId(child));
      }
    },

    /**
     * Thêm id vào từng item trong data
     * Author: ptrung26 (22/10/2023);
     */
    enrichTableData() {
      this.data.forEach((el) => this.addUniqueId(el));
    },

    /**
     * Xử lý reset combobox
     * Author: ptrung26 (24/10/2023)
     */
    handleReset() {
      this.cbbValue = this.defaultValue[this.propText];
      this.hanldeSelectItem(this.defaultValue);
    },

    /**
     * Trả về giá trị combobox
     * Author: ptrung26 (24/10/2023)
     */
    getCbbValue() {
      return this.cbbValue;
    },

    /**
     * Xử lý chuyển dữ liệu phẳng sang hình cây
     * Author: ptrung26 (04/11/2023)
     */
    convertFlatDataToTree() {
      let list = JSON.parse(JSON.stringify(this.data));
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
      this.data = [...roots];
      this.dataFilter = [...roots];
    },
  },
  watch: {
    defaultValue: {
      /**
       * Xử lý khi giá trị mặc định của cbb thay đổi thì cập nhật lại
       * Author: ptrung26 (1/10/2023)
       * @param {object} newValue giá trị mới
       */
      handler(newValue) {
        if (newValue) {
          this.selectedItem = newValue;
          this.cbbValue = this.selectedItem[this.propText];
        }
      },
    },
    list: {
      /**
       * Xử lý khi prop "list" thay đổi giá trị
       * Author: ptrung26 (09/10/2023)
       * @param {Array} newValue giá trị mới của prop "list"
       */
      handler(newValue) {
        this.data = newValue;
        this.enrichTableData();
      },
    },
  },
  data() {
    return {
      isOpenMenu: false,
      isFocus: false,
      selectedId: "",
      navIdx: -1,
      selectedItem: this.defaultValue,
      dropdownPosition: {},
      dropdownSize: {},
      cbbValue: this.defaultValue && this.defaultValue[this.propText],
      data: this.list,
      dataFilter: this.list,
      style: {},
    };
  },
  created() {
    // Thực hiện lấy dữ liệu từ api:
    if (this.urlAPI) {
      publicAPI
        .get(this.urlAPI)
        .then((res) => {
          this.data = res.data.data;
          this.dataFilter = res.data.data;
          this.enrichTableData();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (this.width) {
      this.style.width = this.width + "px";
    }
  },

  mounted() {
    window.addEventListener("resize", this.handleCustomPosition);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleCustomPosition);
  },
};
</script>

<template>
  <div
    class="m-combobox"
    :class="{ 'm-combobox--focus': isFocus }"
    v-click-outside="onClickOutSide"
    @keydown.enter="handleToggleMenu"
    ref="combobox"
    v-keyboard-arrow="handleNavItem"
    @keydown.tab="handleOnKeydownTab"
    :style="style"
  >
    <div
      class="m-combobox-selection"
      :class="{ 'm-combobox--disabled': disable }"
    >
      <input
        type="text"
        ref="input"
        :value="!disable ? cbbValue : ''"
        @input="handleInputOnChange"
        @focus="handleOnFocus"
        :tabindex="tabindex"
        :disabled="!editable"
        :readonly="disable"
      />
      <button class="m-combobox-btn" @click.stop="handleToggleMenu">
        <span
          class="m-icon"
          :class="{
            'm-icon-arrow-down': !isOpenMenu,
            'm-icon-arrow-up': isOpenMenu,
          }"
        ></span>
      </button>
    </div>

    <Teleport to="body">
      <template v-if="cbbType === 0">
        <div
          v-if="isOpenMenu && dataFilter.length > 0"
          class="m-combobox-dropdown"
          :style="{ ...dropdownPosition, ...dropdownSize }"
          ref="dropdown"
        >
          <div
            class="m-dropdown-item"
            v-for="(item, index) in dataFilter"
            :key="index"
            @click="hanldeSelectItem(item)"
            :class="{
              'm-dropdown-item--selected': selectedId === item.uuid,
              'm-dropdown-item--nav': navIdx === index,
            }"
            ref="itemRef"
          >
            <span>{{ item[propText] }}</span>
            <img
              v-if="selectedItem === item"
              src="@/assets/img/choose.svg"
              alt="choosen"
            />
          </div>
        </div>
      </template>

      <template v-if="cbbType === 1">
        <div
          class="m-combobox-panel"
          ref="dropdown"
          :style="{ ...dropdownPosition, ...dropdownSize }"
          v-if="isOpenMenu && dataFilter.length > 0"
        >
          <m-combobox-table
            :data="dataFilter"
            :columns="columns"
            :isToggleAll="true"
            isParentKey="is_parent"
            :onTrClick="handleOnTrClick"
            :selectedId="selectedId"
          >
          </m-combobox-table>
        </div>
      </template>
    </Teleport>
  </div>
</template>

<style scoped>
@import url(@/css/components/combobox.css);
</style>
