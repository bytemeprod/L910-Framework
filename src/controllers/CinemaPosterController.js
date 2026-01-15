const { readDb, writeDb } = require('../utils/fileSystem');
const Validator = require('../utils/validator');

const POSTERS_FILE = 'cinema_posters.json'

class CinemaPosterController {
    async getAllPosters(req, res) {
        const data = await readDb(POSTERS_FILE);
        res.json(data.posters || [])
    }

    async getPoster(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(POSTERS_FILE);

        const item = data.posters.find(p => p.id === id);
        if (item) {
            res.json(item)
        } else {
            res.status(404);
            res.json({ error: 'Poster not found' });
        }
    }

    async deletePoster(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(POSTERS_FILE);
        const initialLength = data.posters.length;

        data.posters = data.posters.filter(p => p.id !== id);
        if (data.posters.length === initialLength) {
            res.status(404);
            return res.json({ error: 'Poster not found' });
        }

        await writeDb(POSTERS_FILE, data);

        res.status(204);
        res.send();
    }

    async createPoster(req, res)  {
        try {
            const errors = Validator.validatePoster(req.body);
            if(errors) {
                 res.status(400);
                 return res.json(errors);
            }

            const data = await readDb(POSTERS_FILE);

            if (!data.posters) {
                data.posters = [];
                data.lastInsertId = 0;
            }

            data.lastInsertId++;

            const newPoster = {
                id: data.lastInsertId,
                title: req.body.title,
                releaseYear: req.body.releaseYear,
                isPremiere: req.body.isPremiere,
                createdAt: new Date().toString(),
                genres: req.body.genres
            }

            data.posters.push(newPoster);

            await writeDb(POSTERS_FILE, data);

            res.json(newPoster)
        } catch (e) {
            res.status(500);
            res.json({ error: e.message });
        }
    }
}

module.exports = CinemaPosterController;