import { Api } from "../../lib/common";
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const getAllUserFn = async () => {
  const response = await Api.get("/users");
  return response.data;
};

export const getUserByIdFn = async (id) => {
  const response = await Api.get(`/user/${id}`);
  return response.data;
};

export const createUserFn = async (data) => {
  const response = await Api.post("/users", data);
  return response.data;
};

export const updateUserFn = async (id, data) => {
  const response = await Api.put(`/user/${id}`, data, formDataconfig);
  return response.data;
};

export const updateRoleUserFn = async (id, data) => {
  const response = await Api.put(`/user/update-role/${id}`, data);
  return response.data;
};

export const changePasswordUserFn = async (id, data) => {
  const response = await Api.put(`/user/change-password/${id}`, data);
  return response.data;
};

export const changeStatusUserFn = async (id, data) => {
  const response = await Api.patch(`/user/change-status/${id}`, data);
  return response.data;
};

export const deleteUserFn = async (id, data) => {
  const response = await Api.delete(`user/${id}`, data);
  return response.data;
};

export const resetPasswordFn = async (id, data) => {
  const response = await Api.put(`/user/reset-password/${id}`, data);
  return response.data;
};

