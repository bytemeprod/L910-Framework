const Application = require('./framework/Application');
const MuseumController = require('./src/controllers/MuseumController');

const PORT = 8080

const app = new Application();

const museumController = new MuseumController();

app.get('/museum/exponats', museumController.getAllExponats);
app.get('/museum/exponats/:id', museumController.getExponat);
app.post('/museum/exponats', museumController.createExponat);
app.delete('/museum/exponats/:id', museumController.deleteExponat);

app.use(loggerMiddleware);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

function loggerMiddleware(req, res, next) {
    console.log("New request:", req.method, req.pathname);
    next();
}