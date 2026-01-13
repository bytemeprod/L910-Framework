const http = require('http');
const { url } = require('inspector');

class Application {
    constructor() {
        this.server = this._createServer();
        this.endpoints = {}
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = "";

            req.on('data', (chunk) => {
                body += chunk;
            })

            req.on('end', () => {
                try {
                    req.body = JSON.parse(body);
                } catch {
                    req.body = {}
                }

                const protocol = req.protocol || 'http';
                const host = req.headers.host;
                const parsedUrl = new URL(req.url, `${protocol}://${host}`);

                req.pathname = parsedUrl.pathname;
                req.query = Object.fromEntries(parsedUrl.searchParams)

                res.json = (data) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                }

                const routes = this.endpoints[req.method];

                const handler = routes ? routes[req.pathname] : null;

                if(handler) {
                    handler(req, res);
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plan'});
                    res.end('Not found')
                }
            })
        })
    }

    _addRoute(method, path, handler) {
        if(!this.endpoints[method]) {
            this.endpoints[method] = {};
        }
        this.endpoints[method][path] = handler;
    }

    get(path, handler) {
        this._addRoute('GET', path, handler);
    }

    post(path, handler) {
        this._addRoute('POST', path, handler);
    }

    put(path, handler) {
        this._addRoute('PUT', path, handler);
    }

    patch(path, handler) {
        this._addRoute('PATCH', path, handler);
    }

    delete(path, handler) {
        this._addRoute('DELETE', path, handler);
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }
}

module.exports = Application;