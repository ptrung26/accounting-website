import axios from "axios";
import { app } from "@/main.js";

// Tạo ra một instance để gọi API
const publicAPI = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      let { status, data } = error.response;
      if (typeof data === "string") data = JSON.parse(data);
      let errorCode = data && data.errorCode;
      let errorKey = null;
      let errorMessage = data.userMessage;
      let toast = app.config.globalProperties.$errorHandling.createError(
        status || app.config.globalProperties.$MISAEnum.HttpStatus.SERVER_ERROR,
        (data && data.userMessage) ||
          app.config.globalProperties.$MISAResource.VI.ErrorMessage.ServerError
      );

      if ((data && data.ErrorCode === 400) || errorCode === 400) {
        const errors = data?.Errors;
        if (errors) {
          const errorKeys = Object.keys(errors);
          if (errorKeys.length) {
            errorKey = errorKeys[0];
            errorMessage = errors[errorKey];
          }
        }
      }

      return Promise.reject({
        errorKey,
        errorMessage,
        status,
        errorCode,
        toast,
      });
    }
    return Promise.reject(error);
  }
);

export default publicAPI;
