//@ts-nocheck
import React, { Component } from 'react';

import { observer } from 'mobx-react';
import * as entities from 'entities';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TextStyle,
} from 'react-native';

import Tags from '../../../common/components/Tags';
import colors from '../../../styles/Colors';
import i18n from '../../services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import type ActivityModel from 'src/newsfeed/ActivityModel';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
  style?: TextStyle | Array<TextStyle>;
};

type StateType = {
  more: boolean;
  width: number;
  height: number;
};

@observer
export default class ExplicitText extends Component<PropsType, StateType> {
  needTruncate = false;

  state = {
    more: false,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  /**
   * Handle dimensions changes
   */
  dimensionChange = () => {
    this.setState({
      width: Dimensions.get('window').width,
    });
  };

  /**
   * On component will mount
   */
  componentWillMount() {
    Dimensions.addEventListener('change', this.dimensionChange);
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    // allways remove listeners on unmount
    Dimensions.removeEventListener('change', this.dimensionChange);
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const entity = this.props.entity;

    let title: string = entity.title
      ? entities.decodeHTML(entity.title).trim()
      : '';
    let message = entity.message
      ? entities.decodeHTML(entity.message).trim()
      : '';

    let body = null;
    let moreLess = null;
    let explicitToggle = null;

    if (message !== '') {
      const truncated = this.truncate(message);
      // truncate if necessary
      if (message.length > truncated.length) {
        if (!this.state.more) message = truncated;
        moreLess = this.getMoreLess();
      }

      body =
        entity.shouldBeBlured() && !entity.mature_visibility ? (
          <Text style={styles.mature}>{message}</Text>
        ) : (
          <Tags navigation={this.props.navigation} style={this.props.style}>
            {message}
          </Tags>
        );
    }

    const titleCmp: React.ReactNode = title ? (
      <Tags
        navigation={this.props.navigation}
        style={[this.props.style, theme.fontL, theme.marginBottom]}>
        {title}
      </Tags>
    ) : null;

    return (
      <View style={styles.container}>
        {titleCmp}
        {body}
        {moreLess}
        {explicitToggle}
      </View>
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
    return this.state.height * 1.5;
  }

  /**
   * Returns more or less button
   */
  getMoreLess() {
    const msg = this.state.more ? i18n.t('showLess') : i18n.t('readMore');
    return (
      <Text style={styles.readmore} onPress={this.toggleReadMore}>
        {msg}
      </Text>
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
  container: {
    flex: 1,
  },
  readmore: {
    color: colors.primary,
    marginTop: 5,
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
