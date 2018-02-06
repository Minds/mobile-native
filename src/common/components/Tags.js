import React, {
  PureComponent
} from 'react';

import {
  Text,
  Linking
} from 'react-native';

import colors from '../../styles/Colors';

/**
 * Tags component
 *
 * Generate text with links
 */
export default class Tags extends PureComponent {

  styles = {
    color: colors.primary
  }

  componentWillMount() {
    if (this.props.color) {
      this.styles.color = this.props.color;
    }
  }

  render() {
    const tags = this.parseTags(this.props.children);
    return (
      <Text>{tags}</Text>
    )
  }

  parseTags(children) {
    if (!children) return;
    let rtn = this.parseArrayOrString(children, this.parseUrl);
    rtn = this.parseArrayOrString(rtn, this.parseShortUrl);
    rtn = this.parseArrayOrString(rtn, this.parseWwwUrl);
    rtn = this.parseArrayOrString(rtn, this.parseHash);
    rtn = this.parseArrayOrString(rtn, this.parseUser);
    return rtn;
  }

  /**
   * full url
   */
  parseUrl = (str) => {
    const url = /(\b(?:https?|http|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={this.styles} onPress={() => { Linking.openURL(content);}}>{content}</Text>
    });
  }

  /**
   * url .com .org .net
   */
  parseShortUrl = (str) => {
    const url = /(?:^|\s+)([-A-Z0-9+&@#\/%?=~_|!:,.;]+\.(com|org|net)\/[-A-Z0-9+&@#\/%=~_|]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={this.styles} onPress={() => { Linking.openURL(content);}}> {content}</Text>
    });
  }

  /**
   * url starting with www
   */
  parseWwwUrl = (str) => {
    const url = /(?:^|\s+)(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={this.styles} onPress={() => { Linking.openURL(content);}}> {content}</Text>
    });
  }

  /**
   * #tags
   */
  parseHash = (str) => {
    const hash = /(?:^|\s)#(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return <Text key={i} style={this.styles} onPress={() => { this.navToDiscovery('#'+content) }}> #{content}</Text>
    });
  }

  /**
   * @tags
   */
  parseUser = (str) => {
    const hash = /(?:^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return <Text key={i} style={this.styles} onPress={() => { this.navToDiscovery(content) }}> @{content}</Text>
    });
  }

  /**
   * Navigate to discovery
   */
  navToDiscovery = (q) => {
    this.props.navigation.navigate('Discovery', {q});
  }

  /**
   * Apply fn to an array or string
   * @param {string|array} children
   * @param {function} fn
   */
  parseArrayOrString(children, fn) {
    if (Array.isArray(children)) {
      return children.map((child) => {
        if (typeof child === 'string') {
          return fn(child);
        } else {
          return child
        }
      });
    }
    return fn(children);
  }

  /**
   * Return an array if expression match
   *
   * @param {string} str
   * @param {regular} regular
   * @param {function} replace
   */
  replaceRegular(str, regular, replace) {
    const result = str.split(regular);
    if (result.length == 1) return str;

    for (let i = 1; i < result.length; i = i + 2) {
      const content = result[i];
      result[i] = replace(i, content);
    }

    return result
  }

}