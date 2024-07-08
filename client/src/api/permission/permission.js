import { Api } from "../../lib/common";

export const getAllPermissionFn = async () => {
  const response = await Api.get("/permissions");
  return response.data;
};

export const getPermissionByIdFn = async (id) => {
  const response = await Api.get(`/permission/${id}`);
  return response.data;
};

export const createPermissionFn = async (data) => {
    const response = await Api.post("/permission", data);
    return response.data;
  };

  export const updatePermissionFn = async (id) => {
    const response = await Api.put(`/permission/${id}`);
    return response.data;
  };