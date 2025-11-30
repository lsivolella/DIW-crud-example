const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

const isLoggedIn = false;

if (isLoggedIn) {
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
} else {
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
}

logoutBtn.addEventListener("click", () => {
    alert("Logout placeholder");
});
