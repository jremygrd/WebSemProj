import App, {Container} from 'next/app';
import Head from 'next/head';
import React from 'react';
const axios = require('axios');

class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        let pageProps = {};
        
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
            
        }
        let f = await axios({
            method: "GET",
            url: "http://localhost:3000/api/hello",
        })
        return {pageProps};
    }

    render() {
        const {Component, pageProps} = this.props;
        const description = 'Creating a non-SSR map component inside a Next.js project.';

        return (
            <Container>
                <Head>
                    <title>Web Semantics Project</title>
                    <meta charSet="utf-8" />
                    <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
                    <meta content="width=device-width, initial-scale=1" name="viewport" />
                    <link href="/static/favicon.ico" rel="shortcut icon" />
                    <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet" />
                    <meta content={description} name="description" />
                    <meta property="og:title" content={'Heyyyy'} />
                    <meta content="en_US" property="og:locale" />
                    <meta content={description} property="og:description" />
                    <meta content="https://next-mapbox-demo.now.sh" property="og:url" />
                </Head>
                <Component {...pageProps} />
            </Container>
        );
    }
}

export default MyApp;