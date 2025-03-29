import axios from "axios";
const baseUrl = 'https://uea52gjclk.execute-api.ap-south-1.amazonaws.com'

export const api = axios.create({
    baseURL:baseUrl
})