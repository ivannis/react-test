import React from "react";
import { FormattedMessage } from 'react-intl'
import { Layout } from 'antd';
import LocaleSwitcher from '../Locale/LocaleSwitcher'

const { Header } = Layout;

const styles = `   
    .menu :global(.anticon) {
        margin-right: 8px;
    }

    .menu :global(.ant-dropdown-menu-item) {
        width: 160px;
    }
`

export default class AppHeader extends React.Component {

    render() {
        return (            
            <Header style={{ background: '#fff' }}>        
                <style global="true" jsx="true">{styles}</style>                                                
                <div style={{ float: 'left' }}>
                    <h1><FormattedMessage id='title.welcome' defaultMessage='Welcome to the RepoHub' /></h1>
                </div>
                <LocaleSwitcher style={{ float: 'right' }} />
            </Header>
        );
    }
}