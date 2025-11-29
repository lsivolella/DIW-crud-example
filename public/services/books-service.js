const API_URL = "http://localhost:3000/books";

export class BooksService {

    async getBooks(){
        const response = await fetch(API_URL);
        return response.json();
    }

    async getBook(id) {
        const response = await fetch(`${API_URL}/${id}`);
        return response.json();
    }

    async createBook(livro) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        return response.json();
    }

    async updateBook(id, livro) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        return response.json();
    }

    async deleteBook(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
}