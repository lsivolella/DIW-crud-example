// import { create } from "json-server";
import { getBook, saveBook } from "../main.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const isEdit = id !== null;

const sectionTitle = document.querySelector("#section-title");

const bookForm = document.querySelector("#book-form");
const titleInput = document.querySelector("#title-input");
const subtitleInput = document.querySelector("#subtitle-input");
const authorInput = document.querySelector("#author-input");
const yearInput = document.querySelector("#year-input");
const pagesInput = document.querySelector("#pages-input");
const coverImageInput = document.querySelector("#coverImage-input");
const coverColorInput = document.querySelector("#coverColor-input");
const descriptionTextarea = document.querySelector("#description-textarea");
const povList = document.querySelector("#pov-list");

const addPovBtn = document.querySelector("#addPov-btn");

function fillForm(book) {
    titleInput.value = book.title;
    subtitleInput.value = book.subtitle;
    authorInput.value = book.author;
    yearInput.value = book.year;
    pagesInput.value = book.pages;
    coverImageInput.value = book.coverImage;
    coverColorInput.value = book.coverColor  || "#000000";
    descriptionTextarea.value = book.description;

    if (povList && book.pov && Array.isArray(book.pov)) {
        povList.innerHTML = "";
        book.pov.forEach(pov => {
            createPovInput(pov.character, pov.chapters);
        });
    }
}

function createPovInput(character = "", chapters = "") {
    let div = document.createElement("div");
    div.className = "row g-2 align-items-center mb-2";

    div.innerHTML = `
        <div class="col-md-6">
            <input type="text" class="form-control" id="povCharacter-input" placeholder="Personagem" value="${character}">
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control" id="povChapters-input" placeholder="Capítulos" min="0" value="${chapters}">
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-danger w-100" id="removePov-btn">Remover</button>
        </div>
      `;
    div.querySelector("#removePov-btn").addEventListener("click", () => {
        div.remove();
    });

    povList.appendChild(div);
}

addPovBtn.addEventListener("click", () => {
    createPovInput();
});

bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const povInputs = povList.querySelectorAll(".row");
    const povArray = Array.from(povInputs).map(row => {
        const character = row.querySelector(".characterPov-input").value;
        const chapters = parseInt(row.querySelector(".pov-capitulos").value) || 0;
        return { character, chapters };
    });
});

window.addEventListener("DOMContentLoaded", async () => {
    if (isEdit) {
        if (sectionTitle) {
            sectionTitle.textContent = "Editar Livro";
        }
        const book = await getBook(id);
        if (book) {
            fillForm(book);
        }
        else {
            prompt("Livro não encontrado!");
        }
    }
});