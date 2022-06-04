import axiosInstance from "./axios";

export const getClients = ({ pageParam = 1, queryKey }) => {
  const { search } = queryKey[1];
  return axiosInstance.get(`/clients?page=${pageParam}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`},
    params: {
      search: search,
    },
  });
};

export const getAllClients = () => {
  return axiosInstance.get(`/clients`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`},
  });
};

export const addClient = (data) => {
  return axiosInstance.post(`/user-store`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}` },
  });
};

export const showClient = (id) => {
  return axiosInstance.get(`/user-show/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}` },
  });
};

export const updateClient = (data, id) => {
  return axiosInstance.post(`/user-update/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}` },
  });
};

export const deleteClient = (id) => {
  return axiosInstance.delete(`/user-delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}` },
  });
};

export const getCountries = () => {
  return axiosInstance.get(`/countries`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}` },
  });
};
