import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

import Async from 'react-promise';
import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';

/**
 * Message Component
 */
export default class Message extends PureComponent {


  render() {
    console.log('render')
    const message = this.props.message;

    const avatarImg = { uri: MINDS_URI + 'icon/' + message.owner.guid + '/small' };

    let decrypPromise;

    if (message.decrypted) {
      decrypPromise = Promise.resolve(message.message);
    } else {
      decrypPromise = crypto.decrypt(message.message);
    }

    if (this.props.right) {
      return (
        <View>
          <View style={styles.messageContainer}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            <View style={styles.textContainer}>
              <Async
                promise={decrypPromise}
                then={(val) => <Text style={styles.message}>{val}</Text>}
                pending={<Text style={styles.message}>decrypting...</Text>}
              />
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
            <Async
              promise={decrypPromise}
              then={(val) => <Text style={styles.message}>{val}</Text>}
              pending={<Text style={styles.message}>decrypting...</Text>}
            />
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