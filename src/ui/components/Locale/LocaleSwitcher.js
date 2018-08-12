import React from 'react';
import { connect } from "react-redux";
import { Menu, Dropdown, Icon } from 'antd';
import App from "../../../application";

class LocaleSwitcher extends React.Component {
    findByCode(code) {
        return this.props.locales.find(locale => locale.code === code)
    }

    changeLocale(code) {
        const { switchLocale } = this.props;

        switchLocale(this.findByCode(code));
    }

    render() {
        const { current, locales, style } = this.props;

        const menu = (
            <Menu onClick={(e) => this.changeLocale(e.key)}>
                {locales.map(locale => (
                    <Menu.Item key={locale.code} className={locale.code === current.code ? 'active' : ''}>
                        { locale.name }
                    </Menu.Item>

                ))}
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#" style={style}>
                    { current.name } <Icon type="down" />
                </a>
            </Dropdown>
        );
    }
}

const actions = App.actions.locale;
const selectors = App.selectors.locale;

const mapStateToProps = (state) => ({
    current: selectors.current(state),
    locales: selectors.locales(state),
});

const mapDispatchToProps = (dispatch) => ({
    switchLocale: (locale) => dispatch(actions.switch(locale)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSwitcher)
