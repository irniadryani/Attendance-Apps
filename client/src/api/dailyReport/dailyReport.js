import { Api } from "../../lib/common";

export const getAllDailyReportFn = async () => {
  const response = await Api.get("/daily-reports");
  return response.data;
};

export const getDailyReportByIdFn = async (id) => {
  const response = await Api.get(`daily-reports/${id}`);
  return response.data;
};

export const createDailyReportFn = async (data) => {
    const response = await Api.post("/daily-reports", data);
    return response.data;
  };

