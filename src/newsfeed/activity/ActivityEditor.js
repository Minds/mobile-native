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
import NsfwToggle from '../../common/components/nsfw/NsfwToggle';
import autobind from '../../common/helpers/autobind';
import featuresService from '../../common/services/features.service';
import Colors from '../../styles/Colors';

export default class ActivityEditor extends Component {

  state = {
    text: ''
  }

  componentWillMount() {
    this.setState({
      text: this.props.entity.message,
      nsfw: this.props.entity.nsfw || [],
    });
  }

  update = () => {
  
    if(HashtagService.slice(this.state.text).length > HashtagService.maxHashtags){ //if hashtag count greater than 5
      Alert.alert(`Sorry, your post cannot contain more than ${HashtagService.maxHashtags} hashtags.`);
      return false;
    } 

    const data = {
      message: this.state.text,
    };

    if (featuresService.has('top-feeds')) {
      data.nsfw = [...this.state.nsfw];
    }

    this.props.newsfeed.list.updateActivity(this.props.entity, data)
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

  @autobind
  onNsfwChange(nsfw) {
    this.setState({
      nsfw,
    });
  }

  renderNsfwView() {
    if (!featuresService.has('top-feeds')) {
      return null;
    }

    return (
      <View style={[CommonStyle.rowJustifyStart, CommonStyle.paddingTop]}>
        <NsfwToggle
          value={this.state.nsfw}
          onChange={this.onNsfwChange}
          containerStyle={styles.nsfw}
          labelStyle={styles.nsfwLabel}
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
        />
        <View style={styles.buttonBar}>
          {this.renderNsfwView()}

          <View style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingTop]}>
            <Button text="Cancel" onPress={this.cancel} />
            <Button text="Save" color={colors.primary} inverted={true} onPress={this.update} disabled={this.props.newsfeed.list.saving}/>
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
