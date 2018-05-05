import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import * as Progress from 'react-native-progress';
import colors from '../styles/Colors';

@inject('capture')
@observer
export default class CapturePoster extends Component {

  render() {
    const attachment = this.props.capture.attachment;
    const isPosting = this.props.capture.isPosting;

    return (
      <View style={styles.posterActions}>
        {
          attachment.uploading ?
            <Progress.Pie progress={attachment.progress} size={36} />
            :
            (isPosting || attachment.checkingVideoLength) ?
              <ActivityIndicator size={'large'} />
              :
              <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.button}
              >
                <Text style={styles.buttonText}>POST</Text>
              </TouchableOpacity>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  posterActions: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
  },
  button: {
    margin: 4,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    //borderRadius: 3,
    //backgroundColor: 'white',
    //borderWidth: 1,
    //borderColor: colors.primary,
  }
});
