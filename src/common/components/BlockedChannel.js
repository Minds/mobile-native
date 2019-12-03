import React, {Component} from 'react';

import {Text, StyleSheet, View} from 'react-native';

import {CommonStyle} from '../../styles/Common';
import Colors from '../../styles/Colors';
import i18n from '../services/i18n.service';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class BlockedChannel extends Component {
  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.ownerObj.guid,
      });
    }
  };

  render() {
    return (
      <View style={[styles.container, CommonStyle.hairLineBottom]}>
        <View style={[CommonStyle.flexContainerCenter, styles.insideBox]}>
          <Text style={styles.text}>
            {i18n.to('channel.blockedNav', null, {
              username: (
                <Text style={styles.username} onPress={this.navToChannel}>
                  @{this.props.entity.ownerObj.username}
                </Text>
              ),
            })}
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await this.props.entity.unblockOwner();
            }}>
            <Text style={styles.textUndo}>{i18n.t('undo')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    height: 150,
    backgroundColor: Colors.lightGreyed,
    padding: 5,
  },
  insideBox: {
    borderStyle: 'solid',
    borderColor: Colors.darkGreyed,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  text: {
    color: Colors.darkGreyed,
  },
  username: {
    fontWeight: 'bold',
  },
  textUndo: {
    color: Colors.darkGreyed,
    marginTop: 20,
    fontWeight: 'bold',
  }
});
