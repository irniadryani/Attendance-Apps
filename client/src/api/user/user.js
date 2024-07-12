import { Api } from "../../lib/common";
// const formDataconfig = {
//     headers: {
//       "Content-Type": "multipart/form-data"
//    }
//   };

export const getAllUserFn = async () => {
  const response = await Api.get("/users");
  return response.data;
};

export const getUserByIdFn = async (id) => {
  const response = await Api.get(`/users/${id}`);
  return response.data;
};

export const createUserFn = async (data) => {
  const response = await Api.post("/users", data);
  return response.data;
};

export const updateUserFn = async (id) => {
  const response = await Api.put(`/users/${id}`);
  return response.data;
};

export const deleteUserFn = async (id) => {
  const response = await Api.delete(`users/${id}`);
  return response.data;
};
