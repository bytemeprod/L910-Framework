const { readDb, writeDb } = require('../utils/fileSystem');
const Validator = require('../utils/validator');

const EXPONATS_FILE = 'exponats.json'

class MuseumController {
    async getAllExponats(req, res) {
        const data = await readDb(EXPONATS_FILE);
        res.json(data.exponats || [])
    }

    async getExponat(req, res) {
        const id = Validator.validateExponatId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(EXPONATS_FILE);

        const item = data.exponats.find(e => e.id === id);
        if (item) {
            res.json(item)
        } else {
            res.status(404);
            res.json({ error: 'Exponat not found' });
        }
    }

    async deleteExponat(req, res) {
        const id = Validator.validateExponatId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(EXPONATS_FILE);
        const initialLength = data.exponats.length;

        data.exponats = data.exponats.filter(e => e.id !== id);
        if (data.exponats.length === initialLength) {
            res.status(404);
            return res.json({ error: 'Exponat not found' });
        }

        await writeDb(EXPONATS_FILE, data);

        res.status(204);
        res.send();
    }

    async createExponat(req, res)  {
        try {
            const errors = Validator.validateExponat(req.body);
            if(errors) {
                 res.status(400);
                 return res.json(errors);
            }

            const data = await readDb(EXPONATS_FILE);

            if (!data.exponats) {
                data.exponats = [];
                data.lastInsertId = 0;
            }

            data.lastInsertId++;

            const newExponat = {
                id: data.lastInsertId,
                name: req.body.name,
                year: req.body.year,
                isOriginal: req.body.isOriginal,
                createdAt: new Date().toString(),
                tags: req.body.tags
            }

            data.exponats.push(newExponat);

            await writeDb(EXPONATS_FILE, data);

            res.json(newExponat)
        } catch (e) {
            res.status(500);
            res.json({ error: e.message });
        }
    }
}

module.exports = MuseumController;