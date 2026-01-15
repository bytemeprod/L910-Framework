const { readDb, writeDb } = require('../utils/fileSystem');
const Validator = require('../utils/validator');

const MEDICINES_FILE = 'medicines.json'

class PharmacyController {
    async getAllMedicines(req, res) {
        const data = await readDb(MEDICINES_FILE);
        res.json(data.medicines || [])
    }

    async getMedicine(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(MEDICINES_FILE);

        const item = data.medicines.find(m => m.id === id);
        if (item) {
            res.json(item)
        } else {
            res.status(404);
            res.json({ error: 'Medicine not found' });
        }
    }

    async deleteMedicine(req, res) {
        const id = Validator.validateId(req.params.id);
        if (id == null) {
            res.status(400);
            return res.json({ error: 'Bad request'});
        }

        const data = await readDb(MEDICINES_FILE);
        const initialLength = data.medicines.length;

        data.medicines = data.medicines.filter(m => m.id !== id);
        if (data.medicines.length === initialLength) {
            res.status(404);
            return res.json({ error: 'Medicine not found' });
        }

        await writeDb(MEDICINES_FILE, data);

        res.status(204);
        res.send();
    }

    async createMedicine(req, res)  {
        try {
            const errors = Validator.validateMedicine(req.body);
            if(errors) {
                 res.status(400);
                 return res.json(errors);
            }

            const data = await readDb(MEDICINES_FILE);

            if (!data.medicines) {
                data.medicines = [];
                data.lastInsertId = 0;
            }

            data.lastInsertId++;

            const newMedicine = {
                id: data.lastInsertId,
                name: req.body.name,
                price: req.body.price,
                isPrescriptionRequired: req.body.isPrescriptionRequired,
                createdAt: new Date().toString(),
                categories: req.body.categories
            }

            data.medicines.push(newMedicine);

            await writeDb(MEDICINES_FILE, data);

            res.json(newMedicine)
        } catch (e) {
            res.status(500);
            res.json({ error: e.message });
        }
    }
}

module.exports = PharmacyController;