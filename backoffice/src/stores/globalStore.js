import { writable } from 'svelte/store';


/* local store */
const storeTheme = localStorage.getItem("theme");
const storedJWT = localStorage.getItem("70EA5CB5C98D1705ACC6692CEC1217E2");
//const storedUser = localStorage.getItem("user");
const storedRecordarUsuario = localStorage.getItem("RecordarUsuario");
const storeStrapi = localStorage.getItem("strapi");

const p_email = localStorage.getItem("p_email");
const p_password = localStorage.getItem("p_password");


// estado de loading
export const strapi_= writable(storeStrapi);
strapi_.subscribe(value => {
    localStorage.setItem("strapi", value);
});
export const theme = writable(storeTheme);
theme.subscribe(value => {
    localStorage.setItem("theme", value);
});
export const jwt_=writable(storedJWT)
jwt_.subscribe(value => {
    localStorage.setItem("70EA5CB5C98D1705ACC6692CEC1217E2", value);
});

export const recordarUsuario = writable(storedRecordarUsuario);
recordarUsuario.subscribe(value => {
    localStorage.setItem("RecordarUsuario", value);
});

export const p_email_ = writable(p_email);
p_email_.subscribe(value => {
    localStorage.setItem("p_email", value);
});

export const p_password_ = writable(p_password);
p_password_.subscribe(value => {
    localStorage.setItem("p_password", value);
});

export const paramsNotify= writable({text: "", position: "bottom-right",type: "",removeAfter: 6000,})

export const affidavit = writable(null);
