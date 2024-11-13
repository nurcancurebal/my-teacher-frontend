import axios from "axios";

const config = axios.create({
  baseURL: "http://localhost:3000/api/",
});

export default config;
