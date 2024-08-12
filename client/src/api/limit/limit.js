import { Api } from "../../lib/common";

export const getLimitLeavesFn = async () => {
  const response = await Api.get("/get-limit-leaves");
  return response.data;
};
