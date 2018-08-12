import { Layout } from 'antd';
import React from "react";
const { Header, Content } = Layout;
import Footer from '../Footer'

export default class BlankLayout extends React.Component {
    render() {
        return (
            <Layout>
                <style jsx="true">
                    {`
                        .content {
                            background: #fff;
                            min-height: 280px
                        }
                    `}
                </style>
                <Header />

                <Content className="content">
                    {this.props.children}
                </Content>

                <Footer />
            </Layout>
        );
    }
}