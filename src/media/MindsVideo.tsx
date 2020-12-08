import _ from 'lodash';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  PanResponder,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
// workaround to fix tooltips on android
import Tooltip from 'rne-modal-tooltip';
import type CommentModel from '../comments/CommentModel';
import ActivityIndicator from '../common/components/ActivityIndicator';
import ExplicitImage from '../common/components/explicit/ExplicitImage';
import getVideoThumb from '../common/helpers/get-video-thumbnail';
import apiService from '../common/services/api.service';
import attachmentService from '../common/services/attachment.service';
import featuresService from '../common/services/features.service';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import videoPlayerService from '../common/services/video-player.service';
import { UserError } from '../common/UserError';
import NavigationService from '../navigation/NavigationService';
import type ActivityModel from '../newsfeed/ActivityModel';
import settingsStore from '../settings/SettingsStore';
import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import ProgressBar from './ProgressBar';

let FORWARD_DURATION = 7;

const isIOS = Platform.OS === 'ios';

type Source = {
  src: string;
  size: number;
};

type StateType = {
  paused: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  loaded: boolean;
  active: boolean;
  showOverlay: boolean;
  fullScreen: boolean;
  error: boolean;
  inProgress: boolean;
  video: any;
  transcoding: boolean;
  sources: Array<Source> | null;
  source: number;
  forceHideOverlay: boolean;
};

type PropsType = {
  entity?: ActivityModel | CommentModel;
  pause?: boolean;
  repeat?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'none';
  video?: { uri: string };
  containerStyle?: StyleProp<ViewStyle>;
  onLoad?: (e: any) => void;
  ignoreDataSaver?: boolean;
};

@observer
class MindsVideo extends Component<PropsType, StateType> {
  onScreenBlur?: () => void;
  player?: Video;
  _panResponder: any;

