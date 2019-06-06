import React, {
  Component
} from 'react';

import {
  View,
  Text,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";

import { WebView } from 'react-native-webview';

const style = `
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800'>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      /*padding-right: 4px;*/
      font-size: 12px;
      letter-spacing: 0;
      line-height: 20px;
    }

    ::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      background: transparent;  /* optional: just make scrollbar invisible */
    }

    br, p, ul, ol {
      font-size: 16px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      color: #6a6a6a;
      font-weight: 400;
      line-height: 20px;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: #4690D6;
      text-decoration: none;
      font-weight: 600;
    }

    p {
      margin-bottom: 0.58em;
      font-weight: 400;
      font-style: normal;
      color: rgba(0,0,0,.72);
      margin-top: 20px;


      font-size: 18px;
      line-height: 1.50;
      letter-spacing: -.004em;

      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, h5 {
      font-weight: 600;
      font-family: Roboto;
      line-height: 1.1;
      color: #444;
      font-size: 24px;
    }

    ul, ol {
      margin: 0 0 0.5em 1em;

      li {
        margin-bottom: 0.5em;
      }
    }

    .iframewrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%;
    }
    .iframewrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    iframe {
      width: 100% !important;
      height: 100% !important;
      border: 0;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .medium-insert-embeds {
      width: 100%;
    }
    .medium-insert-embeds figure{
      margin: 0;
    }
  </style>
`;

const injectedJavaScript = `
  setTimeout(() => {
    const postMessage = window.ReactNativeWebView.postMessage;

    let currentHeight = document.body.scrollHeight;

    window.ReactNativeWebView.postMessage(currentHeight + 20);

    setTimeout(() => {
      if (currentHeight === document.body.scrollHeight) return;
      currentHeight = document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(currentHeight + 20);
    }, 1000);
  },100);
  true;
`;

export default class BlogViewHTML extends Component {

  state = {
    height: Dimensions.get('window').height,
  };

  onMessage = (evt) => {
    const height = parseInt(evt.nativeEvent.data);

    if (height > this.state.height)
      this.setState({ height });
  }

  renderHTML() {
    let width = Math.round(Dimensions.get('window').width);
    let html = this.props.html || '';
    try {
      //Decode to utf8
      html = decodeURIComponent(escape(html.trim()));
    } catch (err) {
      html = this.props.html;
    }

    if (html.indexOf('<iframe') >= 0) {
      html = html.replace('<iframe', '<div class="iframewrapper"><iframe');
      html = html.replace('</iframe>', '</iframe></div>');
      html = html.replace('src="//', 'src="https://');
    }

    return `<!DOCTYPE html><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <html>
        ${style}
        <body class="${this.props.bodyClass}">
          ${html}
        </body>
      </html>`;
  }


  render() {
    return (
      <WebView
        originWhitelist={['*']}
        ref={(ref) => { this.webview = ref; }}
        scrollEnabled={false}
        source={{ html: this.renderHTML(), baseUrl: '' }}
        mixedContentMode='compatibility'
        style={{ height: this.state.height}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        startInLoadingState={false}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        renderLoading={() => <ActivityIndicator size={'small'} />}
        renderError={() => (<Text>Sorry, failed to load. please try again</Text>)}
        onNavigationStateChange={(event) => {
          if (event.url.indexOf('http') > -1) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
        >
      </WebView>
    )
  }
}