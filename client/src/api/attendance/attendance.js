import { Api } from "../../lib/common";

export const checkinFn = async (data) => {
  const response = await Api.post("/check-in", data);
  return response.data;
};
