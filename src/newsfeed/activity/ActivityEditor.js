import React, {
  Component
} from 'react';

import {
  View,
  TextInput,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import Button from '../../common/components/Button';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';

export default class ActivityEditor extends Component {

  state = {
    text: ''
  }

  componentWillMount() {
    this.setState({
      text: this.props.entity.message
    });
  }

  update = () => {
    this.props.newsfeed.list.updateActivity(this.props.entity, this.state.text)
      .catch((err) => {
        console.log('error updating the post');
      })
      .finally(() => {
        this.props.toggleEdit(false);
      });
  }

  cancel = () => {
    this.props.toggleEdit(false);
  }
  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding]}>
        <TextInput
          style={[{ width: '100%', borderColor: 'gray'}, CommonStyle.borderHair, CommonStyle.padding, CommonStyle.borderRadius2x]}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
        />
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingTop]}>
          <Button text="Cancel" onPress={this.cancel} />
          <Button text="Save" color={colors.primary} inverted={true} onPress={this.update} disabled={this.props.newsfeed.list.saving}/>
        </View>
      </View>
    )
  }
}