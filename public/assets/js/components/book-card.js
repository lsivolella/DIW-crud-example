import { isFavorite } from "../../../services/favorites-service.js";
import { isAdmin } from "../../../services/auth-service.js";

export function createBookCard(book) {
    const detailsUrl = `/views/details.html?id=${book.id}`;
    const editUrl = `/views/book-form.html?id=${book.id}`;

    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
    <div class="card h-100 book-card" data-id="${book.id}">
    
        <a href="${detailsUrl}">
            <img src="${book.coverImage}" class="card-img-top" alt="${book.title}">
        </a>

        <div class="card-body">

            <a href="${detailsUrl}" class="text-decoration-none text-dark">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.author}</p>
                <p class="card-text">Ano: ${book.year}</p>
                <p class="card-text">Páginas: ${book.pages}</p>
            </a>

            <div class="d-flex justify-content-between align-items-center mt-3">

                <button class="btn btn-link p-0 favorite-btn" data-favid="${book.id}">
                    <i class="heart-icon bi ${isFavorite(Number(book.id)) ? "bi-heart-fill text-danger" : "bi-heart"} fs-2"></i>
                </button>

                <div>
                    ${isAdmin() ? `
                        <a href="/views/book-form.html?id=${book.id}" class="btn btn-warning me-2">Editar</a>
                        <button class="btn btn-danger delete-btn" data-id="${book.id}">Excluir</button>
                    ` : ""}
                </div>

            </div>

        </div>

    </div>`;

    setTimeout(() => {
        const deleteBtn = col.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                if (confirm("Deseja realmente excluir este livro?")) {
                    await fetch(`http://localhost:3000/books/${book.id}`, { method: "DELETE" });
                    alert("Livro excluído com sucesso!");
                    window.location.reload();
                }
            });
        }
    }, 0);

    return col;
}
