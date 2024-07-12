import { Api } from "../../lib/common";

export const getAllAnnouncementFn = async () => {
  const response = await Api.get("/announcements");
  return response.data;
};

export const getAnnouncementByIdFn = async (id) => {
  const response = await Api.get(`/announcement/${id}`);
  return response.data;
};

export const createAnnouncementFn = async (data) => {
  const response = await Api.post("/announcement", data);
  return response.data;
};

export const updateAnnouncementFn = async (id) => {
  const response = await Api.put(`/announcement/${id}`);
  return response.data;
};

export const deleteAnnouncementFn = async (id) => {
  const response = await Api.delete(`/announcement/${id}`);
  return response.data;
};
