import { books, getBooks } from "./main.js";
import { toggleFavorite } from "../../services/favorites-service.js";
import { createBookCard } from "./components/book-card.js";

const detailsBaseUrl = "/views/details.html?id=";

const carouselSlide = document.querySelector(".carousel");
const carouselIndicators = document.querySelector(".carousel-indicators");
const carouselInner = document.querySelector(".carousel-inner");
const searchInput = document.getElementById("searchInput");
const cardsGrid = document.querySelector(".livros-grid");
const barsGraph = document.getElementById('bars-graph');

let filteredBooks = [];

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

    const booksToRender = filteredBooks.length > 0 ? filteredBooks : books;

    booksToRender.forEach(book => {
        const card = createBookCard(book);
        cardsGrid.appendChild(card);
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

if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.trim().toLowerCase();

        if (query === "") {
            filteredBooks = [];
        } else {
            filteredBooks = books.filter(book => {
                return (
                    book.title.toLowerCase().includes(query) ||
                    (book.subtitle && book.subtitle.toLowerCase().includes(query)) ||
                    (book.description && book.description.toLowerCase().includes(query))
                );
            });
        }

        renderCards();
    });
}

if (cardsGrid) {
    cardsGrid.addEventListener("click", async (event) => {
        const card = event.target.closest(".book-card");
        const bookId = card ? card.dataset.id : null;

        if (!bookId) return;

        const favButton = event.target.closest(".favorite-btn");
        if (favButton) {
            event.preventDefault();
            const id = favButton.dataset.favid;
            toggleFavorite(id);
            renderCards();
            return;
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadDataAndRenderPage();
});