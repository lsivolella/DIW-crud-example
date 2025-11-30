import { getBook } from "./main.js";
import { isFavorite, toggleFavorite } from "./favorites.js";

const bookInfoContainer = document.querySelector("#bookInfo-container");
const carouselSlide = document.querySelector(".carousel");
const carouselIndicators = document.querySelector(".carousel-indicators");
const carouselInner = document.querySelector(".carousel-inner");
const pizzaGraph = document.querySelector('#pizzaGraph');

const editBtn = document.querySelector("#edit-btn");
const excludeBtn = document.querySelector("#exclude-btn");

async function storeBookReference() {
    const params = new URLSearchParams(window.location.search);
    const bookId = Number(params.get("id"));
    return await getBook(bookId);
}

function renderBookDetails(book) {
    if (!bookInfoContainer) return;

    if (!book) {
        bookInfoContainer.innerHTML = "<p>Livro não encontrado.</p>";
        return;
    }

    bookInfoContainer.innerHTML = `
        <div class="col-12 col-lg-auto">
            <img src="${book.coverImage}" alt="${book.title}" class="img-fluid" style="max-width: 250px;">
        </div>
        <div class="col-12 col-lg">
            <h1>${book.title}</h1>
            <p><strong>Subtítulo:</strong> ${book.subtitle}</p>
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Descrição:</strong> ${book.description}</p>
            <p><strong>Ano:</strong> ${book.year}</p>
            <p><strong>Páginas:</strong> ${book.pages}</p>
            <div class="mt-3">
                <button id="favorite-details-btn" class="btn btn-link p-0">
                    <i class="heart-icon bi ${isFavorite(Number(book.id)) ? "bi-heart-fill text-danger" : "bi-heart"} fs-2"></i>
                </button>
            </div>
        </div>
    `;

    document.querySelector("#btn-excluir")?.addEventListener("click", async () => {
        if (confirm("Deseja realmente excluir este livro?")) {
            await fetch(`http://localhost:3000/books/${book.id}`, { method: "DELETE" });
            alert("Livro excluído com sucesso!");
            window.location.href = "/index.html";
        }
    });
}

function renderCarousel(book) {
    if (!book || !carouselSlide || !carouselIndicators || !carouselInner) return;

    const ilustrations = book.ilustrations;

    if (!ilustrations || ilustrations.length === 0) return;

    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";

    ilustrations.forEach((img, index) => {
        const isActive = index === 0 ? "active" : "";

        renderCarouselIndicators(index, isActive);
        renderCarouselItems(img, isActive);
    });
}

function renderCarouselIndicators(index, isActive) {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
    indicator.setAttribute("data-bs-slide-to", index);
    indicator.setAttribute("aria-label", `Slide ${index + 1}`);
    if (isActive) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-current", "true");
    }
    carouselIndicators.appendChild(indicator);
}

function renderCarouselItems(img, isActive) {
    const item = document.createElement("div");
    item.className = `carousel-item ${isActive}`;
    item.innerHTML = `
        <div class="img-box">
            <img src="${img.url}" class="d-block" alt="${img.description}">
        </div>
        <div class="carousel-caption d-block">
            <p>${img.description}</p>
        </div>
    `;
    carouselInner.appendChild(item);
}

function renderPizzaGraph(book) {
    if (!pizzaGraph) return;

    let categories = book.pov.map(p => p.character);
    let valuesPerCategory = book.pov.map(p => p.chapters);
    let colors = [
        "#134074", "#0B2545", "#8DA9C4", "#EEF4ED", "#3D5A80",
        "#98C1D9", "#E0FBFC", "#293241", "#EE6C4D", "#9A031E"
    ].slice(0, categories.length);

    const divPieChart = new Chart(pizzaGraph, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: valuesPerCategory,
                backgroundColor: colors,
                borderColor: "#fff",
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#333",
                        font: { size: 14 }
                    }
                },
                datalabels: {
                    color: "#fff",
                    formatter: value => value,
                    font: { weight: "bold", size: 14 }
                }
            }
        }
    });
}

function setupFavoriteButton(book) {
    const favoriteBtn = document.querySelector("#favorite-details-btn");

    if (favoriteBtn) {
        favoriteBtn.addEventListener("click", () => {
            const id = Number(book.id);
            toggleFavorite(id);
            
            const icon = favoriteBtn.querySelector("i");
            icon.className = `heart-icon bi ${isFavorite(id) ? "bi-heart-fill text-danger" : "bi-heart"} fs-2`;
        });
    }
}

function setupEditButton(book) {
    if (editBtn) {
        editBtn.href = `../views/book-form.html?id=${book.id}`;
    }
}

function setupExcludeBtn(book) {
    if (excludeBtn) {
        btnExcluir.addEventListener("click", async () => {
            if (confirm("Deseja realmente excluir este livro?")) {
                await fetch(`http://localhost:3001/books/${book.id}`, { method: "DELETE" });
                alert("Livro excluído com sucesso!");
                window.location.href = "/index.html";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const book = await storeBookReference();

    renderBookDetails(book);
    renderCarousel(book);
    renderPizzaGraph(book);

    if (!book) return;

    setupFavoriteButton(book);
    setupEditButton(book);
    setupExcludeBtn(book);
});
