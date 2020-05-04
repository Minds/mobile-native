//@ts-nocheck
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import * as Progress from 'react-native-progress';
import colors from '../styles/Colors';
import { CommonStyle as CS } from '../styles/Common';
import i18n from '../common/services/i18n.service';
import connectivityService from '../common/services/connectivity.service';

@inject('capture')
@observer
class CapturePostButton extends Component {
  /**
   * Render
   */
  render() {
    const attachment = this.props.capture.attachment;
    const isPosting = this.props.capture.isPosting;
    const text = connectivityService.isConnected
      ? this.props.text || i18n.t('capture.post')
      : i18n.t('offline');

    return (
      <View style={styles.posterActions}>
        {attachment.uploading ? (
          <Progress.Pie
            progress={attachment.progress}
            color={colors.primary}
            size={36}
          />
        ) : isPosting ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <TouchableOpacity
            onPress={this.props.onPress}
            disabled={!connectivityService.isConnected}
            style={[
              styles.button,
              CS.borderRadius10x,
              connectivityService.isConnected
                ? CS.borderPrimary
                : CS.borderGreyed,
              CS.border,
            ]}
            testID={this.props.testID}>
            <Text
              style={[
                styles.buttonText,
                connectivityService.isConnected
                  ? CS.colorPrimary
                  : CS.colorGreyed,
              ]}>
              {text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default CapturePostButton;

const styles = StyleSheet.create({
  posterActions: {
    marginRight: Platform.OS === 'ios' ? -10 : 0,
  },
  buttonText: {
    fontSize: 16,
  },
  button: {
    margin: 4,
    padding: 6,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    //borderRadius: 3,
    //backgroundColor: 'white',
    //borderWidth: 1,
    //borderColor: colors.primary,
  },
});
