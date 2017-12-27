import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  Button,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import formatDate from '../common/helpers/date';
/**
 * Channel Card
 */

@observer
export default class MindsVideo extends Component {

  render() {
    const entity = this.props.entity;

    const image = { uri: entity.thumbnail_src };

    return (
      <View>
        <Video source={{ 'uri': 'api/v1/media/' + entity.custom_data.guid + '/play', mainVer: 1, patchVer: 0}} // Looks for .mp4 file (background.mp4) in the given expansion version. 
           rate={1.0}                   // 0 is paused, 1 is normal. 
           volume={1.0}                 // 0 is muted, 1 is normal. 
           muted={false}                // Mutes the audio entirely. 
           paused={false}               // Pauses playback entirely. 
           resizeMode="cover"           // Fill the whole screen at aspect ratio. 
           repeat={true}                // Repeat forever. 
           //onLoadStart={this.loadStart} // Callback when video starts to load 
           //onLoad={this.setDuration}    // Callback when video loads 
           //onProgress={this.setTime}    // Callback every ~250ms with currentTime 
           //onEnd={this.onEnd}           // Callback when playback finishes 
           //onError={this.videoError}    // Callback when video cannot be loaded 
           style={styles.backgroundVideo} />
      </View>
    )
  }
}
/*<minds-video
  width="100%"
  height="300px"
  style="background:#000;"
  loop="true"
  controls="true"
  muted="false"
  [poster]="activity.custom_data.thumbnail_src"
  [src]="[{ 'res': '720', 'uri': 'api/v1/media/' + activity.custom_data.guid + '/play', 'type': 'video/mp4' }]"
  [guid]="activity.custom_data.guid"
  [playCount]="activity['play:count']"
  #player>
  <video-ads [player]="player" *ngIf="activity.monetized"></video-ads>
</minds-video>*/

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});