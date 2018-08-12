import React from "react";
import { connect } from "react-redux";
import {  Menu, Icon } from 'antd';
import { Router } from '../../../../app/config/routing'
import App from "../../../application";

const styles = `   
    .ant-dropdown-menu-item .anticon {
        margin-right: 5px;
    }
`

class OrganizationList extends React.Component {    
    findByName(name) {
        return this.props.organizations.find(organization => organization.name === name)
    }

    changeOrganization(name) {
        const { switchOrganization } = this.props;

        switchOrganization(this.findByName(name));
        Router.pushRoute('home')
    }

    render() {
        const { organizations, current } = this.props;

        return (
            <div>
                <style global="true" jsx="true">{styles}</style>

                    <div className="ant-main-menu">
                        <Menu defaultSelectedKeys={[current.name]} mode="inline" theme="dark" onClick={(e) => this.changeOrganization(e.key)}>
                            {organizations.map(organization => (
                                <Menu.Item key={organization.name}>
                                    <Icon type={organization.name} />
                                    <span onClick={this.loadMore}>{ organization.name }</span>                                
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
            </div>
        );
    }
}

const actions = App.actions.organization;
const selectors = App.selectors.organization;

const mapStateToProps = (state) => ({
    organizations: selectors.organizations(state),
    current: selectors.current(state),
});

const mapDispatchToProps = (dispatch) => ({
    switchOrganization: (organization) => dispatch(actions.switch(organization)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList)