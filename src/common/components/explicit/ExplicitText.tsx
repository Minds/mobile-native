import React, { Component } from 'react';

import { observer } from 'mobx-react';
import * as entities from 'entities';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TextStyle,
} from 'react-native';

import Tags from '~/common/components/Tags';

import type ActivityModel from '~/newsfeed/ActivityModel';
import { LinearGradient } from 'expo-linear-gradient';
import MText from '../MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  entity: ActivityModel;
  selectable?: boolean;
  navigation: any;
  style?: TextStyle | Array<TextStyle>;
  noTruncate?: boolean;
};

type StateType = {
  more: boolean;
  width: number;
  height: number;
};

@observer
export default class ExplicitText extends Component<PropsType, StateType> {
  needTruncate = false;
  gradientColors: any;

  state = {
    more: false,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  /**
   * constructor
   */
  constructor(props) {
    super(props);

    const backgroundColor = sp.styles.getColor('PrimaryBackground');
    const startColor = backgroundColor + '00';
    const endColor = backgroundColor + 'FF';
    this.gradientColors = [startColor, endColor];
  }

  /**
   * Render
   */
  render() {
    const theme = sp.styles.style;
    const entity = this.props.entity;

    const tempTitle = entity.title || entity.link_title;

    let title: string =
      tempTitle && !entity.perma_url
        ? entities.decodeHTML(tempTitle).trim()
        : '';
    let message = entity.text ? entities.decodeHTML(entity.text).trim() : '';

    if (title === message || entity.subtype === 'blog') {
      message = '';
    }

    // remove xml tags
    if (entity.custom_type === 'video' || entity.subtype === 'video') {
      if (title.length) {
        title = title.replace(/<[^>]*>/g, '');
      }
      if (message.length) {
        message = message.replace(/<[^>]*>/g, '');
      }
    }

    if (entity.custom_type === 'audio') {
      title = '';
    }

    let body: React.ReactNode | null = null;
    let moreLess: React.ReactNode | null = null;
    let explicitToggle = null;

    if (message !== '') {
      if (!this.props.noTruncate) {
        const truncated = this.truncate(message);
        // truncate if necessary
        if (message.length > truncated.length) {
          if (!this.state.more) message = truncated;
          moreLess = this.getMoreLess();
        }
      }

      body =
        entity.shouldBeBlured() && !entity.mature_visibility ? (
          <MText style={styles.mature}>{message}</MText>
        ) : (
          <Tags
            navigation={this.props.navigation}
            style={this.props.style}
            selectable={this.props.selectable}>
            {message}
          </Tags>
        );
    }

    const titleCmp: React.ReactNode = title ? (
      <Tags
        navigation={this.props.navigation}
        style={[
          this.props.style,
          theme.marginBottom,
          message ? theme.bold : null,
        ]}>
        {title}
      </Tags>
    ) : null;

    const paywalled = !!entity.paywall && !entity.isOwner();

    return (
      <View style={paywalled ? styles.paywalled : null}>
        {titleCmp}
        {body}
        {moreLess}
        {explicitToggle}
        {paywalled && this.renderGradient()}
      </View>
    );
  }

  renderGradient() {
    return (
      <LinearGradient colors={this.gradientColors} style={styles.linear} />
    );
  }

  /**
   * Truncate text
   */
  truncate(message: string) {
    const limit = this.getTextLimit();

    let truncated = false;
    let lines: Array<string> = message.split('\n');
    if (lines.length > 20) {
      lines = lines.slice(0, 20);
      truncated = true;
    }

    const strLines = lines.join('\n');
    if (strLines.length > limit) {
      return strLines.substr(0, limit) + '...';
    }
    return strLines + (truncated ? '...' : '');
  }

  /**
   * Get text char limit based on screen height
   */
  getTextLimit() {
    return this.state.height * 0.5;
  }

  /**
   * Returns more or less button
   */
  getMoreLess() {
    const msg = this.state.more ? sp.i18n.t('showLess') : sp.i18n.t('readMore');
    return (
      <MText style={readmoreStyle} onPress={this.toggleReadMore}>
        {msg}
      </MText>
    );
  }

  /**
   * Toggle read more
   */
  toggleReadMore = () => {
    this.setState({ more: !this.state.more });
  };
}

const styles = StyleSheet.create({
  paywalled: {
    maxHeight: 70,
    overflow: 'hidden',
    flex: 1,
  },
  linear: {
    position: 'absolute',
    height: 50,
    width: '100%',
    left: 0,
    bottom: 0,
    zIndex: 9999,
  },
  mature: {
    ...Platform.select({
      ios: {
        color: 'rgba(255, 255, 255, 0.1)',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        color: 'transparent',
        textShadowColor: 'rgba(107, 107, 107, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20,
      },
    }),
  },
});

const readmoreStyle = sp.styles.combine('colorLink', 'paddingTop');
