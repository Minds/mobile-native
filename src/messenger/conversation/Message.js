import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../styles/Colors';
import { CommonStyle } from '../../styles/Common';
import { MINDS_CDN_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';
import Tags from '../../common/components/Tags';

/**
 * Message Component
 */
export default class Message extends PureComponent {

  stats = {
    showDate: false
  };

  componentWillMount() {
    const message = this.props.message;
    this.setState({decrypted: message.decrypted});
    if (!message.decrypted) {

      this.setState({
        decrypted: false,
        msg: 'decrypting...'
      });

      // we need to decrypt inside a settimeout to fix blank list until decryption ends
      setTimeout(() => {
        crypto.decrypt(message.message)
          .then(msg => {
              this.setState({ decrypted: true, msg });
              message.decrypted = true;
              message.message = msg;
            });
      }, 0);

    } else {
      this.setState({ decrypted: true, msg: message.message });
    }
  }

  render() {
    const message = this.props.message;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + message.owner.guid + '/small' };

    if (this.props.right) {
      return (
        <View>
          <View style={[styles.messageContainer, styles.right]}>
            <View style={CommonStyle.rowJustifyCenter}>
              <View style={CommonStyle.flexContainer}></View>
              <View style={[styles.textContainer, CommonStyle.backgroundPrimary]}  >
                <Text selectable={true} style={[styles.message, CommonStyle.colorWhite]} onPress={() => this.showDate()}>
                  <Tags color={'#fff'} style={{ color: '#FFF' }} navigation={this.props.navigation}>{this.state.msg}</Tags>
                </Text>
              </View>
            </View>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          </View>
          { this.state.showDate ?
            <Text selectable={true} style={[styles.messagedate, styles.rightText]}>Dec 6, 2017, 11:47:46 AM</Text>
            : null }
        </View>
      );
    }

    return (
      <View>
        <View style={styles.messageContainer}>
          <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          <View style={CommonStyle.rowJustifyCenter}>
            <View style={[ styles.textContainer ]}  >
              <Text selectable={true} style={[styles.message]} onPress={() => this.showDate()}>
                <Tags navigation={this.props.navigation}>{this.state.msg}</Tags>
              </Text>
            </View>
            <View style={CommonStyle.flexContainer}></View>
          </View>
        </View>
        { this.state.showDate ?
          <Text selectable={true} style={styles.messagedate}>Dec 6, 2017, 11:47:46 AM</Text>
          : null }
      </View>
    );
  }

  showDate() {
    this.setState({
      showDate: !this.state.showDate
    });
  }

}


// styles
const styles = StyleSheet.create({
  smallavatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: '#EEE',
    borderRadius: 15,
    marginLeft: 8,
    marginRight: 8,
  },
  messageContainer: {
    margin: 4,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  right: {
    justifyContent: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  message: {
    padding: 16,
    maxWidth: 272,
  },
  messagedate: {
    fontSize: 9,
    marginTop: 2,
    marginLeft: 38,
    marginRight: 38
  }
});
