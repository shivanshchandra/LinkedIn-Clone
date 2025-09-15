const { default: axios} = require("axios");


export  const BASE_URL = "https://linkedin-clone-7d0a.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});