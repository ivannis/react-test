import React from "react";
import { Layout } from 'antd';
import Link from '../Link'
import OrganizationList from "../Organization/OrganizationList";

const { Sider } = Layout;
const styles = `       
    .logo-container {
        position: relative;
        height: 64px;
        background: #002140;
    }
    
    .logo {
        cursor: pointer;
        left: 24px;
        top: 10px;
        background: #e40079;
        width: 36px;
        height: 36px;
        display: block;
        position: absolute;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    .logo::before{
        width: 20px;
        height: 20px;
        display:block;
        border:5px solid #F7F5F2;
        content:"";
        position:absolute;
        border-radius:14px;
        top:8px;
        left:8px;
    }
    .brand-name {
        cursor: pointer;
        font-weight: bold;
        color: #fff;
        font-size: 20px;
        position: absolute;
        left: 70px;
        top: 18px;
        display: block;
    }    
`
const globalStyles = `
    .ant-layout-sider-trigger {
      transition: color .3s;
    }    
    
    .ant-layout-sider-trigger:hover {
        color: #1890ff;
    }
`
export default class Sidebar extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    render() {
        
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                className="sidebar"
            >
                <style jsx="true">{styles}</style>
                <style global="true" jsx="true">{globalStyles}</style>

                <Link route='home'>
                    <div className="logo-container">
                        <div className="logo"></div>
                        <div className="brand-name">RepoHub</div>
                    </div>
                </Link>   

                <OrganizationList/>             
            </Sider>
        );
    }
}