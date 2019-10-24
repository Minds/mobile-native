import React, {
  Component,
  PropTypes
} from 'react';

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

import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { CommonStyle as CS } from '../styles/Common';
import colors from '../styles/Colors';
import ExplicitImage from '../common/components/explicit/ExplicitImage';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';

const isIOS = Platform.OS === 'ios';

@observer
class MindsVideo extends Component {

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.state = {
      paused: true,
      volume: 1,
      loaded: true,
      active: false,
      showOverlay: true,
      fullScreen: false,
      error: false,
      inProgress: false,
    };
  }

  /**
   * On component will mount
   */
  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true
    })

    if (!this.props.entity) {
      this.setState({active: true})
    }

    this.onScreenBlur = this.props.navigation.addListener(
      'didBlur',
      () => {
        this.pause();
      }
    );
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.onScreenBlur.remove();
  }

  onVideoEnd = () => {
    this.setState({key: new Date(), currentTime: 0, paused: true}, () => {
      this.player.seek(0);
    });
  }

  onVideoLoad = (e) => {
    let current = 0;
    if (this.state.changedModeTime > 0) {
      current = this.state.changedModeTime;
    } else {
      current = e.currentTime;
    }

    this.setState({loaded: false, currentTime: current, duration: e.duration});
    this.player.seek(current)

    this.onLoadEnd();
  }

  onLoadStart = () => {
    this.setState({ error: false, inProgress: true, });
  };

  onError = (err) => {
    logService.exception('[MindsVideo]', err)
    this.setState({ error: true, inProgress: false, });
  };

  onLoadEnd = () => {
    this.setState({ error: false, inProgress: false, });
  };

  toggleVolume = () => {
    const v = this.state.volume ? 0 : 1;
    this.setState({volume: v});
  }

  onProgress = (e) => {
    this.setState({currentTime: e.currentTime});
  }

  onBackward(currentTime) {
    let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
    this.player.seek(newTime);
    this.setState({currentTime: newTime})
  }

  onForward(currentTime, duration) {
    if (currentTime + FORWARD_DURATION > duration) {
      this.onVideoEnd();
    } else {
      let newTime = currentTime + FORWARD_DURATION;
      this.player.seek(newTime);
      this.setState({currentTime: newTime});
    }
  }

  getCurrentTimePercentage(currentTime, duration) {
    if (currentTime > 0) {
      return parseFloat(currentTime) / parseFloat(duration);
    } else {
      return 0;
    }
  }

  onProgressChanged(newPercent, paused) {
    let {duration} = this.state;
    let newTime = newPercent * duration / 100;
    this.setState({currentTime: newTime, paused: paused});
    this.player.seek(newTime);
  }

  toggleFullscreen = () => {
    this.setState({fullScreen: !this.state.fullScreen});
  }

  play = () => {
    this.setState({
      showOverlay: false,
    });

    this.setState({
      active: true,
      paused: false,
    });
  }

  pause = () => {
    this.setState({
      paused: true,
    });
  }

  get play_button() {
    const size = 56;
    if (this.state.paused) {
      return <Icon
        onPress={this.play}
        style={styles.videoIcon}
        name="md-play"
        size={size}
        color={colors.light}
        />;
    }

    return <Icon
      onPress={this.pause}
      style={styles.videoIcon}
      name="md-pause"
      size={size}
      color={colors.light}
      />;
  }

  openControlOverlay = () => {
    if (!this.state.showOverlay) {
      this.setState({
        showOverlay: true,
      });
    }

    this.hideOverlay();
  }

  hideOverlay = _.debounce(() => {
    if (this.state.showOverlay) {
      this.setState({
        showOverlay: false,
      });
    }
  }, 4000)

  get fullScreen() {
    return <Icon onPress={this.toggleFullscreen} name="md-resize" size={23} color={colors.light} style={CS.paddingLeft}/>;
  }

  get volumeIcon() {
    if (this.state.volume == 0) {
      return <Icon onPress={this.toggleVolume} name="ios-volume-off" size={23} color={colors.light} />;
    } else {
      return <Icon onPress={this.toggleVolume} name="ios-volume-high" size={23} color={colors.light} />;
    }
  }

  /**
   * Get video component or thumb
   */
  get video() {
    let { video, entity } = this.props;
    let { paused, volume } = this.state;
    const thumb_uri = entity ? (entity.get('custom_data.thumbnail_src') || entity.thumbnail_src) : null;

    if (this.state.active || !thumb_uri) {
      return (
        <Video
          ref={(ref) => {
            this.player = ref
          }}
          volume={parseFloat(this.state.volume)}
          onEnd={this.onVideoEnd}
          onLoadStart={this.onLoadStart}
          onLoad={this.onVideoLoad}
          onProgress = {this.onProgress}
          onError={this.onError}
          ignoreSilentSwitch={'obey'}
          source={{ uri: video.uri.replace('file://',''), type: 'mp4' }}
          paused={paused}
          fullscreen={this.state.fullScreen}
          resizeMode={"contain"}
          controls={isIOS}
          style={CS.flexContainer}
        />
      )
    } else {
      const image = { uri: thumb_uri };
      return (
        <ExplicitImage
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={image}
          entity={entity}
          style={[CS.positionAbsolute]}
          // loadingIndicator="placeholder"
        />
      )
    }
  }

  /**
   * Render overlay
   */
  renderOverlay() {

    // no overlay on full screen
    if (this.state.fullScreen) return null;

    const entity = this.props.entity;
    let {currentTime, duration, paused} = this.state;

    const mustShow = (this.state.showOverlay && !isIOS) || this.state.paused;

    if (mustShow) {
      const completedPercentage = this.getCurrentTimePercentage(currentTime, duration) * 100;
      const progressBar = (
        <View style={styles.progressBarContainer}>
          <ProgressBar duration={duration}
            currentTime={currentTime}
            percent={completedPercentage}
            onNewPercent={this.onProgressChanged.bind(this)}
            />
        </View>
      );

      return (
        <TouchableWithoutFeedback
        style={styles.controlOverlayContainer}
        onPress={this.openControlOverlay}
        >
          <View style={styles.controlOverlayContainer}>
            <View style={[CS.positionAbsolute, CS.centered, CS.marginTop2x]}>
              {this.play_button}
            </View>
            { (this.player && !isIOS) && <View style={styles.controlBarContainer}>
              { progressBar }
              <View style={[CS.padding, CS.rowJustifySpaceEvenly]}>
                {this.volumeIcon}
              </View>
            </View> }
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return null;
  }

  renderErrorOverlay() {
    return (
      <View style={styles.controlOverlayContainer}>
        <Text
          style={styles.errorText}
        >{i18n.t('errorMediaDisplay')}</Text>
      </View>
    );
  }

  renderInProgressOverlay() {
    return (<View style={[styles.controlOverlayContainer, styles.controlOverlayContainerTransparent]}>
      <ActivityIndicator size="large" />
    </View>);
  }

  /**
   * Render
   */
  render() {
    const { error, inProgress } = this.state;

    const overlay = this.renderOverlay();
    return (
      <View style={[CS.flexContainer, CS.backgroundBlack]} >
        <TouchableWithoutFeedback
          style={CS.flexContainer}
          onPress={this.openControlOverlay}
          >
          { this.video }
        </TouchableWithoutFeedback>
        { inProgress && this.renderInProgressOverlay() }
        { !inProgress && error && this.renderErrorOverlay() }
        { !inProgress && !error && overlay }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  controlOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right:0,
    bottom:0,
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
  controlBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
    alignItems: 'stretch',
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    backgroundColor: 'rgba(48,48,48,0.7)'
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullScreen: {backgroundColor: "black"},
  progressBar: {
    alignSelf: "stretch",
    margin: 20
  },
  videoIcon: {
    position: "relative",
    alignSelf: "center",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  }
});

export default withNavigation(MindsVideo);
