import publicAPI from "@/config/api";

const dateTypeConfiguration = {
  /**
   * API trả về toàn bộ định dạng phòng ban
   * Author: ptrung26 (10/10/2023)
   * @returns response
   */
  async get() {
    const res = await publicAPI.get("/SettingConfigs");
    return res;
  },
};

export default dateTypeConfiguration;
