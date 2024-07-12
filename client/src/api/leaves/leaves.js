import { Api } from "../../lib/common";

export const getAllLeavesFn = async () => {
  const response = await Api.get("/Leaves");
  return response.data;
};

export const getLeavesByIdFn = async (id) => {
  const response = await Api.get(`/Leaves/${id}`);
  return response.data;
};

export const createLeavesFn = async () => {
    const response = await Api.post("/Leaves");
    return response.data;
  };
