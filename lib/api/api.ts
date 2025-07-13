import axios from "axios";

// export const nextServer = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
//   withCredentials: true,
// });

// export const nextServer = axios.create({
//   baseURL: "https://notehub-api.goit.study",
//   withCredentials: true,
// });
// export const nextServer = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// export const nextServer = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true,
// });

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const nextServer = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});
