if (!window.usuarioCorrente) {
    try {
        window.usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    } catch (e) {
        window.usuarioCorrente = null;
    }
}

const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const adminLink = document.querySelector("#adminLink");

function updateNavbar() {
    const isLogged = usuarioCorrente && usuarioCorrente.login;

    if (isLogged) {
        loginBtn.classList.add("d-none");
        logoutBtn.classList.remove("d-none");

        if (adminLink) {
            if (usuarioCorrente.login === "admin") {
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
        window.location.reload();
    });
}

updateNavbar();
