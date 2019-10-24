import React from 'react';
import { View } from 'react-native';
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
    header: null
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    const entity = this.props.navigation.getParam('entity');
    setTimeout(async () => {
      const url = await gatheringService.getRoomName(entity);
      const user = sessionService.getUser();
      const avatar = user.getAvatarSource().uri;

      JitsiMeet.call(url, avatar, user.name, entity.name);
    }, 1000);
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    JitsiMeet.endCall();
  }

  /**
   * On conference terminated
   */
  onConferenceTerminated = nativeEvent => {
    gatheringService.stopKeepAlive();
    this.props.navigation.goBack();
  };

  /**
   * On conference joined
   */
  onConferenceJoined = nativeEvent => {
    gatheringService.startKeepAlive();
  };

  /**
   * On conference will join
   */
  onConferenceWillJoin = nativeEvent => {
    /* Conference will join event */
  };

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
