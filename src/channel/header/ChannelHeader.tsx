//@ts-nocheck
import React, { Component } from 'react';

import { View, Text, TextInput, Image, TouchableHighlight } from 'react-native';

import { observer, inject } from 'mobx-react';

import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import ReadMore from 'react-native-read-more-text';

import abbrev from '../../common/helpers/abbrev';
import ChannelActions from '../ChannelActions';
import Tags from '../../common/components/Tags';
import i18n from '../../common/services/i18n.service';
import session from '../../common/services/session.service';
import Touchable from '../../common/components/Touchable';
import ChannelBadges from '../badges/ChannelBadges';
import { CommonStyle } from '../../styles/Common';
import imagePicker from '../../common/services/image-picker.service';
import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import CompleteProfile from './CompleteProfile';
import featuresService from '../../common/services/features.service';
import ThemedStyles from '../../styles/ThemedStyles';
import remoteAction from '../../common/RemoteAction';

// prevent accidental double tap in touchables
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
const TouchableCustom = withPreventDoubleTap(Touchable);

/**
 * Channel Header
 */
@inject('user', 'onboarding')
@observer
class ChannelHeader extends Component {
  ActionSheetRef;
  loaded;

  state = {
    preview_avatar: null,
    preview_banner: null,
    briefdescription: '',
    name: '',
    saving: false,
    edit: false,
  };

  uploads = {
    avatar: null,
    banner: null,
  };

  /**
   * Get Channel Banner
   */
  getBannerFromChannel() {
    if (this.state.preview_banner) {
      return { uri: this.state.preview_banner };
    }

    return this.props.store.channel.getBannerSource();
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.store.channel.getAvatarSource('large');
  }

  _navToSubscribers() {
    if (this.props.navigation) {
      this.props.navigation.push('Subscribers', {
        guid: this.props.store.channel.guid,
      });
    }
  }

  componentDidMount() {
    const isOwner = session.guid === this.props.store.channel.guid;
    if (isOwner && !featuresService.has('onboarding-december-2019'))
      this.props.onboarding.getProgress();
  }

  onEditAction = async () => {
    let editing = this.state.edit,
      payload = null;

    if (editing) {
      payload = {
        briefdescription: this.state.briefdescription,
        name: this.state.name,
        avatar: this.uploads.avatar,
        banner: this.uploads.banner,
        mode: this.props.store.channel.mode || 0,
      };

      this.setState({ saving: true });

      await remoteAction(async () => {
        let response;

        try {
          response = await this.props.store.save(payload);
        } finally {
          this.setState({ saving: false });
        }

        if (response === true) {
          this.props.user.load();
          this.setState({ saving: false, edit: false });
          this.uploads = {
            avatar: null,
            banner: null,
          };
        } else {
          this.setState({ saving: false });
        }
      });
    } else {
      this.setState({
        edit: true,
        preview_avatar: null,
        preview_banner: null,
        briefdescription: this.props.store.channel.briefdescription,
        name: this.props.store.channel.name,
      });
    }
  };

  onViewScheduledAction = async () => {
    this.props.store.feedStore.toggleScheduled();
  };

  subscribe() {
    this.props.store.channel.toggleSubscription();
  }

