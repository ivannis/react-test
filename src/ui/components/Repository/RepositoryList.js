import React from "react";
import { FormattedMessage } from 'react-intl'
import { connect } from "react-redux";
import { Button, Spin, Card, Avatar, Row, Col } from 'antd';
import Link from '../Link'
import App from "../../../application";

const { Meta } = Card;
const styles = `   
    .load-more {
        position: fixed;
        bottom: 90px;
        right: 30px;
        z-index: 1001;
    }    

    .ant-card {
        margin-bottom: 20px;
    }
    .ant-card-body {
        padding: 20px 30px;
    }

    .ant-card-meta-title,
    .ant-card-meta-title h3 {
        margin: 0 !important;
    }
    .ant-card-meta-description span {
        color: #1890ff;
        cursor: pointer;
    }
`

class RepositoryList extends React.Component {    
    loadMore = () => {
        this.props.loadMore(this.props.cursor);
    }

    render() {
        const { repositories, organization, isLoading } = this.props;

        return (
            <div style={{width: "100%", height: "100%"}}>
                <style global="true" jsx="true">{styles}</style>
                <Spin spinning={isLoading}>                
                    <div className="ant-main-menu">
                        <Row gutter={16}>
                            {repositories.map((repository, index) => (
                                <Col span={6} key={index}>
                                    <Card >
                                        <Meta
                                            avatar={<Avatar size={50} style={{ backgroundColor: '#D1DDF6' }} icon={organization}/>}
                                            title={<h3>{repository.name}</h3>}
                                            description={<Link route='repository' params={{name: repository.name}}><span><FormattedMessage id='button.details' defaultMessage='Details' /></span></Link>}
                                        />
                                    </Card>   
                                </Col>                            
                            ))}      
                        </Row>                  
                    </div>

                    <Button type="primary" shape="circle" icon="download" size='large' className="load-more" onClick={this.loadMore}/>
                </Spin>
            </div>
        );
    }
}

const actions = App.actions.repository.list;
const selectors = App.selectors.repository.list;

const mapStateToProps = (state) => ({
    repositories: selectors.items(state),
    organization: selectors.organization(state),
    cursor: selectors.cursor(state),
    isLoading: selectors.isLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
    loadMore: (after) => dispatch(actions.loadMore({after})),
});

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryList)