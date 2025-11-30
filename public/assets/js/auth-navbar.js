import { isAdmin, isLoggedIn, getCurrentUser } from "../../services/auth-service.js";

const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const adminLink = document.querySelector("#adminLink");

function updateNavbar() {
    const userIsLogged = isLoggedIn();
    const userIsAdmin = isAdmin();

    if (userIsLogged) {
        loginBtn.classList.add("d-none");
        logoutBtn.classList.remove("d-none");

        if (adminLink) {
            if (userIsAdmin) {
                adminLink.classList.remove("d-none");
            } else {
                adminLink.classList.add("d-none");
            }
        }
    } else {
        loginBtn.classList.remove("d-none");
        logoutBtn.classList.add("d-none");

        if (adminLink) adminLink.classList.add("d-none");
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logoutUser();
    });
}

updateNavbar();
