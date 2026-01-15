const { readDb, writeDb } = require('../utils/fileSystem');
const Validator = require('../utils/validator');

const BOOKS_FILE = 'books.json'

class LibraryController {
    async getAllBooks(req, res) {
        const data = await readDb(BOOKS_FILE);
        res.json(data.books || [])
    }

    async getBook(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(BOOKS_FILE);

        const item = data.books.find(b => b.id === id);
        if (item) {
            res.json(item)
        } else {
            res.status(404);
            res.json({ error: 'Book not found' });
        }
    }

    async deleteBook(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(BOOKS_FILE);
        const initialLength = data.books.length;

        data.books = data.books.filter(b => b.id !== id);
        if (data.books.length === initialLength) {
            res.status(404);
            return res.json({ error: 'Book not found' });
        }

        await writeDb(BOOKS_FILE, data);

        res.status(204);
        res.send();
    }

    async createBook(req, res)  {
        try {
            const errors = Validator.validateBook(req.body);
            if(errors) {
                 res.status(400);
                 return res.json(errors);
            }

            const data = await readDb(BOOKS_FILE);

            if (!data.books) {
                data.books = [];
                data.lastInsertId = 0;
            }

            data.lastInsertId++;

            const newBook = {
                id: data.lastInsertId,
                title: req.body.title,
                author: req.body.author,
                year: req.body.year,
                isAvailable: req.body.isAvailable,
                createdAt: new Date().toString(),
                genres: req.body.genres
            }

            data.books.push(newBook);

            await writeDb(BOOKS_FILE, data);

            res.json(newBook)
        } catch (e) {
            res.status(500);
            res.json({ error: e.message });
        }
    }
}

module.exports = LibraryController;