import React from "react";
import { Layout } from 'antd';
import Sidebar from '../Sidebar'
import Header from '../Header'
import Footer from '../Footer'

const { Content } = Layout;

export default class BasicLayout extends React.Component {
    render() {
        return (
            <Layout className="basicLayout">
                <style jsx="true">
                    {`
                        .basicLayout {
                            min-height: 100vh;
                            flex-direction: row;
                        }
                        .content {
                            margin: 24px 16px;
                            padding: 24px;
                            background: #fff;
                            min-height: 280px
                        }
                    `}
                </style>
                <Sidebar />

                <Layout>
                    <Header />

                    <Content className="content">
                        {this.props.children}
                    </Content>

                    <Footer />
                </Layout>
            </Layout>
        );
    }
}