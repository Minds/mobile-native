import React, {
  Component
} from 'react';

import {
  View,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import Button from '../../common/components/Button';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import HashtagService from '../../common/services/hashtag.service';
import autobind from '../../common/helpers/autobind';
import featuresService from '../../common/services/features.service';
import Colors from '../../styles/Colors';
import logService from '../../common/services/log.service';
import testID from '../../common/helpers/testID';
import { GOOGLE_PLAY_STORE } from '../../config/Config';
import CapturePosterFlags from '../../capture/CapturePosterFlags';
import i18n from '../../common/services/i18n.service';

export default class ActivityEditor extends Component {

  state = {
    text: ''
  }

  componentWillMount() {
    this.setState({
      text: this.props.entity.message,
      wire_threshold: this.props.entity.wire_threshold || null,
      nsfw: this.props.entity.nsfw || [],
    });
  }

  update = () => {

    if (HashtagService.slice(this.state.text).length > HashtagService.maxHashtags){ //if hashtag count greater than 5
      Alert.alert(i18n.t('capture.maxHashtags', {maxHashtags: HashtagService.maxHashtags}));
      return false;
    }

    const data = {
      message: this.state.text,
    };

    data.nsfw = [...this.state.nsfw];

    data.wire_threshold = this.state.wire_threshold;
    if (data.wire_threshold) {
      data.paywall = data.wire_threshold.min > 0;
    } else {
      data.paywall = false;
    }

    this.props.newsfeed.list.updateActivity(this.props.entity, data)
      .catch((err) => {
        logService.exception('[ActivityEditor] update', err);
      })
      .finally(() => {
        this.props.toggleEdit(false);
      });
  }

  cancel = () => {
    this.props.toggleEdit(false);
  }

  @autobind
  onNsfwChange(nsfw) {
    this.setState({
      nsfw,
    });
  }

 @autobind
 onLocking(wire_threshold) {
   this.setState({wire_threshold})
 }

  renderFlagsView() {
    return (
      <View style={[CommonStyle.rowJustifyStart, CommonStyle.paddingTop]}>
        <CapturePosterFlags
          hideShare={true}
          hideHash={true}
          lockValue={this.state.wire_threshold}
          nsfwValue={this.state.nsfw}
          onNsfw={this.onNsfwChange}
          onLocking={this.onLocking}
        />
      </View>
    );
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
          {...testID('Post editor input')}
        />
        <View style={styles.buttonBar}>
          {this.renderFlagsView()}

          <View style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingTop]}>
            <Button text={i18n.t('cancel')} onPress={this.cancel} {...testID('Post editor cancel button')}/>
            <Button text={i18n.t('save')} color={colors.primary} inverted={true} onPress={this.update} disabled={this.props.newsfeed.list.saving} {...testID('Post editor save button')}/>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nsfw: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nsfwLabel: {
    color: Colors.explicit,
    fontWeight: '700',
  },
});
