import React, {
  Component,
  PropTypes
} from 'react';

import {
  PanResponder,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Video from 'react-native-video';
import _ from 'lodash';

import ProgressBar from './ProgressBar';

import {
  MINDS_URI
} from '../config/Config';

let FORWARD_DURATION = 7;

import { observer, inject } from 'mobx-react/native';
import KeepAwake from 'react-native-keep-awake';
import Icon from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import ExplicitImage from '../common/components/explicit/ExplicitImage';
import en from "../../locales/en";

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
    KeepAwake.deactivate();
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

  onError = () => {
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

  toggleFullscreen() {
    this.setState({fullScreen: !this.state.fullScreen, changedModeTime: this.state.currentTime});
  }

  play = () => {
    this.setState({
      showOverlay: false,
    });

    KeepAwake.activate();

    this.setState({
      active: true,
      paused: false,
    });
  }

  pause = () => {
    KeepAwake.deactivate();

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

  get volumeIcon() {
    if (this.state.volume == 0) {
      return <Icon onPress={this.toggleVolume} name="md-volume-off" size={20} color={colors.light} />;
    } else {
      return <Icon onPress={this.toggleVolume} name="md-volume-up" size={20} color={colors.light} />;
    }
  }

  /**
   * Get video component or thumb
   */
  get video() {
    let { video, entity } = this.props;
    let { paused, volume } = this.state;
    if (this.state.active) {
      return (
        <Video
          ref={(ref) => {
            this.player = ref
          }}
          onLoadStart={this.onLoadStart}
          onLoad={this.onVideoLoad}
          onEnd={this.onVideoEnd}
          onError={this.onError}
          onProgress={this.onProgress}
          source={{ uri: video.uri.replace('file://',''), type: 'mp4' }}
          paused={paused}
          volume={parseFloat(this.state.volume)}
          resizeMode={"contain"}
          style={styles.video}
        />
      )
    } else {
      const image = { uri: entity.get('custom_data.thumbnail_src') || entity.thumbnail_src };
      return (
        <ExplicitImage
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={image}
          entity={entity}
          style={[CommonStyle.positionAbsolute]}
          disableProgress={true}
        />
      )
    }
  }

  /**
   * Render overlay
   */
  renderOverlay() {
    const entity = this.props.entity;
    let {currentTime, duration, paused} = this.state;
    const mustShow = (this.state.showOverlay || this.state.paused) && (!entity || !entity.mature || entity.mature_visibility);

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
            <View style={[styles.controlPlayButtonContainer, CommonStyle.marginTop2x]}>
              {this.play_button}
            </View>
            { this.player && <View style={styles.controlBarContainer}>
              { progressBar }
              <View style={{ padding: 8}}>
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
    return (<View style={[styles.controlOverlayContainer]}>
      <Text
        style={[styles.errorText]}
      >There was an error displaying this media.</Text>
    </View>);
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
    const { video, volume, entity } = this.props;
    const { error, inProgress } = this.state;

    const overlay = this.renderOverlay();

    return (
      <View style={styles.container} >
        <TouchableWithoutFeedback
          style={styles.videoContainer}
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
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  controlOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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
    color: 'white',
  },
  controlBarContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },



  playerButtonWrapper: {
    flex:1,
    alignSelf:'center'
  },
  controlWrapper: {
    bottom:0,
    position:'absolute',
    width:'100%',
    zIndex:200,
    flexDirection: 'row'
  },
  controlTopWrapper: {
    top:0,
    position:'absolute',
    width:'100%',
    zIndex:200,
    flexDirection: 'row'
  },
  controlTopTexts: {
    color: 'white'
  },
  progressWrapper: {
    flex:9
  },
  fullScreen: {backgroundColor: "black"},
  barWrapper: {
    zIndex:200,
    position: 'relative',
    bottom:0,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  controllerButton: {height: 20, width: 20},
  videoView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
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