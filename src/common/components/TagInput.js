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

/**
 * Tag Input Component
 */
@observer
export default class TagInput extends Component {

  state = {
    text: '',
    error:'',
  }

  onChangeText = (text) => {
    text = text.replace(/[^\w]/gim,'');
    this.setState({text, error:''});
  }

  addTag = (e) => {
    const inTags = this.props.tags.some((t) => this.state.text === t);
    if (this.state.text === '') return;
    if (inTags) {
      this.setState({error: 'Tag already exists'});
      return;
    }
    if (this.props.max && this.props.max < this.props.tags.length) {
      this.setState({error: 'You can\'t add more tags'});
      return;
    }
    this.props.onTagAdded({value: this.state.text});
    this.setState({text:''},() => this.inputRef.focus());
  }

  /**
   * Remove tag
   * @param {string} tag
   */
  delete(tag) {
    this.props.onTagDeleted({value: tag});
  }

  /**
   * Render
   */
  render() {
    let tags = null;
    if (!this.props.hideTags) {
      tags = <View style={styles.tagContainer}>
        {this.props.tags.map((t,i) => <View style={styles.tag} key={i} >
          <Text style={styles.tagText}>#{t}</Text><Icon name='ios-close' type='ionicon' size={24} onPress={() => this.delete(t)}/>
        </View>
        )}
      </View>
    }
    return (
      <ScrollView keyboardShouldPersistTaps={'always'}>
        {tags}
        {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}
        <TextInput
          autoCapitalize="none"
          autoFocus={true}
          style={{height: 35, width: '100%', borderColor: '#ccc', borderBottomWidth: 1, padding: 10}}
          ref={r => this.inputRef = r}
          value={this.state.text}
          blurOnSubmit={false}
          onChangeText={this.onChangeText}
          returnKeyType="next"
          keyboardType="default"
          onSubmitEditing={this.addTag}
          onEndEditing={this.addTag}
        />
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