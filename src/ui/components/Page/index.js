import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head'

export default class Page extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        scripts: PropTypes.arrayOf(PropTypes.string),
    };

    static defaultProps = {
        title: 'Default title',
        description: 'Default description',
        scripts: [],
    };

    render() {
        const { title, description, scripts, children } = this.props;
        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    <title>{ title }</title>
                    <meta name="description" content={description} />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {scripts.map(script => <link key={script} rel="preload" href={script} as="script" />)}
                    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
                </Head>
                { children }
            </div>
        );
    }
}