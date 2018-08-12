const nextRoutes = require('next-routes')
const routes = module.exports = nextRoutes()

routes
    .add('home', '/', 'index')
    .add('repository', '/repository/:name', 'repository')
;