  changeBannerAction = async () => {
    imagePicker
      .show(i18n.t('channel.selectBanner'), 'photo')
      .then((response) => {
        if (response) {
          this.selectMedia('banner', response);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  changeAvatarAction = async () => {
    if (!this.state.edit) return;
    imagePicker
      .show(i18n.t('channel.selectAvatar'), 'photo')
      .then((response) => {
        if (response) {
          this.selectMedia('avatar', response);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  selectMedia(type, file) {
    this.setState({
      [`preview_${type}`]: file.uri,
    });

    this.uploads[type] = file;
  }

  setBriefdescription = (briefdescription) =>
    this.setState({ briefdescription });
  setName = (name) => this.setState({ name });

  /**
   * Truncated footer render for description
   */
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={[
          CommonStyle.fontM,
          CommonStyle.colorPrimary,
          CommonStyle.marginTop2x,
        ]}
        onPress={handlePress}>
        {i18n.t('readMore')}
      </Text>
    );
  };
  /**
   * Revealed footer render for description
   */
  _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={[
          CommonStyle.fontM,
          CommonStyle.colorPrimary,
          CommonStyle.marginTop2x,
        ]}
        onPress={handlePress}>
        {i18n.t('showLess')}
      </Text>
    );
  };

  /**
   * Render Header
   */
  render() {
    const isOwner = session.guid === this.props.store.channel.guid;
    const channel = this.props.store.channel;
    const styles = this.props.styles;
    const avatar = this.getAvatar();
    const iurl = this.getBannerFromChannel();
    const isUploading = this.props.store.isUploading;
    const isEditable = this.state.edit && !isUploading;

    const ImageCmp = this.state.preview_banner ? Image : FastImage;
    const theme = ThemedStyles.style;

    return (
      <View>
        <TouchableCustom
          onPress={this.changeBannerAction}
          disabled={!isEditable}>
          <ImageCmp
            source={iurl}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.cover}
          />

          {isEditable && (
            <View style={styles.tapOverlayView}>
              <Icon name="md-create" size={30} color="#fff" />
            </View>
          )}
          {isUploading && this.props.store.bannerProgress ? (
            <View style={styles.tapOverlayView}>
              <Progress.Pie
                progress={this.props.store.bannerProgress}
                size={36}
              />
            </View>
          ) : null}
        </TouchableCustom>

        <ChannelBadges
          channel={channel}
          style={{ position: 'absolute', right: 5, top: 160 }}
        />

        <View style={[styles.headertextcontainer, theme.backgroundSecondary]}>
          <View style={styles.countercontainer}>
            <TouchableHighlightCustom
              underlayColor="transparent"
              style={[styles.counter]}
              onPress={() => {
                this._navToSubscribers();
              }}>
              <View style={styles.counter} testID="SubscribersView">
                <Text style={[styles.countertitle, theme.colorPrimaryText]}>
                  {i18n.t('subscribers').toUpperCase()}
                </Text>
                <Text style={[styles.countervalue, theme.colorPrimaryText]}>
                  {abbrev(channel.subscribers_count, 0)}
                </Text>
              </View>
            </TouchableHighlightCustom>
            <View style={styles.counter} testID="ViewsView">
              <Text style={[styles.countertitle, theme.colorPrimaryText]}>
                {i18n.t('views').toUpperCase()}
              </Text>
              <Text style={[styles.countervalue, theme.colorPrimaryText]}>
                {abbrev(channel.impressions, 0)}
              </Text>
            </View>
          </View>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              {isEditable && (
                <TextInput
                  placeholder={channel.username}
                  underlineColorAndroid="transparent"
                  style={styles.nameTextInput}
                  value={this.state.name}
                  onChangeText={this.setName}
                  testID="ChannelNameTextInput"
                />
              )}
              {!isEditable && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  testID="ChannelNameView">
                  <Text
                    style={[styles.name, theme.colorPrimaryText]}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {channel.name}
                  </Text>
                </View>
              )}
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
          </View>
          <View style={styles.buttonscol}>
            <ChannelActions
              navigation={this.props.navigation}
              store={this.props.store}
              onEditAction={this.onEditAction}
              onViewScheduledAction={this.onViewScheduledAction}
              editing={this.state.edit}
              saving={this.state.saving}
            />
          </View>
          {isEditable && (
            <View style={styles.briefdescriptionTextInputView}>
              <TextInput
                placeholder={i18n.t('channel.briefDescription')}
                multiline={true}
                underlineColorAndroid="transparent"
                style={styles.briefdescriptionTextInput}
                value={this.state.briefdescription}
                onChangeText={this.setBriefdescription}
              />
            </View>
          )}
          {!isEditable && (
            <View style={CommonStyle.paddingTop2x}>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}>
                <Tags navigation={this.props.navigation}>
                  {channel.briefdescription}
                </Tags>
              </ReadMore>
            </View>
          )}
          {!isEditable && channel.city ? (
            <View
              style={[
                CommonStyle.paddingTop2x,
                CommonStyle.flexContainer,
                CommonStyle.rowJustifyStart,
              ]}>
              <Icon name="md-pin" size={24} style={styles.name} />
              <Text style={CommonStyle.marginLeft1x}>{channel.city}</Text>
            </View>
          ) : null}
        </View>

        <TouchableCustom
          onPress={this.changeAvatarAction}
          style={styles.avatar}
          disabled={!isEditable}>
          <Image source={avatar} style={styles.wrappedAvatar} />

          {isEditable && (
            <View
              style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
              <Icon name="md-create" size={30} color="#fff" />
            </View>
          )}
          {isUploading && this.props.store.avatarProgress ? (
            <View
              style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
              <Progress.Pie
                progress={this.props.store.avatarProgress}
                size={36}
              />
            </View>
          ) : null}
        </TouchableCustom>
        {isOwner &&
        !featuresService.has('onboarding-december-2019') &&
        this.props.onboarding.percentage < 1 ? (
          <CompleteProfile progress={this.props.onboarding.percentage} />
        ) : null}
      </View>
    );
  }
}

export default ChannelHeader;
