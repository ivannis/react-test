import React from 'react';
import { connect } from "react-redux";
import Page from '../../components/Page'
import Layout from '../../components/Layout'
import RepositoryDetail from '../../components/Repository/RepositoryDetail'
import App from "../../../application";


class RepositoryPage extends React.Component {       
    static async getInitialProps ({ query, store }) {          
        store.dispatch(actions.load(query.name))

        return { name: query.name }
    }

    render() {
        const { name } = this.props;

        return (
            <Page title="Repository page" description="Repository details">
                <Layout>
                    <RepositoryDetail name={name}/>
                </Layout>
            </Page>
        );
    }
}
const actions = App.actions.repository.selected;
const selectors = App.selectors.organization;

const mapStateToProps = (state) => ({
    organization: selectors.current(state)
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryPage)