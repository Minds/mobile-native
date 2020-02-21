import React, {
  PureComponent
} from 'react';

import {
  inject,
  observer
} from 'mobx-react'

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import formatDate from '../../common/helpers/date';
import colors from '../../styles/Colors';
import { CommonStyle } from '../../styles/Common';
import { MINDS_CDN_URI } from '../../config/Config';
import crypto from '../../common/services/crypto.service';
import Tags from '../../common/components/Tags';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * Message Component
 */
@inject('user')
export default class Message extends PureComponent {

  stats = {
    showDate: false
  };

  state = {
    decrypted: false,
    msg: i18n.t('messenger.decrypting'),
  }

  constructor(props) {
    super(props);

    const { message } = props;

    if (message.decrypted) {
      this.state = {
        decrypted: true,
        msg: message.message,
      }
    }
  }

  async componentDidMount() {
    const message = this.props.message;
    if (!this.state.decrypted) {
      if (message.message) {
        try {
          const msg = await crypto.decrypt(message.message);
          this.setState({ decrypted: true, msg });
        } catch (ex) {
          this.setState({ decrypted: true, msg:'couldn\'t decrypt'});
        }
      } else {
        this.setState({ decrypted: true, msg:'' });
      }
    }
  }

  getIcontime(owner) {
    if (owner.guid == this.props.user.me.guid)
      return '/' + this.props.user.me.icontime;
    return '';
  }

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid: this.props.message.owner.guid });
    }
  }

  /**
   * Render
   */
  render() {
    const message = this.props.message;
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + message.owner.guid + '/small' + this.getIcontime(message.owner)};
    if (this.props.right) {
      return (
        <View>
          <View style={[styles.messageContainer, styles.right]}>
            <View style={[CommonStyle.rowJustifyCenter, styles.textContainer, ThemedStyles.style.backgroundLink]}>
              <Text selectable={true} style={[styles.message, CommonStyle.colorWhite]} onLongPress={() => this.showDate()}>
                <Tags color={'#fff'} style={{ color: '#FFF' }} navigation={this.props.navigation}>{this.state.msg}</Tags>
              </Text>
            </View>
            <TouchableOpacity onPress={this._navToChannel}>
              <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            </TouchableOpacity>
          </View>
          { this.state.showDate ?
            <Text selectable={true} style={[styles.messagedate, styles.rightText]}>{formatDate(this.props.message.time_created)}</Text>
            : null }
        </View>
      );
    }

    return (
      <View>
        <View style={styles.messageContainer}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
          </TouchableOpacity>
          <View style={[CommonStyle.rowJustifyCenter, styles.textContainer, , ThemedStyles.style.backgroundTertiary]}>
            <Text selectable={true} style={[styles.message]} onLongPress={() => this.showDate()}>
              <Tags style={[styles.message]} navigation={this.props.navigation}>{this.state.msg}</Tags>
            </Text>
          </View>
        </View>
        { this.state.showDate ?
          <Text selectable={true} style={styles.messagedate}>{formatDate(this.props.message.time_created)}</Text>
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
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: '#EEE',
    borderRadius: 15,
    padding: 12,
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
    maxWidth: 272,
  },
  messagedate: {
    fontSize: 9,
    marginTop: 2,
    marginLeft: 38,
    marginRight: 38
  }
});
