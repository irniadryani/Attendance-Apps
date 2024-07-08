import { Api } from "../../lib/common";

export const checkinFn = async (data) => {
  const response = await Api.post("/check-in", data);
  return response.data;
};

export const checkoutFn = async (data) => {
  const response = await Api.post("/check-out", data);
  return response.data;
};

export const getAllAttendanceFn = async () => {
  const response = await Api.get("/attendances");
  return response.data;
};

export const getAttendanceByIdFn = async (id) => {
  const response = await Api.get(`attendances/${id}`);
  return response.data;
};