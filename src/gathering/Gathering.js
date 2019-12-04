import React from 'react';
import { View, BackHandler } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { CommonStyle } from '../styles/Common';
import sessionService from '../common/services/session.service';
import gatheringService from '../common/services/gathering.service';

/**
 * Gathering
 */
class Gathering extends React.Component {
  /**
   * Remove navigation header
   */
  static navigationOptions = {
    header: null,
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    // we disable the back button until the video call is started
    // to prevent an inconsistent behavior
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    this.init();
  }

  /**
   * Init gathering
   */
  async init() {
    if (!gatheringService.isActive) {
      const entity = this.props.navigation.getParam('entity');
      this.timer = setTimeout(async () => {
        const url = await gatheringService.getRoomName(entity);
        const user = sessionService.getUser();
        const avatar = user.getAvatarSource().uri;

        JitsiMeet.callWithUserInfo(url, avatar, user.name, entity.name);
      }, 300);
    }
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
      this.backHandler = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    JitsiMeet.endCall();
  }

  /**
   * On conference terminated
   */
  onConferenceTerminated = event => {
    gatheringService.stopKeepAlive();
    this.props.navigation.goBack();
  };

  /**
   * On conference joined
   */
  onConferenceJoined = event => {
    gatheringService.startKeepAlive();
    if (this.backHandler) {
      this.backHandler.remove();
      this.backHandler = null;
      // the back button should end the call instead of return to previous screen
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          JitsiMeet.endCall();
          return true;
        },
      );
    }
  };

  /**
   * On conference will join
   */
  onConferenceWillJoin = event => {};

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundBlack]}>
        <JitsiMeetView
          onConferenceTerminated={this.onConferenceTerminated}
          onConferenceJoined={this.onConferenceJoined}
          onConferenceWillJoin={this.onConferenceWillJoin}
          style={CommonStyle.flexContainer}
        />
      </View>
    );
  }
}

export default Gathering;
