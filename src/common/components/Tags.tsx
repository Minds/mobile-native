//@ts-ignore
import _ from 'lodash';

import React, { PureComponent } from 'react';

import { Text, TextStyle } from 'react-native';

import colors from '../../styles/Colors';
import openUrlService from '../services/open-url.service';

const hashRegex = new RegExp(
  [
    '([^&]|\\B|^)', // Start of string, and word bounday. Not if preceeded by & symbol
    '#', //
    '([',
    '\\wÀ-ÿ', // All Latin words + accented characters
    '\\u0E00-\\u0E7F', // Unicode range for Thai
    '\\u2460-\\u9FBB', // Unicode range for Japanese but may be overly zealous
    ']+)',
  ].join(''),
  'gim',
);

type PropsType = {
  color?: string;
  selectable?: boolean;
  navigation: any;
  style?: TextStyle | Array<TextStyle>;
};

/**
 * Tags component
 *
 * Generate text with links
 */
export default class Tags extends PureComponent<PropsType> {
  index: number = 0;
  styles = {
    color: colors.primary,
  };

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
    const selectable =
      this.props.selectable !== undefined ? this.props.selectable : true;

    if (Array.isArray(tags)) {
      // workaround to prevent styling problems when there is many tags
      const chunks = _.chunk(tags, 50);

      return chunks.map((data, i) => {
        return (
          <Text selectable={selectable} style={this.props.style} key={i}>
            {data}
          </Text>
        );
      });
    } else {
      return (
        <Text selectable={selectable} style={this.props.style}>
          {tags}
        </Text>
      );
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
    const url = /(^|\b)(\b(?:https?|http|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9+&@#\/%=~_|])/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <Text
          key={i}
          style={[this.props.style, this.styles]}
          onPress={() => {
            this.navToURL(content);
          }}>
          {content}
        </Text>
      );
    });
  };

  /**
   * url .com .org .net
   */
  parseShortUrl = (str) => {
    const url = /(^|\b)([-A-Z0-9+&@#\/%?=~_|!:,.;]+\.(?:com|org|net)\/[-A-Z0-9+&@#\/%=~_|\(\)]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <Text
          key={i}
          style={[this.props.style, this.styles]}
          onPress={() => {
            this.navToURL(content);
          }}>
          {content}
        </Text>
      );
    });
  };

  /**
   * url starting with www
   */
  parseWwwUrl = (str) => {
    const url = /(^|\b)(www\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|\(\)]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <Text
          key={i}
          style={[this.props.style, this.styles]}
          onPress={() => {
            this.navToURL('http://' + content);
          }}>
          {content}
        </Text>
      );
    });
  };

  /**
   * #tags
   */
  parseHash = (str) => {
    return this.replaceRegular(str, hashRegex, (i, content) => {
      return (
        <Text
          key={i}
          style={[this.props.style, this.styles]}
          onPress={() => {
            this.navToDiscovery(`#${content}`);
          }}>
          #{content}
        </Text>
      );
    });
  };

  /**
   * @tags
   */
  parseUser = (str) => {
    const hash = /(^|\s|\B)@(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return (
        <Text
          key={i}
          style={[this.props.style, this.styles]}
          onPress={() => {
            this.navToChannel(content);
          }}>
          @{content}
        </Text>
      );
    });
  };

  /**
   * Navigate to discovery
   */
  navToDiscovery = (q) => {
    this.props.navigation.navigate('DiscoverySearch', { query: q });
  };

  /**
   * Navigate to discovery
   */
  navToChannel = (q) => {
    this.props.navigation.push('Channel', { username: q });
  };

  navToURL = (q) => {
    openUrlService.open(q);
  };

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
          return child;
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
    if (result.length === 1) return str;

    for (let i = 2; i < result.length; i = i + 3) {
      const content = result[i];
      result[i] = replace(this.index++, content);
    }

    return result.filter((d) => d != '');
  }
}
