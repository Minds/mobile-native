import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { observer } from 'mobx-react';
import { MindsVideoStoreType } from './createMindsVideoStore';

import MText from '../../../common/components/MText';
import sp from '~/services/serviceProvider';

const radiusOfHolder = 5;
const radiusOfActiveHolder = 7;

type PropsType = {
  store: MindsVideoStoreType;
};

const ProgressBar = observer(({ store }: PropsType) => {
  const theme = sp.styles.style;

  return (
    <View style={styles.container}>
      <Slider
        style={styles.barView}
        thumbTintColor={sp.styles.getColor('Link')}
        minimumTrackTintColor={sp.styles.getColor('Link')}
        value={store.currentSeek || store.currentTime}
        maximumValue={store.duration}
        onValueChange={store.changeSeek}
        onSlidingComplete={store.onProgressChanged}
      />
      <MText style={[styles.timeText, theme.marginLeft2x, theme.marginRight]}>
        {store.currentSeekSeconds} / {store.durationSeconds}
      </MText>
    </View>
  );
});

let height = 18;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height,
    alignItems: 'center',
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barView: {
    flex: 1,
    height,
    flexDirection: 'row',
  },
  timeText: {
    color: 'white',
    fontSize: Platform.select({ ios: 14, android: 12 }),
  },
  line: {
    borderWidth: 3,
    padding: 0,
  },
  holder: {
    height: radiusOfHolder * 2,
    width: radiusOfHolder * 2,
    borderRadius: radiusOfHolder,
    backgroundColor: 'white',
  },
  activeHolder: {
    height: radiusOfActiveHolder * 2,
    width: radiusOfActiveHolder * 2,
    borderRadius: radiusOfActiveHolder,
    backgroundColor: 'white',
  },
});

export default ProgressBar;
