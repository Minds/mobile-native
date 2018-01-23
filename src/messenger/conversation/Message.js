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
import { MINDS_CDN_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';

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
            <TouchableHighlight style={[ styles.textContainer, { backgroundColor: colors.primary }]} onPress={ () => this.showDate() } underlayColor={colors.primary}>
              <Text style={[styles.message, { color: '#FFF' } ]}>{this.state.msg}</Text>
            </TouchableHighlight>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          </View>
          { this.state.showDate ? 
            <Text style={[styles.messagedate, styles.rightText]}>Dec 6, 2017, 11:47:46 AM</Text>
            : null }
        </View>
      );
    }

    return (
      <View>
        <View style={styles.messageContainer}>
          <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          <TouchableHighlight style={styles.textContainer} onPress={ () => this.showDate() } underlayColor={'transparent'}>
            <Text style={styles.message}>{this.state.msg}</Text>
          </TouchableHighlight>
        </View>
        { this.state.showDate ? 
          <Text style={styles.messagedate}>Dec 6, 2017, 11:47:46 AM</Text>
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
    //borderWidth: 1,
    //borderColor: '#EEE',
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
    padding: 12,
    marginLeft: 10,
    marginRight: 10
  },
  messagedate: {
    fontSize: 9,
    marginTop: 2,
    marginLeft: 38,
    marginRight: 38
  }
});
