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
    const tags = this.props.tags.slice().sort((a, b) => !a.selected && b.selected ? 1 : -1);

    return (
      <ScrollView>
        <View style={styles.tagContainer}>
          {tags.map((tag,i) => <TouchableOpacity style={styles.tag} key={i} onPress={() => this.toogle(tag)}>
            <Text style={[styles.tagText, tag.selected ? CommonStyle.colorPrimary : null]}>#{tag.value}</Text>
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