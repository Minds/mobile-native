import React, {
  Component
} from 'react';
import { observer, inject } from 'mobx-react/native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';

import _ from 'lodash';

import { CommonStyle as CS } from '../../styles/Common';

/**
 * Tag Select Component
 */
@inject('hashtag')
@observer
export default class TagSelect extends Component {

  /**
   * Remove tag
   * @param {string} tag
   */
  async toogle(tag) {
    if (tag.selected) {
      await this.props.onTagDeleted(tag)
    } else {
      await this.props.onTagAdded(tag)
    }
    this.onChange();
  }

  /**
   * On change
   */
  onChange() {
    this.props.onChange && this.props.onChange();
  }

  toogleOne = (tag) => {
    const hashstore = this.props.hashtag;
    this.props.onSelectOne && this.props.onSelectOne(hashstore.hashtag !== tag.value ? tag.value : '');
  }

  /**
   * Render
   */
  render() {
    let tags = this.props.tags;
    if (!this.props.disableSort) {
      tags = tags.slice().sort((a, b) => !a.selected && b.selected ? 1 : -1);
    }
    const {
      containerStyle,
      tagStyle,
      tagSelectedStyle,
      textStyle,
      textSelectedStyle
    } = this.props;

    return (
      <ScrollView>
        <View style={[styles.tagContainer, containerStyle]}>
          {tags.map((tag,i) => <TouchableOpacity
              style={[
                styles.tag,
                tagStyle,
                tag.selected ? tagSelectedStyle : null,
                (tag.value === this.props.hashtag.hashtag) ? [CS.borderPrimary, CS.border] : null
              ]}
              key={i}
              onPress={() => this.toogle(tag)}
              onLongPress={() => this.toogleOne(tag)}
              testID={tag.value + 'TestID'}
            >
            <Text style={[styles.tagText, textStyle, tag.selected ? [CS.colorPrimary, textSelectedStyle] : null]}>#{tag.value}</Text>
          </TouchableOpacity>)}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  error: {
    fontFamily: 'Roboto',
    color: 'red',
    textAlign: 'center',
  },
  tag: {
    backgroundColor: '#efefef',
    borderRadius:18,
    margin: 2,
    flexDirection: 'row',
    padding: 8,
  },
  tagText: {
    fontFamily: 'Roboto',
    paddingRight: 5
  },
  tagContainer:{
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    display: 'flex'
  }
});