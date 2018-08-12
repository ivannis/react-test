import gql from 'graphql-tag';

export default gql`
    query getRepositoriesByOrganization($organization: String!, $order: RepositoryOrder, $first: Int!, $after: String) {
        organization(login: $organization) {
            login
            description
            repositories(first: $first, orderBy: $order, after: $after) {
                totalCount
                edges {
                    cursor
                    node {
                        id
                        name
                        description
                        forkCount    
                        createdAt
                        primaryLanguage {
                            name
                            color
                        }              
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`