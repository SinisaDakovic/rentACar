import axiosInstance from '../services/axios'
import axios from 'axios'

export const login = (data) => {
    return axios({
        method:'POST',
        baseURL:'https://rentacarapi.amplitudo.me/api',
        url:'/auth/login',
        data
    })
}

export const logout = (data) => {
    return axiosInstance.post(
        '/auth/logout',
        data,
        {headers:{Authorization: `Bearer ${localStorage.getItem('jwt-token')}`}}
)}

export const getAccountData = (data) => {
    return axios({
        baseURL:'https://rentacarapi.amplitudo.me/api',
        url:'/auth/me',
        data,
        headers:{Authorization: `Bearer ${localStorage.getItem('jwt-token')}`}
    }
)}
