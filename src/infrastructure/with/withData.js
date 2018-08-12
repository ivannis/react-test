import React from 'react'
import initApollo from "../apollo";
import { sagaMiddleware } from "../store";
import CookieStorage from "../storage/cookie";

export default (Component) => {
    return class WithData extends React.Component {
        static async getInitialProps(context) {
            let serverState = {}
            const cookie = new CookieStorage(context.req);
            context.cookie = cookie;

            // Setup a server-side one-time-use apollo client for initial props and
            // rendering (on server)
            let apollo = initApollo({}, {
                context: context,
                cookie: cookie
            })

            sagaMiddleware.setContext({
                client: apollo,
                cookie: cookie,
                router: {
                    context: context
                }
            })

            // Evaluate the composed component's getInitialProps()
            let composedInitialProps = {}
            if (typeof Component.getInitialProps === 'function') {
                composedInitialProps = await Component.getInitialProps(context)
            }

            // Run all graphql queries in the component tree
            // and extract the resulting data
            if (!process.browser) {
                // run the startUp sage
                context.store.runStartUpSagaTask({ })

                if (context.res && context.res.finished) {
                    // When redirecting, the response is finished.
                    // No point in continuing to render
                    return
                }

                // Extract query data from the Apollo's store
                serverState = apollo.cache.extract()
            }

            return {
                serverState,
                ...composedInitialProps
            }
        }

        constructor(props) {
            super(props)
            const cookie = new CookieStorage();

            // Note: Apollo should never be used on the server side beyond the initial
            // render within `getInitialProps()` above (since the entire prop tree
            // will be initialized there), meaning the below will only ever be
            // executed on the client.
            const apollo = initApollo(this.props.serverState, {
                cookie: cookie
            })

            sagaMiddleware.setContext({
                client: apollo,
                cookie: cookie,
                router: {
                    context: {}
                }
            })
        }

        render() {
            return (
                <Component {...this.props} />
            )
        }
    }
}