const Application = require("./framework/Application");
const MuseumController = require("./src/controllers/MuseumController");
const LibraryController = require("./src/controllers/LibraryController");
const CinemaController = require('./src/controllers/CinemaPosterController');
const ArmyController = require('./src/controllers/ArmyController');

const PORT = 8080;

const app = new Application();

const museumController = new MuseumController();
const armyController = new ArmyController();

app.get("/museum/exponats", museumController.getAllExponats);
app.get("/museum/exponats/:id", museumController.getExponat);
app.post("/museum/exponats", museumController.createExponat);
app.delete("/museum/exponats/:id", museumController.deleteExponat);

const PharmacyController = require("./src/controllers/PharmacyController");

const pharmacyController = new PharmacyController();

app.get("/pharmacy/medicines", pharmacyController.getAllMedicines);
app.get("/pharmacy/medicines/:id", pharmacyController.getMedicine);
app.post("/pharmacy/medicines", pharmacyController.createMedicine);
app.delete("/pharmacy/medicines/:id", pharmacyController.deleteMedicine);

const libraryController = new LibraryController();

app.get("/library/books", libraryController.getAllBooks);
app.get("/library/books/:id", libraryController.getBook);
app.post("/library/books", libraryController.createBook);
app.delete("/library/books/:id", libraryController.deleteBook);

const cinemaController = new CinemaController();

app.get('/cinema/posters', cinemaController.getAllPosters);
app.get('/cinema/posters/:id', cinemaController.getPoster);
app.post('/cinema/posters', cinemaController.createPoster);
app.delete('/cinema/posters/:id', cinemaController.deletePoster);

app.get('/army/soliders', armyController.getAllSoldiers);
app.get('/army/soliders/:id', armyController.getSoldier);
app.post('/army/soliders', armyController.createSoldier);
app.delete('/army/soliders/:id', armyController.deleteSoldier);

app.use(loggerMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function loggerMiddleware(req, res, next) {
  console.log("New request:", req.method, req.pathname);
  next();
}
