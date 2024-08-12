import { Api } from "../../lib/common";
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const checkinFn = async (data) => {
  const response = await Api.post("/check-in", data);
  return response.data;
};

export const checkoutFn = async (data) => {
  const response = await Api.post("/check-out", data);
  return response.data;
};

export const checkinWfhFn = async (data) => {
  const response = await Api.post("/check-in-wfh", data, formDataconfig);
  return response.data;
};

export const checkoutWfhFn = async (data) => {
  const response = await Api.post("/check-out-wfh", data, formDataconfig);
  return response.data;
};

export const getAllAttendanceFn = async () => {
  const response = await Api.get("/attendances-monthly");
  return response.data;
};

export const getAllAttendanceDataFn = async () => {
  const response = await Api.get("/attendances");
  return response.data;
};

export const getAttendanceByIdFn = async (id) => {
  const response = await Api.get(`attendances/${id}`);
  return response.data;
};

export const getAllAttendanceByIdFn = async (id) => {
  const response = await Api.get(`single-attendances/${id}`);
  return response.data;
};

export const recapAttendanceFn = async ({ full_name, startDate, endDate }) => {
  const response = await Api.get("/recap-attendances", {
    params: {
      full_name,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const recapAllAttendanceFn = async () => {
  const response = await Api.get("/recap-attendances");
  return response.data;
};