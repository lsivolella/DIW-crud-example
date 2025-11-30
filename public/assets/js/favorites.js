import { books, getBooks } from "./main.js";
import { loadFavorites, toggleFavorite } from "../../services/favorites-service.js";
import { createBookCard } from "./components/book-card.js";

function renderCards() {
    const favoriteIds = loadFavorites();
    const grid = document.querySelector(".livros-grid");
    grid.innerHTML = "";

    const favoriteBooks = books.filter(book =>
        favoriteIds.includes(String(book.id))
    );

    if (favoriteBooks.length === 0) {
        grid.innerHTML = `<p class="text-center mt-4">Você ainda não tem livros favoritos.</p>`;
        return;
    }

    favoriteBooks.forEach(book => {
        grid.appendChild(createBookCard(book));
    });

    setupFavToggle(grid);
}

function setupFavToggle(grid) {
    grid.addEventListener("click", e => {
        const favBtn = e.target.closest(".favorite-btn");
        if (favBtn) {
            e.preventDefault();
            const id = favBtn.dataset.favid;
            toggleFavorite(id);

            location.reload();
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await getBooks();
    renderCards();
});
