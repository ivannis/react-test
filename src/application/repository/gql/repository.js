import gql from 'graphql-tag';

export const repository=gql`
    query getRepository($owner: String!, $name: String!, $order: LanguageOrder!) {
        repository(owner: $owner, name: $name) {
            id
            name
            description
            forkCount    
            createdAt
            primaryLanguage {
              name
              color
            }
    
            languages (first: 100, orderBy: $order) {
              totalCount
              nodes {        
                name
                color
              }
            }                 
        }       
    }
`
export const contributors=gql`
    query getRepositoryContributors($owner: String!, $name: String!) {
        contributors(owner: $owner, name: $name) @rest(type: "Person", path: "/repos/{args.owner}/{args.name}/contributors") {
            id
            login
            avatar_url
            contributions
        }
    }
`