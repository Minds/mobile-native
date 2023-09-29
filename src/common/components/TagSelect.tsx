import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';
import type { HashtagStore } from '../stores/HashtagStore';

interface PropsType {
  tagStyle?: StyleProp<ViewStyle>;
  tagSelectedStyle?: StyleProp<ViewStyle>;
  textSelectedStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  onTagDeleted: (string) => void;
  onTagAdded: (string) => void;
  tags: Array<{ value: string; selected: boolean }>;
  disableSort?: boolean;
  hashtag?: HashtagStore;
  containerStyle?: ViewStyle;
}

/**
 * Tag Select Component
 */
@inject('hashtag')
@observer
export default class TagSelect extends Component<PropsType> {
  /**
   * Remove tag
   * @param {string} tag
   */
  async toggle(tag) {
    if (tag.selected) {
      await this.props.onTagDeleted(tag);
    } else {
      await this.props.onTagAdded(tag);
    }
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;

    let tags = this.props.tags;
    if (!this.props.disableSort) {
      tags = tags.slice().sort((a, b) => (!a.selected && b.selected ? 1 : -1));
    }
    const {
      containerStyle,
      tagStyle,
      tagSelectedStyle,
      textStyle,
      textSelectedStyle,
    } = this.props;

    return (
      <View style={[styles.tagContainer, containerStyle]}>
        {tags.map((tag, i) => (
          <TouchableOpacity
            style={[
              styles.tag,
              theme.bgPrimaryBackground,
              tagStyle,
              tag.selected ? tagSelectedStyle : null,
              tag.value === this.props.hashtag?.hashtag
                ? [theme.bcolorPrimaryBorder, theme.border]
                : null,
            ]}
            key={i}
            onPress={() => this.toggle(tag)}
            testID={tag.value + 'TestID'}>
            <MText
              style={[
                styles.tagText,
                textStyle,
                tag.selected ? [theme.colorAction, textSelectedStyle] : null,
              ]}>
              #{tag.value}
            </MText>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    fontFamily: 'Roboto_400Regular',
    color: 'red',
    textAlign: 'center',
  },
  tag: {
    borderRadius: 18,
    margin: 2,
    flexDirection: 'row',
    padding: 8,
  },
  tagText: {
    fontFamily: 'Roboto_400Regular',
    paddingRight: 5,
  },
  tagContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    display: 'flex',
  },
});
