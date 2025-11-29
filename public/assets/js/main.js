import { BooksService } from "../../services/books-service.js";

const booksService = new BooksService();

export let books = [];

export async function getBooks() {
    books = await booksService.getBooks();
}

export async function deleteBook(id) {
    await booksService.deleteBook(id);
    books = await booksService.getBooks();
}

export async function getBook(id) {
    return booksService.getBook(id);
}

export async function saveBook(id, data) {
    if (id) return booksService.updateBook(id, data);
    else return booksService.createBook(data);
}