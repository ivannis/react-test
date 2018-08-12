import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http'
import { RestLink } from 'apollo-link-rest';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'

let apolloClient = null
// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
    global.fetch = fetch
    global.Headers = global.Headers || require("fetch-headers")
}

function create(initialState, { context, cookie }) {
    const authRestLink = new ApolloLink((operation, forward) => {
        operation.setContext(async ({headers}) => {
            const token = process.env.api.token;

            return {
                headers: {
                    ...headers,
                    Accept: "application/json",
                    Authorization: token
                }
            };
        });

        return forward(operation).map(result => {
            const { restResponses } = operation.getContext();            
            const authTokenResponse = restResponses ? restResponses.find(res => res.headers.has("Authorization")) : undefined;

            // You might also filter on res.url to find the response of a specific API call
            return authTokenResponse 
                ? localStorage.setItem("token", authTokenResponse.headers.get('Authorization')).then(() => result)
                : result;
        });
    });

    const restLink = new RestLink({ 
        uri: process.env.api.rest_url,
        credentials: 'same-origin'
    });
    
    const httpLink = createHttpLink({
        uri: process.env.api.graphql_url,
        credentials: 'same-origin'
    })
    
    const authLink = setContext((_, { headers }) => {
        const token = process.env.api.token;

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : null
            }
        }
    })

    return new ApolloClient({
        connectToDevTools: process.browser,
        ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
        link: ApolloLink.from([authRestLink.concat(restLink), authLink.concat(httpLink)]),
        cache: new InMemoryCache().restore(initialState || {})
    })
}

export default function initApollo(initialState, options) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (!process.browser) {
        return create(initialState, options)
    }

    // Reuse client on the client-side
    if (!apolloClient) {
        apolloClient = create(initialState, options)
    }

    return apolloClient
}