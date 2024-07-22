import { Api } from "../../lib/common";

export const getUserContentFn = async () => {
  const response = await Api.get("/userContent");
  return response.data;
};

export const updateDefaultPasswordFn = async (data) => {
  const response = await Api.post(`/default-password`, data);
  return response.data;
};
export const updateLatitudeFn = async (data) => {
  const response = await Api.post(`/latitude`, data);
  return response.data;
};

export const updateLongitudeFn = async (data) => {
  const response = await Api.post("/longitude", data);
  return response.data;
};

// export const updateLeavesLimitFn = async (data) => {
//   const response = await Api.post("/limit-leaves", data);
//   return response.data;
// };

export const updateLeavesLimitFn = async (data) => {
  const response = await Api.post("/update-limit-leaves", data);
  return response.data;
};