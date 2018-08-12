import React from "react";
import { FormattedMessage } from 'react-intl'
import { connect } from "react-redux";
import { List, Avatar, Spin, Button } from 'antd';
import App from "../../../application";

class RepositoryContributors extends React.Component { 
    
    onLoadMore = () => {
        this.props.loadMore(this.props.name);
    }

    render() {
        const { contributors, isLoading } = this.props;
        
        const loadMore = (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {isLoading && <Spin />}
              {!isLoading && <Button onClick={this.onLoadMore}><FormattedMessage id='button.load_more' defaultMessage='loading more' /></Button>}
            </div>
        );

        return (
            <List
                className="demo-loadmore-list"
                loading={isLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={contributors}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} size={58}/>}                            
                            title={<span>{item.name}</span>}              
                            description={<span>{item.contributions} contributions</span>}                 
                        />
                    </List.Item>
                )}
            />
        );
    }
}

const actions = App.actions.repository.selected.contributors;
const selectors = App.selectors.repository.selected.contributors;

const mapStateToProps = (state) => ({
    contributors: selectors.items(state),
    cursor: selectors.cursor(state),
    isLoading: selectors.isLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
    loadMore: (name) => dispatch(actions.loadMore(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryContributors)