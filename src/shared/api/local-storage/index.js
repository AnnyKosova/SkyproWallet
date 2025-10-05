export const getUserFromLocalStorage = () => {
    const user = window.localStorage.getItem("user");
    if(user) return JSON.parse(user);
    return null;
};


export const getAuthUserToken = () => {
    const token = window.localStorage.getItem("token");
    if(token) return token;
    return null;
};