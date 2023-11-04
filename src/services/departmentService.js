import publicAPI from "@/config/api";

const departmentService = {
  /**
   * API trả về toàn bộ phòng ban
   * Author: ptrung26 (11/08/2023)
   * @returns response
   */
  async getAllDepartments() {
    const res = await publicAPI.get("/Departments");
    return res;
  },
};

export default departmentService;
