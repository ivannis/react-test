import React from "react";
import { Layout } from 'antd';
const { Footer } = Layout;

export default class AppFooter extends React.Component {
    render() {
        return (
            <Footer className="footer">
                <style jsx="true">
                    {`
                        .footer {
                            text-align: center;
                            color: #fff;
                            background: #002140;
                            padding: 14px 50px;
                        }
                    `}
                </style>
                RepoHub ©2018
            </Footer>
        );
    }
}