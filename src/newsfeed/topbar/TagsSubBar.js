import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';

import {
  inject,
  observer
} from "mobx-react/native";

import { debounce } from 'lodash';

import { CommonStyle as CS } from '../../styles/Common';
import TagOptinModal from '../../common/components/TagOptinModal';
import colors from '../../styles/Colors';

/**
 * Tags Sub Bar Component
 */
@inject('hashtag')
@observer
export default class TagsSubBar extends Component {

  /**
   * Component did mount
   */
  componentDidMount() {
    this.props.hashtag.loadSuggested();
  }

  debouncedOnChange = () => {
    this.props.onChange && this.props.onChange();
  }

  onChange = debounce(this.debouncedOnChange, 700, { leading: false, trailing: true });

  /**
   * Toggle tag
   */
  toogle = async (tag) => {
    try {
      if (tag.selected) {
        await this.props.hashtag.deselect(tag);
      } else {
        await this.props.hashtag.select(tag);
      }

      this.onChange();

    } catch(e) {
      console.log(e);
    }

  }

  showModal = () => {
    this.modal.wrappedInstance.showModal();
  }

  /**
   * Render
   */
  render() {
    // selected first!
    const sorted = this.props.hashtag.suggested.slice().sort((a, b) => !a.selected && b.selected ? 1 : -1);

    return (
      <View style={styles.subbar}>
        <View style={CS.flexContainer}>
          <ScrollView horizontal={true} >
            {sorted.map((tag, i) => <TouchableOpacity style={styles.tag} key={i} onPress={() => this.toogle(tag)}>
              <Text style={[CS.fontS, styles.tagText, tag.selected ? CS.colorPrimary : null]}>#{tag.value}</Text>
            </TouchableOpacity>)}
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.moreButton, CS.alignJustifyCenter]} onPress={this.showModal}>
          <Text style={[CS.fontS, CS.colorWhite]}>MORE</Text>
        </TouchableOpacity>
        <TagOptinModal ref={r => this.modal = r}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  subbar: {
    flex: 1,
    flexDirection: 'row',
    height:29,
    marginTop: 2
  },
  moreButton: {
    width: 55,
    backgroundColor: colors.primary,
    textAlign: 'center',
    borderRadius: 8,
    fontWeight: '500',
    margin: 2
  },
  error: {
    fontFamily: 'Roboto',
    color: 'red',
    textAlign: 'center',
  },
  tag: {
    margin: 2,
    // flexDirection: 'row',
    padding: 1,
    paddingVertical: 5
  },
  tagText: {
    paddingRight: 5
  }
});