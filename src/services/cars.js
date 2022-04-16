import axiosInstance from "./axios";

export const getCars = ({ pageParam = 1, queryKey }) => {
  const { search } = queryKey[1];
  return axiosInstance.get(`/vehicles?page=${pageParam}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`},
    params: {
      search: search,
    },
  });
};


//Javlja Network error, Blocked by CORS Policy
export const storeCar = (data) => {
  return axiosInstance.post(`/vehicle`, data,{ headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`}});
};

export const showCar = (id) => {
  return axiosInstance.get(`/vehicle-show/${id}`,{ headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`}});
};

//Javlja Network error, Blocked by CORS Policy
export const updateCar = (data, id) => {
  return axiosInstance.post(`/vehicle-update/${id}`, data,{ headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`}});
};

//Javlja Network error, Blocked by CORS Policy
export const deleteCar = (id) => {
  return axiosInstance.delete(`/vehicle-delete/${id}`, null, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`}});
};

export const getCarTypes = () => {
  return axiosInstance.get(`/car-types`,{ headers: { Authorization: `Bearer ${localStorage.getItem("jwt-token")}`}});
};
