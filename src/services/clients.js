import axiosInstance from "./axios";

//GET USERS REQUEST JAVLJA ERROR 500


//addClient javlja error 404
export const addClient = (data) => {
  return axiosInstance.post(`/create-client`, data, {
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
