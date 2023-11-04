import { createApp } from "vue";
import App from "./App.vue";
import MButton from "./components/button/MButton.vue";
import MButtonIcon from "./components/button/MButtonIcon.vue";
import MToastList from "./components/toast/MToastList.vue";
import MToast from "./components/toast/MToast.vue";
import MTooltip from "./components/tooltip/MTooltip.vue";
import MDialog from "./components/dialog/MDialog.vue";
import MInput from "./components/input/MInput.vue";
import MInputCheckbox from "./components/input/MInputCheckbox.vue";
import MInputRadio from "./components/input/MInputRadio.vue";
import MCombobox from "./components/combobox/MCombobox.vue";
import MComboButton from "./components/button/MComboButton.vue";
import MPagination from "./components/pagination/MPagination.vue";
import MTable from "./components/table/MTable.vue";
import MTableHeader from "./components/table/MTableHeader.vue";
import MTableBody from "./components/table/MTableBody.vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

import router from "./routes";
import {
  arrowKeyboard,
  clickOutside,
  enterKeyboard,
  escKeyBoard,
  focus,
} from "./utils/directives";
import MISAResource from "./utils/MISAResource";
import MISAEnum from "./utils/MISAEnum";
import helper from "./utils/helper";
import emitter from "tiny-emitter/instance";
import errorHandling from "./utils/errorHandling";

const app = createApp(App);

// Global Component
app.component("MButton", MButton);
app.component("MButtonIcon", MButtonIcon);
app.component("MToast", MToast);
app.component("MToastList", MToastList);
app.component("MDialog", MDialog);
app.component("MInput", MInput);
app.component("MInputCheckbox", MInputCheckbox);
app.component("MCombobox", MCombobox);
app.component("MComboButton", MComboButton);
app.component("MTooltip", MTooltip);
app.component("MPagination", MPagination);
app.component("MInputRadio", MInputRadio);
app.component("MTable", MTable);
app.component("MTableHeader", MTableHeader);
app.component("MTableBody", MTableBody);

app.component("DatePicker", DatePicker);

// Global Directives
app.directive("click-outside", clickOutside);
app.directive("keyboard-esc", escKeyBoard);
app.directive("keyboard-enter", enterKeyboard);
app.directive("keyboard-arrow", arrowKeyboard);

app.directive("focus", focus);

// Global Utils
app.config.globalProperties.$MISAResource = MISAResource;
app.config.globalProperties.$MISAEnum = MISAEnum;
app.config.globalProperties.$helper = helper;
app.config.globalProperties.$emitter = emitter;
app.config.globalProperties.$errorHandling = errorHandling;

app.use(router);
app.mount("#app");
