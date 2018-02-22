import React, {
  Component
} from 'react';

import { 
  WebView,
  View,
  Dimensions } from "react-native";

const script = `
<script>
  if(document.documentElement.clientHeight>document.body.clientHeight)
  {
    document.title = document.documentElement.clientHeight
  } else {
    document.title = document.body.clientHeight
  }
</script>
`;
const style = `
<style>
  body, html, #height-calculator {
    margin: 0;
    padding: 0;
    font-size: 12px;
    letter-spacing: 0.3px;
    line-height: 22px;
  }
  
  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }
  
  br, p, ul, ol {
    font-size: 16px;
    font-family: Roboto, Helvetica, Arial, sans-serif;
    color: #6a6a6a;
    font-weight: 400;
    line-height: 30px;
  }

  p {
    margin-bottom: 0.5em;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: 0.5px;
    letter-spacing: -.003em;
    font-family: 'Roboto';
    color: rgba(0,0,0,.84);
    margin-top: 29px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  h1,h2,h3,h4,h5 {
    font-weight: 600;
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
</style>
`;

/**
 * Auto Height WebView
 * based on https://github.com/scazzy/react-native-webview-autoheight
 * and https://flexwork.io/blog/webview-height-html-content-react-native/
 */
export default class AutoHeightWebView extends Component {
  state = {
    height: 0
  }

  onNavigationChange(event) {
    if (event.title) {
      const htmlHeight = Number(event.title) //convert to number
      this.setState({ height: htmlHeight });
    }
  }

  renderHTML() {
    let width = Math.round(Dimensions.get('window').width);
    let imgStyle = `<style>
                      iframe {
                        width: ${width} !important;
                      }

                      img {
                        max-width: ${width}px !important;
                      }</style>`;
    let html = '';
    try {
      //Decode to utf8
      html = decodeURIComponent(escape(this.props.html));
    } catch (err) {
      html = this.props.html;
    }

    if (html.indexOf('<iframe') >= 0) {
      html = html.replace('<iframe', '<div class="iframewrapper"><iframe');
      html = html.replace('</iframe>', '</iframe></div>');
      html = html.replace('src="//', 'src="https://');
    }
    
    return `
    <!DOCTYPE html>
    <title>${this.props.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <html>${style}${imgStyle}
    <body class="${this.props.bodyClass}">
    ${html}
    ${script}
    </body>
    </html>`;
  }


  render() {
    return (
      <View>
      <WebView scrollEnabled={false}
        source={{ html: this.renderHTML() }}
        style={{ height: this.state.height }}
        javaScriptEnabled={false}
        startInLoadingState={false}
        onNavigationStateChange={this.onNavigationChange.bind(this)}>
      </WebView>
      </View>
    )
  }
}