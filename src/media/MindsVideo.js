import React, {Component} from 'react';

// workaround to fix tooltips on android
import Tooltip from "rne-modal-tooltip";

import {
  PanResponder,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
  Platform,
  View,
} from 'react-native';

import Video from 'react-native-video';
import _ from 'lodash';

import ProgressBar from './ProgressBar';

let FORWARD_DURATION = 7;

import {observer} from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {withNavigation} from 'react-navigation';
import {CommonStyle as CS} from '../styles/Common';
import colors from '../styles/Colors';
import ExplicitImage from '../common/components/explicit/ExplicitImage';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import attachmentService from '../common/services/attachment.service';
import videoPlayerService from '../common/services/video-player.service';
import apiService from '../common/services/api.service';

const isIOS = Platform.OS === 'ios';

@observer
class MindsVideo extends Component {
  /**
   * Constructor
   *
   * @param {*} props
   * @param {*} context
   * @param  {...any} args
   */
  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.state = {
      paused: true,
      volume: 1,
      loaded: true,
      active: !props.entity,
      showOverlay: true,
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
        video: {uri: nextProps.video.uri},
      };
    }
    return null;
  }

  /**
   * On component will mount
   */
  componentDidMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    });

    this.onScreenBlur = this.props.navigation.addListener('didBlur', () => {
      this.pause();
    });
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.onScreenBlur.remove();
    if (videoPlayerService.current === this) {
      videoPlayerService.clear();
    }
  }

  /**
   * On video end
   */
  onVideoEnd = () => {
    this.setState({key: new Date(), currentTime: 0, paused: true}, () => {
      this.player.seek(0);
    });
  };

  /**
   * On video load
   */
  onVideoLoad = e => {
    let current = 0;
    if (this.state.changedModeTime > 0) {
      current = this.state.changedModeTime;
    } else {
      current = e.currentTime;
    }

    this.setState({loaded: false, currentTime: current, duration: e.duration});
    this.player.seek(current);

    this.onLoadEnd();
  };

  /**
   * On load start
   */
  onLoadStart = () => {
    this.setState({error: false, inProgress: true});
  };

  /**
   * On error
   */
  onError = async err => {
    const entity = this.props.entity;
    try {
      const response = await attachmentService.isTranscoding(
        entity.entity_guid,
      );
      if (response.transcoding) {
        this.setState({transcoding: true});
      } else {
        logService.exception('[MindsVideo]', new Error(err));
        this.setState({error: true, inProgress: false});
      }
    } catch (error) {
      logService.exception('[MindsVideo]', new Error(error));
      this.setState({error: true, inProgress: false});
    }
  };

  /**
   * On load end
   */
  onLoadEnd = () => {
    this.setState({error: false, inProgress: false});
  };

  /**
   * Toggle sound
   */
  toggleVolume = () => {
    const v = this.state.volume ? 0 : 1;
    this.setState({volume: v});
  };

  /**
   * On progress
   */
  onProgress = e => {
    this.setState({currentTime: e.currentTime});
  };

  /**
   * On backward
   * @param {number} currentTime
   */
  onBackward(currentTime) {
    let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
    this.player.seek(newTime);
    this.setState({currentTime: newTime});
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
      this.setState({currentTime: newTime});
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
  onProgressChanged(newPercent, paused) {
    let {duration} = this.state;
    let newTime = (newPercent * duration) / 100;
    this.setState({currentTime: newTime, paused: paused});
    this.player.seek(newTime);
  }

  /**
   * Toggle full-screen
   */
  toggleFullscreen = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  };

  /**
   * Play the current video and activate the player
   */
  play = async () => {
    videoPlayerService.setCurrent(this);

    const state = {
      active: true,
      showOverlay: false,
      paused: false,
    };

    if (!this.state.sources && this.props.entity) {
      const response = await attachmentService.getVideoSources(this.props.entity.entity_guid);

      state.sources = response.sources.filter(v => v.type === 'video/mp4');

      state.video = {
        uri: state.sources[0].src,
        headers: apiService.buildHeaders(),
      };
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
          onPress={this.play}
          style={styles.videoIcon}
          name="md-play"
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
    if (!this.state.showOverlay) {
      this.setState({
        showOverlay: true,
      });
    }

    this.hideOverlay();
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
            onPress={() => this.setState({source: i})}>
            {s.size}p
          </Text>
        ))}
      </View>
    );
  }

  changeSource(index) {
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
  setRef = ref => {
    this.player = ref;
  };

  onFullscreenPlayerDidDismiss = () => {
    this.setState({fullScreen: false, paused: true});
  };

  /**
   * Get video component or thumb
   */
  get video() {
    let {video, entity} = this.props;
    let {paused, volume} = this.state;
    const thumb_uri = entity
      ? entity.get('custom_data.thumbnail_src') || entity.thumbnail_src
      : null;
    if (this.state.active || !thumb_uri) {
      return (
        <Video
          key={`video${this.state.source}`}
          ref={this.setRef}
          volume={parseFloat(this.state.volume)}
          onEnd={this.onVideoEnd}
          onLoadStart={this.onLoadStart}
          onLoad={this.onVideoLoad}
          onProgress={this.onProgress}
          onError={this.onError}
          ignoreSilentSwitch={'obey'}
          source={this.state.video}
          paused={paused}
          fullscreen={this.state.fullScreen}
          onFullscreenPlayerDidDismiss={this.onFullscreenPlayerDidDismiss}
          resizeMode={'contain'}
          controls={false}
          style={CS.flexContainer}
        />
      );
    } else {
      const image = {uri: thumb_uri};
      return (
        <ExplicitImage
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={image}
          entity={entity}
          style={[CS.positionAbsolute]}
          // loadingIndicator="placeholder"
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
    let {currentTime, duration, paused} = this.state;

    const mustShow =
      (this.state.showOverlay) || (this.state.paused && entity);

    if (mustShow) {
      const completedPercentage =
        this.getCurrentTimePercentage(currentTime, duration) * 100;
      const progressBar = (
        <View style={styles.progressBarContainer}>
          <ProgressBar
            duration={duration}
            currentTime={currentTime}
            percent={completedPercentage}
            onNewPercent={this.onProgressChanged.bind(this)}
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
                {isIOS && <View style={[CS.padding, CS.rowJustifySpaceEvenly, CS.marginRight]}>
                  {this.fullScreen}
                </View>}
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
    const {error, inProgress, transcoding} = this.state;

    const overlay = this.renderOverlay();
    return (
      <View style={[CS.flexContainer, CS.backgroundBlack]}>
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
  fullScreen: {backgroundColor: 'black'},
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

export default withNavigation(MindsVideo);
