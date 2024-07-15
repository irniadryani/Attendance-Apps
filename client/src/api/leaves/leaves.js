import { Api } from "../../lib/common";

export const getAllLeavesFn = async () => {
  const response = await Api.get("/leaves");
  return response.data;
};

export const getLeavesByIdFn = async (id) => {
  const response = await Api.get(`/leaves/${id}`);
  return response.data;
};

export const createLeavesFn = async (data) => {
  const response = await Api.post("/leaves", data);
  return response.data;
};

export const updateLeavesFn = async (id, data) => {
  const response = await Api.put(`/leaves/${id}`, data);
  return response.data;
};
