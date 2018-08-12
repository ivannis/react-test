const { readFileSync } = require('fs')
const { basename } = require('path')
const glob = require('glob')

// Get the supported languages by looking for translations in the `translations/` dir.
const languages = glob.sync(__dirname + '/translations/*.json').map((f) => basename(f, '.json'))

// Get the react-intl locale data.
const localeDataCache = new Map()
const getLocaleDataScript = (locale) => {
    const lang = locale.split('_')[0]
    if (!localeDataCache.has(lang)) {
        const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
        const localeDataScript = readFileSync(localeDataFile, 'utf8')

        localeDataCache.set(lang, localeDataScript)
    }

    return localeDataCache.get(lang)
}

// Get the translations messages.
const getMessages = (locale) => {
    return require(`./translations/${locale}.json`)
}

const getReactIntlLocaleData = () => {
    const result = []
    languages.forEach(function(language) {
        result.push(getLocaleDataScript(language))
    });

    return result
}

const getTranslationMessages = () => {
    const result = {}
    languages.forEach(function(language) {
        result[language] = getMessages(language)
    });

    return result
}

const getAvailableLocales = () => {
    const result = []
    languages.forEach(function(language) {
        result.push(language.split('_')[0])
    });

    return result
}

module.exports = {
    reactIntlLocaleData: getReactIntlLocaleData,
    translationMessages: getTranslationMessages,
    availableLocales: getAvailableLocales
}