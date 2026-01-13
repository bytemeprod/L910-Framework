const Application = require('./framework/Application');

const PORT = 8080

const app = new Application();

app.get("/home", (req, res) => {
    console.log("Параметры: ", req.query);
    res.json({
        "body": req.body,
        "query": req.query,
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})