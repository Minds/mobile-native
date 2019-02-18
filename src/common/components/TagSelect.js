import React, {
  Component
} from 'react';
import { observer } from 'mobx-react/native';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';

import _ from 'lodash';

import { CommonStyle } from '../../styles/Common';

/**
 * Tag Select Component
 */
@observer
export default class TagSelect extends Component {

  /**
   * Remove tag
   * @param {string} tag
   */
  toogle(tag) {
    if (tag.selected) {
      this.props.onTagDeleted(tag)
    } else {
      this.props.onTagAdded(tag)
    }
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
          {tags.map((tag,i) => <TouchableOpacity style={[styles.tag, tagStyle, tag.selected ? tagSelectedStyle : null]} key={i} onPress={() => this.toogle(tag)}>
            <Text style={[styles.tagText, textStyle, tag.selected ? [CommonStyle.colorPrimary, textSelectedStyle] : null]}>#{tag.value}</Text>
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