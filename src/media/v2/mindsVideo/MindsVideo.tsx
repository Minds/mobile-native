import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalStore } from 'mobx-react';

// workaround to fix tooltips on android
import Tooltip from 'rne-modal-tooltip';

import {
  PanResponder,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  Platform,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Video } from 'expo-av';

import _ from 'lodash';

import ProgressBar from '../../ProgressBar';

import Icon from 'react-native-vector-icons/Ionicons';

import ExplicitImage from '../../../common/components/explicit/ExplicitImage';
import logService from '../../../common/services/log.service';
import i18n from '../../../common/services/i18n.service';
import attachmentService from '../../../common/services/attachment.service';
import videoPlayerService from '../../../common/services/video-player.service';
import apiService from '../../../common/services/api.service';
import NavigationService from '../../../navigation/NavigationService';
import type CommentModel from '../../../comments/CommentModel';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import featuresService from '../../../common/services/features.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import createMindsVideoStore from './createMindsVideoStore';

const isIOS = Platform.OS === 'ios';

type Source = {
  src: string;
  size: number;
};

type PropsType = {
  entity?: ActivityModel | CommentModel;
  pause?: boolean;
  repeat?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'none';
  video?: { uri: string };
  containerStyle?: StyleProp<ViewStyle>;
};

const MindsVideo = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createMindsVideoStore);
  const videoRef = useRef<Video>();

  useEffect(() => {
    let onScreenBlur: any;
    if (!localStore.inited) {
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
      });
      onScreenBlur = NavigationService.addListener('blur', () => {
        localStore.setShouldPlay(false);
      });
    }

    return () => {
      if (onScreenBlur) {
        onScreenBlur();
      }
      if (videoPlayerService.current === MindsVideo) {
        videoPlayerService.clear();
      }
    }
  }, [localStore]);

  return (
    <View
      style={[
        theme.flexContainer,
        theme.backgroundBlack,
        props.containerStyle,
      ]}>
      <TouchableWithoutFeedback
        style={CS.flexContainer}
        onPress={this.openControlOverlay}>
        {video}
      </TouchableWithoutFeedback>
      {inProgress && this.renderInProgressOverlay()}
      {!inProgress && error && this.renderErrorOverlay()}
      {transcoding && this.renderTranscodingOverlay()}
      {!inProgress && !error && !transcoding && overlay}
    </View>
  );
});

export default MindsVideo;
