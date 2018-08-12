import Document, {Head, Main, NextScript} from 'next/document'

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
    static async getInitialProps (context) {
        const props = await super.getInitialProps(context)
        const { req: { locales, localeDataScripts } } = context

        const features = [];
        const scripts = localeDataScripts || []

        if (locales !== undefined) {
            locales.forEach(function(locale){
                features.push('Intl.~locale.' + locale)
            })
        }

        return {
            ...props,
            features,
            scripts
        }
    }

    render () {
        // Polyfill Intl API for older browsers
        const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=${this.props.features.join(',')}`

        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="/_next/static/style.css" />
                </Head>
                <body>
                    <Main />
                    <script src={polyfill} />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: this.props.scripts.join(';')
                        }}
                    />
                    <NextScript />
                </body>
            </html>
        )
    }
}