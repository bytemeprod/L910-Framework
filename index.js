const Application = require('./framework/Application');

const PORT = 8080

const app = new Application();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})