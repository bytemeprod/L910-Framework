const http = require('http')

class Application {
    constructor() {
        this.server = this._createServer();
    }

    _createServer() {
        return http.createServer((req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8'
            });
            res.end(`Request url: ${req.url}`);
        })
    }

    listen(port, callback) {
        this.server.listen(port, callback)
    }
}

module.exports = Application;