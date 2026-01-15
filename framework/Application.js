const http = require('http');

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
                this._prepareRequestResponse(req, res, body);

                let chain = [...this.middlewares]

                try {
                    const handler = this._selectHandler(req);
                    if(handler) {
                        chain.push(handler);
                    } else {
                        chain.push((req, res) => {
                            res.writeHead(404, {'Content-Type': 'text/plain'});
                            res.end('Not found');
                        });
                    }
                    this._runChain(req, res, chain, 0);
                } catch (err) {
                    this._handleError(res, err);
                }
            })
        })
    }

    _runChain(req, res, chain, index) {
        if(index === chain.length) {
            return;
        }

        const handler = chain[index];

        if(!handler) {
            return;
        }

        handler(req, res, () => {
            this._runChain(req, res, chain, index + 1);
        })
    }

    _prepareRequestResponse(req, res, body) {
        try {
            req.body = JSON.parse(body);
        } catch {
            req.body = {};
        }

        const protocol = req.protocol || 'http';
        const host = req.headers.host;
        const parsedUrl = new URL(req.url, `${protocol}://${host}`);

        req.pathname = parsedUrl.pathname;
        req.query = Object.fromEntries(parsedUrl.searchParams)

        res.status = (code) => {
            res.statusCode = code;
        }

        res.send = this._sendData(res);

        res.json = (data) => {
            res.send(data);
        }
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
                    const routeParts = routePath.split('/');
                    const pathParts = req.pathname.split('/');

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