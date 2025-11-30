function getCurrentUser() {
    let user = null;
    try {
        user = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    } catch {}
    return user;
}

export function loadFavorites() {
    const user = getCurrentUser();
    if (!user) return [];

    const data = localStorage.getItem(`favorites_${user.login}`);
    return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
    const user = getCurrentUser();
    if (!user) return;

    localStorage.setItem(`favorites_${user.login}`, JSON.stringify(favs));
}

export function toggleFavorite(bookId) {
    let favs = loadFavorites();
    // console.log("Current favorites before toggle:", favs);
    if (favs.includes(bookId)) {
        favs = favs.filter(id => id !== bookId);
    } else {
        favs.push(bookId);
    }

    saveFavorites(favs);
}

export function isFavorite(bookId) {
    return loadFavorites().includes(bookId);
}
