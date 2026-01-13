const Application = require('./framework/Application');

const PORT = 8080

const app = new Application();

app.use(loggerMiddleware);

app.get("/users/", (req, res) => {
    res.json({name: "User"})
})

app.get("/", (req, res) => {
    res.send("HOME PAGE")
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

function loggerMiddleware(req, res, callback) {
    console.log("New request:", req.method, req.pathname);
    callback();
}