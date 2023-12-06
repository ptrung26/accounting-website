<script>
import MISAResource from "../../utils/MISAResource.js";
import publicAPI from "@/config/api.js";
import MComboboxTable from "./MComboboxTable.vue";
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
    checkedKey: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: Object,
      default: () => ({}),
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
      default: "bottom",
    },
    tabindex: {
      type: Number,
      default: -1,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
    },
    validator: {
      type: Function,
      default: () => {},
    },
    messageNotFound: {
      type: String,
      default: "",
    },
    comboboxError: {
      type: String,
      default: "",
    },
    minWidth: {
      type: Number,
    },
    text: {
      type: String,
      default: "",
    },
  },
  emits: [
    "update-combobox",
    "show-error",
    "keydown-tab",
    "keydown-shift-tab",
    "keydown-down",
    "keydown-up",
  ],
  methods: {
    /**
     * Xử lý việc đóng hoặc mở menu combobox
     * Author: ptrung26 (19/08/2023)
     * Modified by: ptrung26 (30/09/2023)
     */
    async handleToggleMenu() {
      if (this.disable || this.readonly) {
        return;
      }

      // Thay đổi trạng thái của combobox
      this.isOpenMenu = !this.isOpenMenu;
      this.dataFilter = this.data;

      // Thiết lập focus vào combobox
      if (this.isOpenMenu) {
        this.$refs.combobox.focus();
      }

      // Thiết lập vị trí của combobox
      this.handleCustomPosition();
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
    handleSelectItem(item = {}) {
      // Nếu chọn được item trong danh sách
      if (Object.keys(item).length > 0) {
        this.inputValue = item[this.propText];
        this.isHasError = false;
        this.selectedId = item[this.checkedKey];
        this.$emit("show-error", "");
      } else {
        this.selectedId = null;
      }

      // Gửi dữ liệu đi
      this.$emit("update-combobox", {
        name: this.name,
        value: item,
        propText: this.propText,
        propValue: this.propValue,
        inputValue: this.inputValue,
      });
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
        let height = comboboxRect.height;
        let bottom = comboboxRect.bottom;
        let width = comboboxRect.width;
        // Thiết lập vị trí;
        this.dropdownPosition.left = left + "px";
        this.dropdownPosition.top = bottom + "px";
        if (this.position === "top") {
          this.dropdownPosition[
            "transform"
          ] = `translateY(calc(-105% - ${height}px)`;
        }
        if (this.position === "bottom-middle") {
          this.dropdownPosition["transform"] = `translateX(-50%)`;
        }
        // Thiết lập kích thược
        if (!this.minWidth) {
          this.dropdownSize["min-width"] = width + "px";
        } else {
          this.dropdownSize["min-width"] = this.minWidth + "px";
        }
      }
    },

    /**
     * Xử lý việc di chuyện quả các phần tử
     * Author: ptrung26 (1/10/2023)
     */
    handleNavItem(direction) {
      if (direction === "down") {
        // Xử lý khi ấn phím mũi tên xuống
        if (this.arrowIndex < this.dataFilter.length - 1) {
          this.arrowIndex++;
        }
      } else if (direction === "up") {
        // Xử lý khi ấn phím mũi tên lên
        if (this.arrowIndex > 0) {
          this.arrowIndex--;
        }
      }
    },

    /**
     * Xử lý khi focus vào combobox
     * Author: ptrung26 (09/10/2023)
     */
    async handleOnFocus() {
      if (this.disable || this.readonly) {
        return;
      }

      this.isOpenMenu = true;
      this.isFocus = true;
      this.handleCustomPosition();
      this.isOpenMenu = false;
      this.focus();
    },

    /**
     * Xử lý khi ấn nút tab
     * Author: ptrung26 (09/10/2023)
     */
    handleOnKeydownTab(event) {
      this.handleCloseMenu();
      this.isFocus = false;
      if (
        this.inputValue &&
        this.dataFilter.length > 0 &&
        !this.isChoose &&
        this.isType
      ) {
        this.handleSelectItem(this.dataFilter[0]);
        this.isChoose = true;
      }

      if (!event) {
        return;
      }

      if (event.shiftKey && event.key === "Tab") {
        this.$emit("keydown-shift-tab", event);
      } else {
        this.$emit("keydown-tab", event);
      }
    },

    /**
     * Xử lý khi ấn enter chọn phần tử
     * Author: ptrun26 (12/11/2023)
     */
    handleEnterKeyBoard() {
      // Nếu chọn bằng mũi tên
      if (this.arrowIndex !== -1) {
        const item = this.dataFilter[this.arrowIndex];
        this.handleSelectItem(item);
        this.isChoose = true;
        this.arrowIndex = -1;
      }
      this.handleCloseMenu();
    },

    /**
     * Xử lý khi giá trị input thay đổi
     * Author: ptrung26 (09/10/2023)
     * @param {object} e input event
     */
    handleOnInput(e) {
      let value = e.target.value;
      this.inputValue = value;
      this.isChoose = false;
      this.isType = true;
      this.handleSelectItem();

      // Nếu giá trị input không có
      if (!value) {
        this.$emit("show-error", "");
        this.isHasError = false;
      }

      // Thực hiện lọc dữ liệu theo input
      this.dataFilter = this.data.filter((item) => {
        if (this.columns.length) {
          return this.columns.some(
            (col) =>
              item[col.field] &&
              item[col.field].toLowerCase().includes(value.trim().toLowerCase())
          );
        } else {
          return (
            value === "" ||
            item[this.propText]
              .toLowerCase()
              .includes(value.trim().toLowerCase())
          );
        }
      });

      // Focus vào item đầu tiên nếu được tìm thấy
      if (this.dataFilter.length > 0) {
        this.focusId = this.dataFilter[0].uuid;
      }
      this.isOpenMenu = true;

      // Validate dữ liệu
      this.validateInput(value);
    },

    /**
     * Xử lý validate giá trị input
     * Author: ptrung26 (09/10/2023)
     */
    validateInput(value) {
      let error = "";

      // Nếu dữ liệu lọc không có
      if (this.dataFilter.length == 0) {
        error = this.messageNotFound;
      } else {
        // Validate input
        error = this.validator(value);
      }

      // Nếu tồn tại lỗi
      if (error) {
        this.isHasError = true;
      } else {
        this.isHasError = false;
      }
      this.$emit("show-error", error);
    },

    /**
     * Xử lý khi click ra ngoài combobox
     * Author: ptrung26 (22/10/2023)
     */
    onClickOutSide() {
      this.handleCloseMenu();
      if (this.$refs.input !== document.activeElement) this.isFocus = false;
    },

    /**
     * Xử lý khi click vào item trên combobox
     * @param {Object} item
     */
    handleOnTrClick(item) {
      this.isChoose = true;
      this.handleSelectItem(item);
      this.handleCloseMenu();
      this.isFocus = true;
      this.$refs.input.focus();
    },

    /**
     * Thêm id cho các item trong data
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
    set(label, value) {
      let item = {};
      item[this.propText] = label;
      item[this.propValue] = value;
      this.inputValue = label;
      this.handleSelectItem(item);
    },

    /**
     * Xử lý focus vào combobox
     * Author: ptrung26 (25/11/2023)
     */
    focus() {
      this.$refs.input.focus();
      this.isFocus = true;
    },

    /***
     * Xử lý blur ra khỏi combobox
     * Author: ptrung26 (25/11/2023)
     */
    blur() {
      this.$refs.input.blur();
      this.handleOnKeydownTab();
      this.isFocus = false;
    },

    /**
     * Xử lý sự kiện keydown của phím mũi tên
     * Author: ptrung26 (25/11/2023)
     * @param {Boolean} isUp hướng arrow
     */
    handleOnKeydownArrow(isUp) {
      if (!isUp) {
        this.isOpenMenu = true;
        this.$emit("keydown-down");
      } else {
        this.$emit("keydown-up");
      }
    },
  },
  watch: {
    defaultValue: {
      /**
       * Xử lý khi giá trị mặc định của cbb thay đổi thì cập nhật lại
       * Author: ptrung26 (1/10/2023)
       * @param {object} newValue giá trị mới
       */
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          const selectedItem = { ...newValue };
          const filter = this.data.find(
            (item) => item[this.propValue] === selectedItem[this.propValue]
          );
          if (filter) {
            this.inputValue = filter[this.propText];
            this.selectedId = filter[this.checkedKey];
          } else {
            this.selectedId = null;
          }
        }
      },
      immediate: true,
    },
    list: {
      /**
       * Xử lý khi prop "list" thay đổi giá trị
       * Author: ptrung26 (09/10/2023)
       * @param {Array} newValue giá trị mới của prop "list"
       */
      handler(newValue) {
        this.data = newValue;
        this.dataFilter = this.data;
        this.enrichTableData();
      },
      immediate: true,
    },
    comboboxError: {
      handler(newValue) {
        if (newValue) {
          this.isHasError = true;
        } else {
          this.isHasError = false;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      isOpenMenu: false,
      isFocus: false,
      focusId: "",
      selectedId: "",
      errorMessage: "",
      arrowIndex: -1,
      dropdownPosition: {},
      dropdownSize: {},
      inputValue:
        (this.defaultValue && this.defaultValue[this.propText]) || this.text,
      data: this.list,
      dataFilter: this.list,
      style: {},
      isHasError: false,
      isChoose: false,
      isType: false,
    };
  },
  created() {
    // Thực hiện lấy dữ liệu từ api:
    if (this.urlAPI) {
      publicAPI
        .get(this.urlAPI)
        .then((res) => {
          this.data = res.data.data;
          this.dataFilter = this.data;
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
    :class="{
      'm-input-error': isHasError,
      'm-combobox--focus': isFocus,
    }"
    v-click-outside="onClickOutSide"
    @keydown.enter="handleEnterKeyBoard"
    ref="combobox"
    v-keyboard-arrow="handleNavItem"
    @keydown.tab="handleOnKeydownTab"
    @keydown.down="handleOnKeydownArrow(false)"
    @keydown.up="handleOnKeydownArrow(true)"
    :style="style"
  >
    <div
      class="m-combobox-selection"
      :class="{ 'm-combobox--disabled': disable || readonly }"
    >
      <input
        type="text"
        ref="input"
        :value="!disable ? inputValue : ''"
        @input="handleOnInput"
        @focus="handleOnFocus"
        @mouseover="(e) => e.preventDefault()"
        @mouseleave="(e) => e.preventDefault()"
        :disabled="disable"
        :readonly="readonly"
        :tabindex="tabindex"
        autocomplete="off"
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

    <template>
      <Teleport to="body">
        <template v-if="cbbType === 0">
          <div
            v-if="isOpenMenu && dataFilter.length > 0"
            class="m-combobox-dropdown"
            :style="{ ...dropdownPosition, ...dropdownSize }"
            ref="dropdown"
          >
            <template v-if="dataFilter.length > 0">
              <div
                class="m-dropdown-item"
                v-for="(item, index) in dataFilter"
                :key="index"
                @click="handleSelectItem(item)"
                :class="{
                  'm-dropdown-item--selected': focusId === item.uuid,
                  'm-dropdown-item--nav': arrowIndex === index,
                }"
                ref="itemRef"
              >
                <span>{{ item[propText] }}</span>
                <img
                  v-if="selectedId === item[checkedKey]"
                  src="@/assets/img/choose.svg"
                  alt="choosen"
                />
              </div>
            </template>
            <template v-else> Không có dữ liệu hiển thị. </template>
          </div>
        </template>
        <template v-if="cbbType === 1">
          <div
            class="m-combobox-panel"
            ref="dropdown"
            :style="{ ...dropdownPosition, ...dropdownSize }"
            v-if="isOpenMenu"
          >
            <m-combobox-table
              :data="dataFilter"
              :columns="columns"
              :isToggleAll="true"
              isParentKey="is_parent"
              :onTrClick="handleOnTrClick"
              :selectedId="selectedId"
              :checkedKey="checkedKey"
              :focusId="focusId"
            >
            </m-combobox-table>
          </div>
        </template>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
@import url(@/css/components/combobox.css);
</style>
