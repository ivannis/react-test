import React from 'react';
import Page from '../../components/Page'
import Layout from '../../components/Layout'
import RepositoryList from '../../components/Repository/RepositoryList'
import Scrollbar from '../../components/Scrollbar'

export default class HomePage extends React.Component {    
    render() {
        return (
            <Page title="Facebook projects" description="Facebook projects on Github">
                <Layout>                    
                    <div style={{width: '100%', height: 'calc(100vh - 15vw)'}}>                            
                        <Scrollbar>
                            <RepositoryList/>
                        </Scrollbar>                    
                    </div>
                </Layout>
            </Page>
        );
    }
}


