import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:'https://rentacarapi.amplitudo.me/api'
})

export default axiosInstance