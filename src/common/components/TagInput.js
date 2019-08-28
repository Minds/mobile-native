import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';

import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';

import {Icon} from 'react-native-elements';
import { CommonStyle } from '../../styles/Common';
import i18nService from '../services/i18n.service';

/**
 * Tag Input Component
 */
@observer
export default class TagInput extends Component {

  state = {
    text: '',
    error:'',
  }

  /**
   * On change
   */
  onChange() {
    this.props.onChange && this.props.onChange();
  }

  onChangeText = (text) => {
    text = text.replace(/[^\w]/gim,'');
    this.setState({text, error:''});
  }

  addTag = (e) => {
    const inTags = this.props.tags.some((t) => this.state.text === t);
    if (this.state.text === '') return;
    if (inTags) {
      this.setState({error: i18nService.t('hashtags.exists')});
      return;
    }
    if (this.props.max && this.props.max < this.props.tags.length) {
      this.setState({error: 'You can\'t add more tags'});
      return;
    }
    this.props.onTagAdded({value: this.state.text});
    this.setState({text:''},() => this.inputRef.focus());
    this.onChange();
  }

  /**
   * Remove tag
   * @param {string} tag
   */
  delete(tag) {
    this.props.onTagDeleted({value: tag});
    this.onChange();
  }

  /**
   * Render
   */
  render() {
    let tags = null;
    const autoFocus = this.props.noAutofocus ? false : true;
    const ViewCmp = this.props.noScroll ? View : ScrollView;

    if (!this.props.hideTags) {
      tags = <View style={styles.tagContainer}>
        {this.props.tags.map((t,i) => <View style={styles.tag} key={i} >
          <Text style={styles.tagText}>#{t}</Text><Icon name='ios-close' type='ionicon' size={24} onPress={() => this.delete(t)}/>
        </View>
        )}
      </View>
    }
    return (
      <ViewCmp keyboardShouldPersistTaps={'always'}>
        {tags}
        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}
        <TextInput
          autoCapitalize="none"
          autoFocus={autoFocus}
          style={{height: 35, width: '100%', borderColor: '#ccc', borderBottomWidth: 1, padding: 10}}
          ref={this.setInputRef}
          value={this.state.text}
          blurOnSubmit={false}
          onChangeText={this.onChangeText}
          placeholder="eg. science"
          returnKeyType="next"
          keyboardType="default"
          onSubmitEditing={this.addTag}
          onEndEditing={this.addTag}
        />
      </ViewCmp>

    );
  }

  /**
   * Set input ref
   * @param {TextInputRef} r
   */
  setInputRef = r => this.inputRef = r;
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
    paddingTop: 4,
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