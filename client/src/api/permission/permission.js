import { Api } from "../../lib/common";
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};


export const getAllPermissionFn = async () => {
  const response = await Api.get("/permissions");
  return response.data;
};

export const getPermissionByIdFn = async (id) => {
  const response = await Api.get(`/permission/${id}`);
  return response.data;
};

export const createPermissionFn = async (data) => {
  const response = await Api.post("/permission", data, formDataconfig);
  return response.data;
};

export const updatePermissionFn = async (id, data) => {
  const response = await Api.put(`/permission/${id}`, data, formDataconfig);
  return response.data;
};
