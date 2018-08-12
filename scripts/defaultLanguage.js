const {readFileSync, writeFileSync} = require('fs')
const {resolve} = require('path')
const glob = require('glob')

const defaultMessages = glob.sync(__dirname + '/../app/config/translations/.messages/**/*.json')
    .map((filename) => readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((messages, descriptors) => {
        descriptors.forEach(({id, defaultMessage}) => {
            if (messages.hasOwnProperty(id) && messages[id] !== defaultMessage) {
                throw new Error(`Duplicate message id: ${id} with a different default message.`)
            }

            messages[id] = defaultMessage
        })

        return messages
    }, {})


writeFileSync(__dirname + '/../app/config/translations/en_US.json', JSON.stringify(defaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve('../app/config/translations/en_US.json')}"`)