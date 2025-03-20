import Strapi from "strapi-sdk-js";

export function strapi() {
  return new Strapi({
    url: import.meta.env.VITE_API_HOST,
    prefix: "/api",
    store: {
      key: "70EA5CB5C98D1705ACC6692CEC1217E2",
      useLocalStorage: true,
      cookieOptions: { path: "/" },
    },
    axiosOptions: {},
  })
}