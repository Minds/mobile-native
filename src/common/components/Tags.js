import _ from 'lodash';

import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
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

  /**
   * On component will mount
   */
  componentWillMount() {
    if (this.props.color) {
      this.styles.color = this.props.color;
    }
  }

  /**
   * Render
   */
  render() {
    this.index = 0;
    const tags = this.parseTags(this.props.children);

    if (Array.isArray(tags)) {
      // workaround to prevent styling problems when there is many tags
      const chunks = _.chunk(tags, 50);

      return chunks.map((data, i) => {
        return <Text selectable={true} style={this.props.style} key={i}>{data}</Text>
      });
    } else {
      return <Text selectable={true} style={this.props.style}>{tags}</Text>
    }
  }

  /**
   * Parse Tags
   */
  parseTags(children) {
    if (!children) return;
    let rtn = this.parseArrayOrString(children, this.parseUrl);
    rtn = this.parseArrayOrString(rtn, this.parseShortUrl);
    rtn = this.parseArrayOrString(rtn, this.parseWwwUrl);
    rtn = this.parseArrayOrString(rtn, this.parseHash);
    rtn = this.parseArrayOrString(rtn, this.parseUser);

    if (Array.isArray(rtn)) {
      return _.flattenDeep(rtn);
    }

    return rtn;
  }

  /**
   * full url
   */
  parseUrl = (str) => {
    const url = /(^|\s)(\b(?:https?|http|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={[this.props.style,this.styles]} onPress={() => { Linking.openURL(content.toLowerCase());}}>{content}</Text>
    });
  }

  /**
   * url .com .org .net
   */
  parseShortUrl = (str) => {
    const url = /(^|\s)([-A-Z0-9+&@#\/%?=~_|!:,.;]+\.(?:com|org|net)\/[-A-Z0-9+&@#\/%=~_|]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={[this.props.style,this.styles]} onPress={() => { Linking.openURL(content.toLowerCase());}}>{content}</Text>
    });
  }

  /**
   * url starting with www
   */
  parseWwwUrl = (str) => {
    const url = /(^|\s)(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return <Text key={i} style={[this.props.style,this.styles]} onPress={() => { Linking.openURL('http://'+content.toLowerCase());}}>{content}</Text>
    });
  }

  /**
   * #tags
   */
  parseHash = (str) => {
    const hash = /(^|\s)\#(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return <Text key={i} style={[this.props.style,this.styles]} onPress={() => { this.navToDiscovery(`#${content}`) }}>#{content}</Text>
    });
  }

  /**
   * @tags
   */
  parseUser = (str) => {
    const hash = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return <Text key={i} style={[this.props.style,this.styles]} onPress={() => { this.navToChannel(content) }}>@{content}</Text>
    });
  }

  /**
   * Navigate to discovery
   */
  navToDiscovery = (q) => {
    this.props.navigation.navigate('Discovery', {q});
  }

  /**
   * Navigate to discovery
   */
  navToChannel = (q) => {
    this.props.navigation.navigate('Channel', {username : q});
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
          if (Array.isArray(child)) {
            return this.parseArrayOrString(child, fn);
          }
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

    for (let i = 2; i < result.length; i = i + 3) {
      const content = result[i];
      result[i] = replace(this.index++, content);
    }

    return result.filter((d) => d != '');
  }

}
