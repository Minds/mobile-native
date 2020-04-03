//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  View,
  TextInput,
} from 'react-native';

import Button from '../common/components/Button';

import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';


/**
 * Comment editor
 */
export default class CommentEditor extends Component {

  state = {
    text: ''
  }

  /**
   * set the initial text
   */
  componentWillMount() {
    this.setState({
      text: this.props.comment.description
    });
  }

  /**
   * Cancel editing
   */
  cancel = () => {
    this.props.setEditing(false);
  }

  /**
   * Update comment
   */
  update = () => {
    this.props.store.updateComment(this.props.comment, this.state.text)
      .catch((err) => {
        logService.exception('error updating comment', err);
      })
      .finally(() => {
        this.props.setEditing(false);
      });
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.columnStretch, theme.padding2x]}>
        <TextInput
          style={[CommonStyle.flexContainer, CommonStyle.borderGreyed, theme.colorPrimaryText, theme.marginBottom2x]}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
        />
        <View style={CommonStyle.rowJustifyEnd}>
          <Button text={i18n.t('cancel')} onPress={this.cancel} containerStyle={theme.paddingHorizontal2x} />
          <Button text={i18n.t('save')} onPress={this.update} loading={this.props.store.saving} containerStyle={[theme.marginLeft2x, theme.paddingHorizontal2x]}/>
        </View>
      </View>
    )
  }
}