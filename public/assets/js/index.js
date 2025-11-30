import { books, getBooks, deleteBook } from "./main.js";
import { isFavorite, toggleFavorite } from "./favorites.js";

const detailsBaseUrl = "/views/details.html?id=";

const carouselSlide = document.querySelector(".carousel");
const carouselIndicators = document.querySelector(".carousel-indicators");
const carouselInner = document.querySelector(".carousel-inner");
const cardsGrid = document.querySelector(".livros-grid");
const barsGraph = document.getElementById('bars-graph');

async function loadDataAndRenderPage() {
    await getBooks();
    renderCarousel();
    renderCards();
    renderBarsGraph();
}

function renderCarousel() {
    if (!carouselSlide || !carouselIndicators || !carouselInner) return;

    let sortedBooks = [...books].sort(() => 0.5 - Math.random()).slice(0, 3);

    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";

    sortedBooks.forEach((book, index) => {
        const isActive = index === 0 ? "active" : "";

        renderCarouselIndicators(index, isActive);
        renderCarouselItems(book, isActive);
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

function renderCarouselItems(book, isActive) {
    const detailsUrl = `${detailsBaseUrl}${book.id}`;
    const item = document.createElement("div");
    item.className = `carousel-item ${isActive}`;
    item.innerHTML = `
    <a href="${detailsUrl}">
        <img src="${book.coverImage}" class="carousel-img d-block w-100" alt="${book.title}">
        <div class="carousel-caption d-block">
        <h5>${book.title}</h5>
        <p>${book.author}</p>
        </div>
    </a>
    `;
    carouselInner.appendChild(item);
}

function renderCards() {
    if (!cardsGrid) return;

    cardsGrid.innerHTML = '';

    books.forEach(book => {
        const detailsUrl = `${detailsBaseUrl}${book.id}`;
        const col = document.createElement('div');
        col.className = "col";

        col.innerHTML = `
        <div class="card h-100 book-card" data-id="${book.id}">
            <a href="${detailsUrl}">
                <img src="${book.coverImage}" class="card-img-top" alt="${book.title}">

                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">${book.author}</p>
                    <p class="card-text">Ano: ${book.year}</p>
                    <p class="card-text">Páginas: ${book.pages}</p>

                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <button class="btn btn-link p-0 favorite-btn" data-favid="${book.id}">
                            <i class="heart-icon bi ${isFavorite(Number(book.id)) ? 'bi-heart-fill text-danger' : 'bi-heart'} fs-2"></i>
                        </button>

                        <div>
                            <a href="/views/book-form.html?id=${book.id}" class="btn btn-warning me-2">Editar</a>
                            <button class="btn btn-danger delete-btn" data-id="${book.id}">Excluir</button>
                        </div>

                    </div>
                </div>
            </a>
        </div>`;
        cardsGrid.appendChild(col);
    });
}

function renderBarsGraph() {
    if (!barsGraph) return;

    new Chart(barsGraph, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: books.map(book => book.title),
            datasets: [{
                label: "Número de Páginas",
                data: books.map(book => book.pages),
                backgroundColor: books.map(book => book.coverColor || 'rgba(54, 162, 235, 0.2)'),
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: false },
                datalabels: {
                    color: "#000",
                    anchor: "end",
                    align: "end",
                    font: {
                        weight: "bold",
                        size: 14
                    },
                    formatter: (value) => `${value}`
                }
            },
            scales: {
                y: {
                    display: false,
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: "#333", font: { size: 14 } }
                }
            }
        }
    });
}

cardsGrid.addEventListener("click", async (event) => {
    const card = event.target.closest(".book-card");
    const bookId = card ? card.dataset.id : null;

    if (!bookId) return;

    const favButton = event.target.closest(".favorite-btn");
    if (favButton) {
        event.preventDefault();
        const id = Number(favButton.dataset.favid);
        toggleFavorite(id);
        renderCards();
        return;
    }

    if (event.target.matches(".btn-warning")) {
        event.preventDefault();
        window.location.href = `/assets/views/book-form.html?id=${bookId}`;
    }

    if (event.target.matches(".btn-danger")) {
        event.preventDefault();
        if (confirm("Deseja realmente excluir este livro?")) {
            await fetch(`http://localhost:3000/books/${bookId}`, { method: "DELETE" });
            alert("Livro excluído com sucesso!");
            await loadDataAndRenderPage();
        }
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await loadDataAndRenderPage();
});