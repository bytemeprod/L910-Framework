const fs = require('fs').promises;
const path = require('path');

const DB_PATH = './src/db'

async function readDb(filename) {
    try {
        const filePath = path.join(DB_PATH, filename);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

async function writeDb(filename, data) {
    const filePath = path.join(DB_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {readDb, writeDb}