  /**
   * Constructor
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      paused: props.pause !== undefined ? props.pause : true,
      volume: 1,
      currentTime: 0,
      duration: 0,
      loaded: true,
      active: !props.entity,
      showOverlay: true,
      forceHideOverlay: false,
      fullScreen: false,
      error: false,
      inProgress: false,
      video: {},
      transcoding: false,
      sources: null,
      source: 0,
    };
  }

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.video && nextProps.video.uri !== prevState.video.uri) {
      return {
        video: { uri: nextProps.video.uri },
      };
    }
    return null;
  }

  /**
   * On component will mount
   */
  componentDidMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
    });
    if (NavigationService && NavigationService.addListener) {
      this.onScreenBlur = NavigationService.addListener('blur', () => {
        this.pause();
      });
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    if (this.onScreenBlur) {
      this.onScreenBlur();
    }
    if (videoPlayerService.current === this) {
      videoPlayerService.clear();
    }
  }

  /**
   * On video end
   */
  onVideoEnd = () => {
    this.setState({ currentTime: 0, paused: true }, () => {
      this.player.seek(0);
    });
  };

  /**
   * On video load
   */
  onVideoLoad = (e) => {
    const current = e.currentTime;

    this.setState({
      loaded: false,
      currentTime: current,
      duration: e.duration,
    });
    this.player.seek(current);

    this.onLoadEnd();

    if (this.props.onLoad) {
      this.props.onLoad(e);
    }
  };

  /**
   * On load start
   */
  onLoadStart = () => {
    this.setState({ error: false, inProgress: true });
  };

  /**
   * On error
   */
  onError = async (err) => {
    const entity = this.props.entity;

    // entity is null only on video previews.
    if (!entity) {
      return;
    }
    try {
      const response: any = await attachmentService.isTranscoding(
        entity.entity_guid,
      );
      if (response.transcoding) {
        this.setState({ transcoding: true });
      } else {
        logService.exception('[MindsVideo]', new UserError(err));
        this.setState({ error: true, inProgress: false });
      }
    } catch (error) {
      logService.exception('[MindsVideo]', new UserError(error));
      this.setState({ error: true, inProgress: false });
    }
  };

  /**
   * On load end
   */
  onLoadEnd = () => {
    this.setState({ error: false, inProgress: false });
  };

  /**
   * Toggle sound
   */
  toggleVolume = () => {
    const v = this.state.volume ? 0 : 1;
    this.setState({ volume: v });
  };

  setForceHideOverlay = (forceHideOverlay: boolean) => {
    this.setState({ forceHideOverlay });
  };

  /**
   * Mute video
   */
  mute() {
    this.setState({ volume: 0 });
  }

  /**
   * On progress
   */
  onProgress = (e) => {
    this.setState({ currentTime: e.currentTime });
  };

  /**
   * On backward
   * @param {number} currentTime
   */
  onBackward(currentTime) {
    let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
    this.player.seek(newTime);
    this.setState({ currentTime: newTime });
  }

  /**
   * On forward
   * @param {number} currentTime
   * @param {number} duration
   */
  onForward(currentTime, duration) {
    if (currentTime + FORWARD_DURATION > duration) {
      this.onVideoEnd();
    } else {
      let newTime = currentTime + FORWARD_DURATION;
      this.player.seek(newTime);
      this.setState({ currentTime: newTime });
    }
  }

  /**
   * Get current time percentage
   * @param {number} currentTime
   * @param {number} duration
   */
  getCurrentTimePercentage(currentTime, duration) {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(duration);
    } else {
      return 0;
    }
  }

  /**
   * On progress changed
   * @param {number} newPercent
   * @param {boolean} paused
   */
  onProgressChanged = (newPercent, paused) => {
    let { duration } = this.state;
    let newTime = (newPercent * duration) / 100;
    this.setState({ currentTime: newTime, paused: paused });
    this.player.seek(newTime);
  };

  /**
   * Toggle full-screen
   */
  toggleFullscreen = () => {
    this.setState({ fullScreen: !this.state.fullScreen });
  };

  /**
   * Play the current video and activate the player
   */
  play = async (sound: boolean = true) => {
    videoPlayerService.setCurrent(this);

    const state: any = {
      active: true,
      volume: sound ? 1 : 0,
      showOverlay: false,
      paused: false,
      sources: [] as Array<Source>,
    };

    if (!this.state.sources && this.props.entity) {
      if (this.props.entity.paywall && featuresService.has('paywall-2020')) {
        await this.props.entity.unlockOrPay();
        if (this.props.entity.paywall) {
          return;
        }
      }

      const response: any = await attachmentService.getVideoSources(
        this.props.entity.attachments &&
          this.props.entity.attachments.attachment_guid
          ? this.props.entity.attachments.attachment_guid
          : this.props.entity.entity_guid || this.props.entity.guid,
      );

      state.sources = response.sources.filter((v) => v.type === 'video/mp4');

      if (Array.isArray(state.sources) && state.sources.length > 0) {
        state.video = {
          uri: state.sources[0].src,
          headers: apiService.buildHeaders(),
        };
      }
    } else {
      console.log('NO SOURCES!');
    }

    this.setState(state);
  };

  /**
   * Pause the video
   */
  pause = () => {
    this.setState({
      paused: true,
    });
  };

  /**
   * Play button
   */
  get play_button() {
    const size = 56;
    if (this.state.paused) {
      return (
        <Icon
          onPress={this.play as () => void}
          style={styles.videoIcon}
          name="md-play-circle"
          size={size}
          color={colors.light}
        />
      );
    }

    return (
      <Icon
        onPress={this.pause}
        style={styles.videoIcon}
        name="md-pause"
        size={size}
        color={colors.light}
      />
    );
  }

  /**
   * Show control overlay (hide debounced 4 seconds)
   */
  openControlOverlay = () => {
    //this.play();
    if (!this.state.showOverlay) {
      this.setState({
        showOverlay: true,
      });
    }

    this.hideOverlay();
  };

  setShowOverlay = (showOverlay: boolean) => {
    if (showOverlay) {
      this.openControlOverlay();
    } else {
      if (this.state.showOverlay) {
        this.setState({
          showOverlay: false,
        });
      }
    }
  };

  /**
   * Hide overlay
   */
  hideOverlay = _.debounce(() => {
    if (this.state.showOverlay) {
      this.setState({
        showOverlay: false,
      });
    }
  }, 4000);

  /**
   * Full screen icon
   */
  get fullScreen() {
    return (
      <Icon
        onPress={this.toggleFullscreen}
        name="ios-expand"
        size={23}
        color={colors.light}
        style={CS.paddingLeft}
      />
    );
  }

  /**
   * Settings icon
   */
  get settingsIcon() {
    if (!this.props.entity) {
      return null;
    }
    return (
      <View style={styles.controlSettingsContainer}>
        <Tooltip
          popover={this.sourceSelector}
          withOverlay={false}
          height={60}
          onOpen={this.openControlOverlay}
          backgroundColor="rgba(48,48,48,0.7)">
          <Icon
            name="ios-settings"
            size={23}
            color={colors.light}
            style={CS.paddingLeft}
          />
        </Tooltip>
      </View>
    );
  }

  /**
   * Source selector
   */
  get sourceSelector() {
    if (!this.state.sources) {
      return null;
    }
    return (
      <View>
        {this.state.sources.map((s, i) => (
          <Text
            style={[
              CS.colorWhite,
              CS.fontL,
              CS.paddingBottom,
              i === this.state.source ? CS.bold : null,
            ]}
            onPress={() => this.setState({ source: i })}>
            {s.size}p
          </Text>
        ))}
      </View>
    );
  }

  changeSource(index) {
    if (!this.state.sources || !this.state.sources[index]) {
      return;
    }
    this.setState({
      source: index,
      video: {
        uri: this.state.sources[index].src,
        headers: apiService.buildHeaders(),
      },
    });
  }

  get volumeIcon() {
    if (this.state.volume === 0) {
      return (
        <Icon
          onPress={this.toggleVolume}
          name="ios-volume-off"
          size={23}
          color={colors.light}
        />
      );
    } else {
      return (
        <Icon
          onPress={this.toggleVolume}
          name="ios-volume-high"
          size={23}
          color={colors.light}
        />
      );
    }
  }

  /**
   * Set the reference to the video player
   */
  setRef = (ref) => {
    this.player = ref;
  };

  onFullscreenPlayerDidDismiss = () => {
    this.setState({ fullScreen: false, paused: true });
  };

  /**
   * Get video component or thumb
   */
  get video() {
    let { entity, ignoreDataSaver } = this.props;
    let { paused } = this.state;
    const dataSaverEnabled = !ignoreDataSaver && settingsStore.dataSaverEnabled;
    const posterSource = getVideoThumb(entity, 1024);
    const thumbnailSource =
      entity && dataSaverEnabled ? getVideoThumb(entity, 16) : undefined;

    if (this.state.active || !posterSource) {
      return (
        <Video
          key={`video${this.state.source}`}
          ref={this.setRef}
          volume={this.state.volume}
          onEnd={this.onVideoEnd}
          onLoadStart={this.onLoadStart}
          onLoad={this.onVideoLoad}
          onProgress={this.onProgress}
          onError={this.onError}
          ignoreSilentSwitch={'obey'}
          source={this.state.video}
          paused={paused}
          repeat={this.props.repeat || false}
          fullscreen={this.state.fullScreen}
          onFullscreenPlayerDidDismiss={this.onFullscreenPlayerDidDismiss}
          resizeMode={this.props.resizeMode || 'contain'}
          controls={false}
          style={CS.flexContainer}
        />
      );
    } else {
      return (
        <ExplicitImage
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={posterSource}
          thumbnail={thumbnailSource}
          entity={entity}
        />
      );
    }
  }

  /**
   * Render overlay
   */
  renderOverlay() {
    // no overlay on full screen
    if (this.state.fullScreen) {
      return null;
    }

    const entity = this.props.entity;
    let { currentTime, duration } = this.state;

    const mustShow =
      this.state.showOverlay ||
      (!this.state.forceHideOverlay && this.state.paused && entity);

    if (mustShow) {
      const completedPercentage =
        this.getCurrentTimePercentage(currentTime, duration) * 100;
      const progressBar = (
        <View style={styles.progressBarContainer}>
          <ProgressBar
            duration={duration}
            currentTime={currentTime}
            percent={completedPercentage}
            onNewPercent={this.onProgressChanged}
          />
        </View>
      );

      return (
        <TouchableWithoutFeedback
          style={styles.controlOverlayContainer}
          onPress={this.openControlOverlay}>
          <View style={styles.controlOverlayContainer}>
            <View style={[CS.positionAbsolute, CS.centered, CS.marginTop2x]}>
              {this.play_button}
            </View>
            {this.player && this.settingsIcon}
            {this.player && (
              <View style={styles.controlBarContainer}>
                {isIOS && (
                  <View
                    style={[
                      CS.padding,
                      CS.rowJustifySpaceEvenly,
                      CS.marginRight,
                    ]}>
                    {this.fullScreen}
                  </View>
                )}
                {progressBar}
                <View style={[CS.padding, CS.rowJustifySpaceEvenly]}>
                  {this.volumeIcon}
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return null;
  }

  /**
   * Render error overlay
   */
  renderErrorOverlay() {
    return (
      <View style={styles.controlOverlayContainer}>
        <Text style={styles.errorText}>{i18n.t('errorMediaDisplay')}</Text>
      </View>
    );
  }

  /**
   * Render in progress overlay
   */
  renderInProgressOverlay() {
    return (
      <View
        style={[
          styles.controlOverlayContainer,
          styles.controlOverlayContainerTransparent,
        ]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * Render transcoding overlay
   */
  renderTranscodingOverlay() {
    return (
      <View
        style={[
          styles.controlOverlayContainer,
          styles.controlOverlayContainerTransparent,
        ]}>
        <Text style={styles.errorText}>
          {i18n.t('transcodingMediaDisplay')}
        </Text>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    const { error, inProgress, transcoding } = this.state;

    const overlay = this.renderOverlay();
    return (
      <View
        style={[
          CS.flexContainer,
          CS.backgroundBlack,
          this.props.containerStyle,
        ]}>
        <TouchableWithoutFeedback
          style={CS.flexContainer}
          onPress={this.openControlOverlay}>
          {this.video}
        </TouchableWithoutFeedback>
        {inProgress && this.renderInProgressOverlay()}
        {!inProgress && error && this.renderErrorOverlay()}
        {transcoding && this.renderTranscodingOverlay()}
        {!inProgress && !error && !transcoding && overlay}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  controlOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlOverlayContainerTransparent: {
    backgroundColor: 'transparent',
  },
  controlPlayButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.darkGreyed,
  },
  controlSettingsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
    paddingRight: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(48,48,48,0.7)',
  },
  controlBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    backgroundColor: 'rgba(48,48,48,0.7)',
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullScreen: { backgroundColor: 'black' },
  progressBar: {
    alignSelf: 'stretch',
    margin: 20,
  },
  videoIcon: {
    position: 'relative',
    alignSelf: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

export default MindsVideo;
