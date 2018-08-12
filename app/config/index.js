module.exports = {
    'process.env.api': {
        graphql_url: process.env.API_GRAPHQL_URL || 'https://api.github.com/graphql',
        rest_url: process.env.API_REST_URL || 'https://api.github.com',
        token: process.env.ACCESS_TOKEN || 'your-access-token-here'
    },
    'process.env.defaultLanguage': 'en_US'
};