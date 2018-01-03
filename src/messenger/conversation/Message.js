import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_CDN_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';

/**
 * Message Component
 */
export default class Message extends PureComponent {

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
          <View style={styles.messageContainer}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            <View style={styles.textContainer}>
              <Text style={styles.message}>{this.state.msg}</Text>
            </View>
          </View>
          <Text style={styles.messagedate}>Dec 6, 2017, 11:47:46 AM</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[styles.messageContainer, styles.right]}>
          <View style={styles.textContainer}>
            <Text style={styles.message}>{this.state.msg}</Text>
          </View>
          <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
        </View>
        <Text style={[styles.messagedate, styles.rightText]}>Dec 6, 2017, 11:47:46 AM</Text>
      </View>
    );
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
    flexGrow: 1,
    width: 0,
    flexDirection: "column",
    justifyContent: "center"
  },
  messageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
    width: '100%'
    // alignSelf: 'baseline',
  },
  right: {
    justifyContent: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  message: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
    backgroundColor: '#EEE',
    marginLeft: 10,
    marginRight: 10,
    flexWrap: "wrap",
    flexGrow: 1,
  },
  messagedate: {
    fontSize: 9,
    marginLeft: 38,
    marginRight: 38
  }
});
