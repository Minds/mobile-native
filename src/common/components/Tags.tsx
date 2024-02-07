//@ts-ignore
import chunk from 'lodash/chunk';
import flattenDeep from 'lodash/flattenDeep';

import React, { PropsWithChildren, PureComponent } from 'react';

import { TextStyle } from 'react-native';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '../../styles/ThemedStyles';

import openUrlService from '../services/open-url.service';
import MText from './MText';
import { regex } from '~/services';

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
      const chunks = chunk(tags, 50);

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
      return flattenDeep(rtn);
    }

    return rtn;
  }

  /**
   * full url
   */
  parseUrl = str => {
    return this.replaceRegular(str, regex.url, (i, content) => {
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
    return this.replaceRegular(str, regex.shortUrl, (i, content) => {
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
    return this.replaceRegular(str, regex.wwwUrl, (i, content) => {
      return (
        <MText
          key={i}
          style={[this.props.style, ThemedStyles.style.colorLink]}
          onPress={() => {
            this.navToURL('https://' + content);
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
    return this.replaceRegular(str, regex.hash, (i, content) => {
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
    return this.replaceRegular(str, regex.cash, (i, content) => {
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
    return this.replaceRegular(str, regex.tag, (i, content) => {
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
  replaceRegular(str, regular, replace, increment = 3) {
    const result = str.split(regular);
    if (result.length === 1) return str;

    for (let i = 2; i < result.length; i = i + increment) {
      const content = result[i];
      result[i] = replace(this.index++, content);
    }

    return result.filter(d => d != '');
  }
}
