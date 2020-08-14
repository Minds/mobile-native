//@ts-nocheck
import React, { PureComponent } from 'react';

import { Text, Dimensions, Linking, View } from 'react-native';

import { WebView } from 'react-native-webview';
import ThemedStyles from '../styles/ThemedStyles';
import CenteredLoading from '../common/components/CenteredLoading';

const style = () => `
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800'>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      /*padding-right: 4px;*/
      font-size: 12px;
      letter-spacing: 0;
      background-color: ${ThemedStyles.getColor('secondary_background')};
      color: ${ThemedStyles.getColor('primary_text')};
      line-height: 20px;
    }

    ::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      background: transparent;  /* optional: just make scrollbar invisible */
    }

    br, p, ul, ol {
      font-size: 16px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      color: ${ThemedStyles.getColor('secondary_text')};;
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
      color: ${ThemedStyles.getColor('primary_text')};;
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
      color: ${ThemedStyles.getColor('primary_text')};;
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

/**
 * Blog view html
 */
export default class BlogViewHTML extends PureComponent {
  /**
   * @var all allowed origins
   */
  all = ['*'];

  /**
   * state
   */
  state = {
    style: {
      height: Dimensions.get('window').height,
      flex: 0,
      opacity: 0,
    },
    html: { html: '' },
  };

  /**
   * On event message =
   */
  onMessage = (evt) => {
    let height = parseInt(evt.nativeEvent.data, 10);

    height += 30;

    if (height > this.state.style.height) {
      this.setState({ style: { height, flex: 0 } }, () => {
        if (this.props.onHeightUpdated) {
          this.props.onHeightUpdated();
        }
      });
    }
  };

  /**
   * Set ref
   */
  setRef = (ref) => {
    this.webview = ref;
  };

  /**
   * On error
   */
  onError = () => <Text>Sorry, failed to load. please try again</Text>;

  /**
   * On nav state change
   */
  onStateChange = (event) => {
    if (event.url.indexOf('http') > -1) {
      this.webview.stopLoading();
      Linking.openURL(event.url);
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
   * Render
   */
  render() {
    return (
      <WebView
        originWhitelist={this.all}
        ref={this.setRef}
        scrollEnabled={false}
        source={this.state.html}
        mixedContentMode="compatibility"
        style={this.state.style}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        // startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
        onMessage={this.onMessage}
        // renderLoading={this.renderLoading}
        startInLoadingState={true}
        renderLoading={() => <View style={ThemedStyles.style.flexContainer} />}
        renderError={this.onError}
        onNavigationStateChange={this.onStateChange}
      />
    );
  }
}
