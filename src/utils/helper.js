import MISAEnum from "./MISAEnum";

/**
 * Chuyển đổi date sang dạng 'dd/mm/yyyy'
 * Author: ptrung26 (29/08/2023)
 * @param {*} dateString
 * @returns date
 */
const convertDate = (val, format, split = "/") => {
  if (!val) {
    return "";
  }

  try {
    const date = new Date(val);
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const year = date.getFullYear();
    format =
      format ||
      localStorage.getItem("dateType") ||
      MISAEnum.DateType.dd__mm__yyyy;
    let result = formatDateType(day, month, year, format, split);
    return result;
  } catch {
    return "";
  }
};

/**
 * Validate email
 * Author: ptrung26 (01/10/2023)
 * @param {string} email giá trị email cần validate
 * @returns email có hợp lệ hay không
 */
const emailValidate = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

/**
 * convert chuỗi pascalCase sang camelCase
 * Author: ptrung26 (04/10/2023)
 * @param {string} str chuỗi cần convert
 * @returns chuỗi sau khi convert
 */
const camelSentence = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Đổi định dạng hiện thị date
 * Author: ptrung26 (06/10/2023)
 * @param {string} str định dạng date muốn chuyển đổi
 * @returns định dạng date sau khi chuyển đổi
 */
const formatDateType = (day, month, year, format, split = "/") => {
  let dateType = 0;
  if (format) {
    dateType = parseInt(format);
  }
  switch (dateType) {
    case MISAEnum.DateType.dd__mm__yyyy:
      return `${day}${split}${month}${split}${year}`;
    case MISAEnum.DateType.mm__dd__yyyy:
      return `${month}${split}${day}${split}${year}`;
    case MISAEnum.DateType.yyyy__mm__dd:
      return `${year}${split}${month}${split}${day}`;
    default:
      return `${day}${split}${month}${split}${year}`;
  }
};

/**
 * Chuyển đổi tiền theo chuẩn định dạng đề ra
 * Author: ptrung26 (29/10/2023)
 * @param {int} number Số tiền
 */
const formatMoney = (number) => {
  if (!number && number !== 0) {
    return "";
  }
  return new Intl.NumberFormat().format(number);
};

export default {
  convertDate,
  emailValidate,
  camelSentence,
  formatDateType,
  formatMoney,
};
