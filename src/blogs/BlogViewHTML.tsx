import React, { PureComponent } from 'react';

import { Dimensions, Platform, View } from 'react-native';

import CenteredLoading from '../common/components/CenteredLoading';
import MText from '../common/components/MText';
import sp from '../services/serviceProvider';

const style = () => `
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800'>
  <style>
    body, html {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin: 0;
      padding: 0;
      /*padding-right: 4px;*/
      font-size: 12px;
      letter-spacing: 0;
      background-color: ${sp.styles.getColor('PrimaryBackground')};
      color: ${sp.styles.getColor('PrimaryText')};
      line-height: 20px;
    }

    ::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      background: transparent;  /* optional: just make scrollbar invisible */
    }

    br, p, ul, ol {
      font-size: 16px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      color: ${sp.styles.getColor('SecondaryText')};;
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
      color: ${sp.styles.getColor('PrimaryText')};;
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
      color: ${sp.styles.getColor('PrimaryText')};;
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

/**
 * Render html
 */
const renderHTML = function (props) {
  let html = props.html || '';
  try {
    //Decode to utf8
    html = decodeURIComponent(escape(html.trim()));
  } catch (err) {
    html = props.html;
  }

  if (html.indexOf('<iframe') >= 0) {
    const iframeOpen = new RegExp(/\<iframe/g);
    const iframeClose = new RegExp(/\<\/iframe\>/g);
    const badSrc = new RegExp(/src=\"\/\//g);
    html = html.replace(iframeOpen, '<div class="iframewrapper"><iframe');
    html = html.replace(iframeClose, '</iframe></div>');
    html = html.replace(badSrc, 'src="https://');
  }

  return `<!DOCTYPE html><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <html>
      ${style()}
      <body class="${props.bodyClass}">
        ${html}
      </body>
    </html>`;
};

type PropsType = {
  html: string;
  onHeightUpdated?: () => void;
};

/**
 * Blog view html
 */
export default class BlogViewHTML extends PureComponent<PropsType> {
  /**
   * @var all allowed origins
   */
  all = ['*'];
  webview: any;

  /**
   * state
   */
  state = {
    style: {
      height: Dimensions.get('window').height,
      flex: 0,
      //opacity: 0, removed for https://gitlab.com/minds/mobile-native/-/issues/2878
    },
    html: { html: '' },
  };

  /**
   * On event message =
   */
  onMessage = evt => {
    let height = parseInt(evt.nativeEvent.data, 10);

    height += 30;

    if (height > this.state.style.height) {
      this.setState({ style: { height, flex: 0 } }, () => {
        this.props.onHeightUpdated?.();
      });
    }
  };

  /**
   * Set ref
   */
  setRef = ref => {
    this.webview = ref;
  };

  /**
   * On error
   */
  onError = () => <MText>Sorry, failed to load. please try again</MText>;

  /**
   * On nav state change
   */
  onStateChange = event => {
    if (event.url.indexOf('http') > -1) {
      this.webview.stopLoading();
      sp.resolve('openURL').open(event.url);
    }
  };

  /**
   * Render loading
   */
  renderLoading = () => <CenteredLoading />;

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.html !== prevState.original) {
      return {
        html: { html: renderHTML(nextProps), basePath: '' },
        original: nextProps.html,
      };
    }
    return null;
  }

  /**
   * a hack used only on android to prevent the link openning in webview
   * @return { boolean }
   */
  private handleShouldStartLoadWithRequest({ url }: any) {
    sp.resolve('openURL').open(url);
    return false;
  }

  /**
   * Render
   */
  render() {
    // lazy load
    const WebView = require('react-native-webview').WebView;
    return (
      <WebView
        originWhitelist={this.all}
        ref={this.setRef}
        scrollEnabled={false}
        source={this.state.html}
        mixedContentMode="compatibility"
        style={[sp.styles.style.bgPrimaryBackground, this.state.style]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        // renderLoading={this.renderLoading}
        onShouldStartLoadWithRequest={
          Platform.OS === 'android'
            ? this.handleShouldStartLoadWithRequest
            : undefined
        }
        startInLoadingState={true}
        renderLoading={() => <View style={sp.styles.style.flexContainer} />}
        renderError={this.onError}
        onNavigationStateChange={
          Platform.OS === 'android' ? undefined : this.onStateChange
        }
      />
    );
  }
}
