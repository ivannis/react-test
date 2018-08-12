import React from "react";
import { FormattedMessage } from 'react-intl'
import { connect } from "react-redux";
import { Spin, Tag, Divider } from 'antd';
import ErrorAlert from "../Alert/ErrorAlert"
import Scrollbar from '../../components/Scrollbar'
import RepositoryContributors from "./RepositoryContributors"
import App from "../../../application";

const styles = `   
    .ant-divider-horizontal.ant-divider-with-text:before, 
    .ant-divider-horizontal.ant-divider-with-text-left:before, 
    .ant-divider-horizontal.ant-divider-with-text-right:before, 
    .ant-divider-horizontal.ant-divider-with-text:after, 
    .ant-divider-horizontal.ant-divider-with-text-left:after, 
    .ant-divider-horizontal.ant-divider-with-text-right:after {
        border-top: none;
    }
`

class RepositoryDetail extends React.Component {        
    constructor(props) {
        super(props)
        
        props.load(this.props.name)
    }

    render() {
        const { repository, errors, isLoading, name } = this.props;
        
        const RepositoryText = !errors && repository ? (
            <div>
                <h1>{repository.name}</h1>
                <p>{repository.description}</p>
                { 
                    repository.primaryLanguage ? (
                        <Divider style={{ backgroundColor: repository.primaryLanguage.color, height: "10px" }}>{repository.primaryLanguage.name}</Divider>
                    ) : '' 
                }
                <div>
                    {repository.languages.map((language, index) => (
                        <Tag color={language.color} key={index}>{language.name}</Tag>                    
                    ))}                  
                </div>
            </div>
          ) : '';

        return (
            <div>
                <style global="true" jsx="true">{styles}</style>
                <Spin spinning={isLoading}>          
                    <ErrorAlert errors={errors}/>          
                    {RepositoryText}
                    <br/>
                    <h2><FormattedMessage id='title.contributors' defaultMessage='Contributors' /></h2>
                    <div style={{width: '100%', height: 'calc(100vh - 32vw)'}}>    
                        <Scrollbar>
                            <RepositoryContributors name={name} />
                        </Scrollbar>                    
                    </div>                    
                </Spin>
            </div>
        );
    }
}

const actions = App.actions.repository.selected;
const selectors = App.selectors.repository.selected;

const mapStateToProps = (state) => ({
    repository: selectors.item(state),
    isLoading: selectors.isLoading(state),
    errors: selectors.error(state),
});

const mapDispatchToProps = (dispatch) => ({
    load: (name) => dispatch(actions.load(name)),
    loadMoreContributors: (name) => dispatch(actions.loadMoreContributors(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RepositoryDetail)