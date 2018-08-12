import Module from "../core/Module";
import RepositoryList from './RepositoryList'
import RepositorySelected from './RepositorySelected'

const Repository = new Module({
    namespace: 'github', store: 'repository',
    modules: [
        RepositoryList,
        RepositorySelected
    ],
    initialState: {},
})

export default Repository;