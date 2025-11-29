import { getBook } from "./main.js";

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

    return;
    if (book.ilustrations && book.ilustrations.length > 0) {
        secondaryInfoContainer.innerHTML = `
            <h1 class="section-title">Ilustrações</h1>
            <div id="ilustrations-carousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators"></div>
                <div class="carousel-inner"></div>
                <button class="carousel-control-prev" type="button" data-bs-target="#ilustrations-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#ilustrations-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;

        const indicators = secondaryInfoContainer.querySelector(".carousel-indicators");
        const inner = secondaryInfoContainer.querySelector(".carousel-inner");

        book.ilustrations.forEach((img, index) => {
            const isActive = index === 0 ? "active" : "";
            const indicator = document.createElement("button");
            indicator.type = "button";
            indicator.setAttribute("data-bs-target", "#ilustrations-carousel");
            indicator.setAttribute("data-bs-slide-to", index);
            indicator.className = isActive;
            indicators.appendChild(indicator);

            const item = document.createElement("div");
            item.className = `carousel-item ${isActive}`;
            item.innerHTML = `
                <div class="img-box">
                    <img src="${img.url}" class="d-block" alt="${img.description}">
                </div>
                <div class="carousel-caption d-block">
                    <p>${img.description}</p>
                </div>`;
            inner.appendChild(item);
        });
    } else {
        secondaryInfoContainer.innerHTML += `<p>Nenhuma ilustração disponível.</p>`;
    }
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

function setupEditButton(book) {
    if (editBtn) {
        editBtn.href = `../views/book-form.html?id=${book.id}`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const book = await storeBookReference();

    renderBookDetails(book);
    renderCarousel(book);
    renderPizzaGraph(book);

    if (!book) return;

    setupEditButton(book);
    setupExcludeBtn(book);
});
