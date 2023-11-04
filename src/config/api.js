import axios from "axios";
// Tạo ra một instance để gọi API
const publicAPI = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default publicAPI;
