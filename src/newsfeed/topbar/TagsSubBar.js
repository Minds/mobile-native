import React, {
  Component
} from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
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
    this.props.onChange && this.props.onChange(this.props.hashtag.all);
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

  /**
   * Show modal
   */
  showModal = () => {
    this.modal.wrappedInstance.showModal();
  }

  /**
   * Toggle all hashtag
   */
  toogleAll = () => {
    this.props.hashtag.toggleAll();
    this.onChange();
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
            <TouchableOpacity style={styles.tag} onPress={this.toogleAll}>
              <Text style={[CS.fontM, CS.fontHairline, styles.tagText, this.props.hashtag.all ? CS.colorPrimary : null]}>#ALL</Text>
            </TouchableOpacity>
            {!this.props.hashtag.all && sorted.map((tag, i) => <TouchableOpacity style={styles.tag} key={i} onPress={() => this.toogle(tag)}>
              <Text style={[CS.fontM, CS.fontHairline, styles.tagText, tag.selected ? CS.colorPrimary : null]}>#{tag.value}</Text>
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
    height:35,
    justifyContent:'center',
    marginTop: 3,
    marginHorizontal: 5
  },
  moreButton: {
    width: 55,
    backgroundColor: colors.primary,
    textAlign: 'center',
    borderRadius: 20,
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
    paddingRight: 5,
    ...Platform.select({
      ios: {
        marginTop: 2,
      },
    }),
  }
});