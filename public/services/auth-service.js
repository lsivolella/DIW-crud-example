export function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem("usuarioCorrente")) || null;
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    const user = getCurrentUser();
    return user && user.login;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.login === "admin";
}
