const { readDb, writeDb } = require('../utils/fileSystem');
const Validator = require('../utils/validator');

const SOLDIERS_FILE = 'soldiers.json'

class ArmyController {
    async getAllSoldiers(req, res) {
        const data = await readDb(SOLDIERS_FILE);
        res.json(data.soldiers || [])
    }

    async getSoldier(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(SOLDIERS_FILE);

        const item = data.soldiers.find(s => s.id === id);
        if (item) {
            res.json(item)
        } else {
            res.status(404);
            res.json({ error: 'Soldier not found' });
        }
    }

    async deleteSoldier(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(SOLDIERS_FILE);
        const initialLength = data.soldiers.length;

        data.soldiers = data.soldiers.filter(s => s.id !== id);
        if (data.soldiers.length === initialLength) {
            res.status(404);
            return res.json({ error: 'Soldier not found' });
        }

        await writeDb(SOLDIERS_FILE, data);

        res.status(204);
        res.send();
    }

    async createSoldier(req, res)  {
        try {
            const errors = Validator.validateSoldier(req.body);
            if(errors) {
                 res.status(400);
                 return res.json(errors);
            }

            const data = await readDb(SOLDIERS_FILE);

            if (!data.soldiers) {
                data.soldiers = [];
                data.lastInsertId = 0;
            }

            data.lastInsertId++;

            const newSoldier = {
                id: data.lastInsertId,
                name: req.body.name,
                rank: req.body.rank,
                isActive: req.body.isActive,
                createdAt: new Date().toString(),
                skills: req.body.skills
            }

            data.soldiers.push(newSoldier);

            await writeDb(SOLDIERS_FILE, data);

            res.json(newSoldier)
        } catch (e) {
            res.status(500);
            res.json({ error: e.message });
        }
    }
}

module.exports = ArmyController;