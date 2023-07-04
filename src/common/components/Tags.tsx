//@ts-ignore
import _ from 'lodash';

import React, { PropsWithChildren, PureComponent } from 'react';

import { TextStyle } from 'react-native';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';

import openUrlService from '../services/open-url.service';
import MText from './MText';

export const hashRegex = new RegExp(
  [
    '([^&]|\\B|^)', // Start of string, and word boundary. Not if preceded by & symbol
    '#', //
    '([',
    '\\wÀ-ÿ', // All Latin words + accented characters
    '\\u0E00-\\u0E7F', // Unicode range for Thai
    '\\u2460-\\u9FBB', // Unicode range for Japanese but may be overly zealous
    ']+)',
  ].join(''),
  'gim',
);

export const cashRegex = new RegExp(
  [
    '([^&]|\\b|^)', // Start of string, and word bounday. Not if preceeded by & symbol
    '\\$', //
    '([',
    'A-Za-z',
    ']+)',
  ].join(''),
  'gim', // Global, Case insensitive, Multiline
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
export default class Tags extends PureComponent<PropsWithChildren<PropsType>> {
  index: number = 0;

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
          <MText selectable={selectable} style={this.props.style} key={i}>
            {data}
          </MText>
        );
      });
    } else {
      return (
        <MText selectable={selectable} style={this.props.style}>
          {tags}
        </MText>
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
    rtn = this.parseArrayOrString(rtn, this.parseCash);
    rtn = this.parseArrayOrString(rtn, this.parseUser);

    if (Array.isArray(rtn)) {
      return _.flattenDeep(rtn);
    }

    return rtn;
  }

  /**
   * full url
   */
  parseUrl = str => {
    const url =
      /(^|\b)(\b(?:https?|http|ftp):\/\/[-A-Z0-9à-œ+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9à-œ+&@#\/%=~_|])/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToURL(content);
          }}>
          {content}
        </MText>
      );
    });
  };

  /**
   * url .com .org .net
   */
  parseShortUrl = str => {
    const url =
      /(^|\b)([-A-Z0-9à-œ+&@#\/%?=~_|!:,.;]+\.(?:com|org|net)\/[-A-Z0-9à-œ+&@#\/%=~_|\(\)]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToURL(content);
          }}>
          {content}
        </MText>
      );
    });
  };

  /**
   * url starting with www
   */
  parseWwwUrl = str => {
    const url =
      /(^|\b)(www\.[-A-Z0-9à-œ+&@#\/%?=~_|!:,.;]*[-A-Z0-9à-œ+&@#\/%=~_|\(\)]*)/gim;

    return this.replaceRegular(str, url, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToURL('http://' + content);
          }}>
          {content}
        </MText>
      );
    });
  };

  /**
   * #tags
   */
  parseHash = str => {
    return this.replaceRegular(str, hashRegex, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToDiscovery(`#${content}`);
          }}>
          #{content}
        </MText>
      );
    });
  };

  parseCash = str => {
    return this.replaceRegular(str, cashRegex, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToDiscovery(`\$${content}`);
          }}>
          ${content}
        </MText>
      );
    });
  };

  /**
   * @tags
   */
  parseUser = str => {
    const hash = /(^|\s|\B)@(\w*[a-zA-Z_]+\w*)/gim;

    return this.replaceRegular(str, hash, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToChannel(content);
          }}>
          @{content}
        </MText>
      );
    });
  };

  /**
   * Navigate to discovery
   */
  navToDiscovery = q => {
    if (this.props.navigation === NavigationService) {
      this.props.navigation.navigate('App', {
        screen: 'DiscoverySearch',
        params: { query: q },
      });
    } else {
      this.props.navigation.push('DiscoverySearch', {
        query: q,
      });
    }
  };

  /**
   * Navigate to discovery
   */
  navToChannel = q => {
    if (this.props.navigation === NavigationService) {
      this.props.navigation.push('App', {
        screen: 'Channel',
        params: { username: q },
      });
    } else {
      this.props.navigation.push('Channel', { username: q });
    }
  };

  navToURL = q => {
    openUrlService.open(q);
  };

  /**
   * Apply fn to an array or string
   * @param {string|array} children
   * @param {function} fn
   */
  parseArrayOrString(children, fn) {
    if (Array.isArray(children)) {
      return children.map(child => {
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

    return result.filter(d => d != '');
  }
}
