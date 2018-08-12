import React from 'react'
import { connect } from "react-redux";
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl'
import App from "../../application";

const selectors = App.selectors.locale;
const mapStateToProps = (state) => ({
    locale: selectors.current(state),
});
const mapDispatchToProps = () => ({});

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
    Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
        addLocaleData(window.ReactIntlLocaleData[lang])
    })
}

export default (Component) => {
    const IntlComponent = injectIntl(Component)

    class WithIntl extends React.Component {
        static async getInitialProps (context) {
            // Evaluate the composed component's getInitialProps()
            let composedInitialProps = {}
            if (typeof Component.getInitialProps === 'function') {
                composedInitialProps = await Component.getInitialProps(context)
            }

            // Get the `locale` and `messages` from the request object on the server.
            // In the browser, use the same values that the server serialized.
            const { req } = context
            let { messages } = req || window.__NEXT_DATA__.props.initialProps
            if (messages === undefined) {
                messages = {}
            }

            // Always update the current time on page load/transition because the
            // <IntlProvider> will be a new instance even with pushState routing.
            const now = Date.now()

            return { ...composedInitialProps, messages, now }
        }

        render () {
            const { locale, messages, now, ...props } = this.props
            const lang = locale.code.split('_')[0]

            return (
                <IntlProvider locale={lang} key={lang} messages={ messages[locale.code] || {} } initialNow={now}>
                    <IntlComponent {...props} />
                </IntlProvider>
            )
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(WithIntl)
}