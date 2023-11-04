import MISAEnum from "./MISAEnum";
import MISAResource from "./MISAResource";

const errorHanding = {
  /**
   * Xử lý hiện thị thông báo lỗi cho người dùng nếu có
   * Author: ptrung26 (01/09/2023)
   * @param {int} httpStatus  Http status code
   * @param {string} message Message muốn thông báo
   * @returns toast message thông báo tương ứng
   */
  createError(httpStatus, message) {
    let toast;
    // Hiện thị thông báo tương ứng với từng http status
    switch (httpStatus) {
      case MISAEnum.HttpStatus.BAD_REQUEST:
        toast = {
          id: Date.now(),
          status: MISAEnum.ToastStatus.Error,
          title: MISAResource.VI.Headers.Error,
          message: message,
        };
        break;
      case MISAEnum.HttpStatus.NOT_FOUND:
        toast = {
          id: Date.now(),
          status: MISAEnum.ToastStatus.Error,
          title: MISAResource.VI.Headers.Error,
          message: message,
        };
        break;
      case MISAEnum.HttpStatus.SERVER_ERROR:
        toast = {
          id: Date.now(),
          status: MISAEnum.ToastStatus.Error,
          title: MISAResource.VI.Headers.Error,
          message: message,
        };
        break;
      default:
        toast = {
          id: Date.now(),
          status: MISAEnum.ToastStatus.Error,
          title: MISAResource.VI.Headers.ErrrorTitle,
          message: message,
        };
        break;
    }

    return toast;
  },
};

export default errorHanding;
