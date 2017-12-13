import React, {
  Component
} from 'react';

import { WebView } from "react-native";

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
  render() {
    return (
      <WebView scrollEnabled={false}
        source={{ html: this.props.html + style + script }}
        style={{ height: this.state.height }}
        javaScriptEnabled={true}
        onNavigationStateChange={this.onNavigationChange.bind(this)}>
      </WebView>

    )
  }

}