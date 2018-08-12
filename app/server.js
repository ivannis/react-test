const { createServer } = require('http')
const next = require('next')
const routes = require('./config/routing')
const { reactIntlLocaleData, translationMessages, availableLocales } = require('./config/intl')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handler = routes.getRequestHandler(app, ({ req, res, route, query }) => {
    req.locales = availableLocales()
    req.localeDataScripts = reactIntlLocaleData()
    req.messages = translationMessages()

    app.render(req, res, route.page, query)
})

app.prepare()
    .then(() => {
        createServer(handler)
            .listen(port, (err) => {
                if (err) throw err
                console.log(`> Ready on http://localhost:${port}`)
            })
    })