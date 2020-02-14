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
} from 'mobx-react';

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
    text: '',
    saving: false
  }

  componentWillMount() {
    this.setState({
      text: this.props.entity.message,
      wire_threshold: this.props.entity.wire_threshold || null,
      nsfw: this.props.entity.nsfw || [],
      time_created: this.props.entity.time_created,
    });
  }

  update = async() => {

    if (HashtagService.slice(this.state.text).length > HashtagService.maxHashtags){ //if hashtag count greater than 5
      Alert.alert(i18n.t('capture.maxHashtags', {maxHashtags: HashtagService.maxHashtags}));
      return false;
    }

    const data = {
      message: this.state.text,
      time_created: this.formatTimeCreated(),
    };

    data.nsfw = [...this.state.nsfw];

    data.wire_threshold = this.state.wire_threshold;
    if (data.wire_threshold) {
      data.paywall = data.wire_threshold.min > 0;
    } else {
      data.paywall = false;
    }

    try {
      this.setState({saving: true});
      await this.props.entity.updateActivity(data);
      this.props.toggleEdit(false);
    } catch (err) {
      logService.exception('[ActivityEditor] update', err);
      Alert.alert(
        i18n.t('sorry'),
        i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
        [
          {text: i18n.t('ok'), onPress: () => {}},
        ],
        { cancelable: false }
      );
    } finally {
      this.setState({saving: false});
    }
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

  onScheduled = timeCreated => {
    this.setState({ time_created: timeCreated });
  }

  formatTimeCreated = () => {
    let time_created = this.state.time_created;
    if (!parseInt(this.state.time_created)) {
      time_created = new Date(this.state.time_created).getTime();
      time_created = Math.floor(time_created / 1000);
    }
    return time_created;
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
          timeCreatedValue={this.state.time_created ? new Date(this.state.time_created * 1000) : null}
          onScheduled={this.onScheduled}
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
            <Button text={i18n.t('save')} color={colors.primary} inverted={true} onPress={this.update} disabled={this.state.saving} {...testID('Post editor save button')}/>
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
