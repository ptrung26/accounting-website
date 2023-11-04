import publicAPI from "@/config/api";

// api nhân viên
const apiController = "/employees";

const employeeService = {
  /**
   * API lấy danh sách nhân viên theo lọc
   * Author: ptrung26 (14/09/2023)
   * @param {object} params thông tin truy vấn
   * @returns response
   */
  async filter(params) {
    const res = await publicAPI.get(`${apiController}`, { params });
    return res;
  },

  /**
   * Thêm nhân viên mới
   * Author: ptrung26 (30/08/2023)
   * @param {object} employee thông tin nhân viên
   * @return response
   */
  async post(employee) {
    const res = await publicAPI.post(`${apiController}`, employee);
    return res;
  },

  /**
   * API sửa thông tin nhân viên theo id
   * Author: ptrung26 (30/08/2023)
   * @param {object} employee thông tin nhân viên
   * @return response
   */
  async put(employee) {
    const res = await publicAPI.put(
      `${apiController}/${employee.employeeId}`,
      employee
    );
    return res;
  },

  /**
   * API xóa nhân viên theo id
   * Author: ptrung26 (02/09/2023)
   * @param {string} employeeId Id của nhân viên
   * @return response
   */
  async delete(employeeId) {
    const res = await publicAPI.delete(`${apiController}/${employeeId}`);
    return res;
  },

  /**
   * API xóa nhiều nhân viên
   * Author: ptrung26 (14/09/2023)
   * @param {Array} employeeIds Danh sách các employee id cần xóa
   * @returns response
   */
  async mulDelete(employeeIds) {
    const res = await publicAPI.delete(`${apiController}`, {
      data: employeeIds,
    });
    return res;
  },

  /**
   * API tạo mã nhân viên mới
   * Author: ptrung26 (24/09/2023)
   * @returns response
   */
  async generateNewEmployeeCode() {
    const res = await publicAPI.get(`${apiController}/NewEmployeeCode`);
    return res;
  },

  /**
   * Xử lý gọi API xuất dữ liệu nhân viên ra excel
   * Author: ptrung26 (01/10/2023)
   * @param {object} employees Danh sách nhân viên cần xuất ra exel
   * @returns response
   */
  async exportEmployees(employee) {
    const res = await publicAPI.post("/exportEmployees", employee, {
      responseType: "blob",
    });
    return res;
  },
};

export default employeeService;
