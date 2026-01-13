const http = require('http');
const { url } = require('inspector');

class Application {
    constructor() {
        this.server = this._createServer();
        this.endpoints = {};
        this.middlewares = [];
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
                    req.body = {};
                }

                this._setupQuery(req)

                res.status = (code) => {
                    res.statusCode = code;
                }

                res.send = this._sendData(res);

                res.json = (data) => {
                    res.send(data);
                }

                const runMiddlewares = (index) => {
                    if(index === this.middlewares.length) {
                        return;
                    }

                    const middleware = this.middlewares[index];

                    if(!middleware) {
                        return;
                    }

                    middleware(req, res, () => {
                        runMiddlewares(index + 1);
                    })
                }

                try {
                    runMiddlewares(0);
                } catch (err) {
                    this._handleError(res, err);
                }

                const handler = this._selectHandler(req);

                if(handler) {
                    try {
                        handler(req, res);
                    } catch (err) {
                        this._handleError(res, err);
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plan'});
                    res.end('Not found');
                }
            })
        })
    }

    _handleError(res, err) {
        console.error("Error:", err);
        res.status(500);
        res.json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }

    _sendData(res) {
        return (data) => {
            if(typeof data === 'object') {
                res.writeHead(res.statusCode || 200, { 
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(data));
            } else {
                res.writeHead(res.statusCode || 200, {
                    'Content-Type': 'text/plain; charset=utf8'
                })
                res.end(data);
            }
        }
    }

    _setupQuery(req) {
        const protocol = req.protocol || 'http';
        const host = req.headers.host;
        const parsedUrl = new URL(req.url, `${protocol}://${host}`);

        req.pathname = parsedUrl.pathname;
        req.query = Object.fromEntries(parsedUrl.searchParams)
    }

    _selectHandler(req) {
        const routes = this.endpoints[req.method];

        let handler = null;

        if(routes) {
            const paths = Object.keys(routes);
            paths.sort((a,b) => b.length - a.length);

            for(const routePath of paths) {
                if(routePath === req.pathname) {
                    handler = routes[routePath];
                    break;
                }
                
                if(routePath.endsWith('/') && routePath !== '/') {
                    if(req.pathname.startsWith(routePath)) {
                        handler = routes[routePath];
                        break;
                    }

                    if(routePath.slice(0, -1) === req.pathname) {
                        handler = routes[routePath];
                        break;
                    }
                }

                if(routePath.includes(':')) {
                    const routeParts = routePath.split('/')
                    const pathParts = req.pathname.split('/')

                    if(routeParts.length === pathParts.length) {
                        let isMatch = true;
                        const tempParams = {};

                        for(let i = 0; i < routeParts.length; i++) {
                            if(routeParts[i].startsWith(':')) {
                                tempParams[routeParts[i].slice(1)] = pathParts[i];
                            } else if (routeParts[i] !== pathParts[i]) {
                                isMatch = false;
                                break;
                            }
                        }

                        if(isMatch) {
                            handler = routes[routePath]
                            req.params = tempParams;
                            break;
                        }
                    }
                }

                if(routePath === '/' ) {
                    handler = routes['/'];
                    break;
                }
            }
        }

        return handler
    }

    _addRoute(method, path, handler) {
        if(!this.endpoints[method]) {
            this.endpoints[method] = {};
        }
        this.endpoints[method][path] = handler;
    }

    use(middleware) {
        this.middlewares.push(middleware);
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