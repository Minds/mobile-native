import React, { useEffect } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from 'react-native';
import colors from '../../../styles/Colors';
import { MindsVideoStoreType } from './createMindsVideoStore';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';

const radiusOfHolder = 5;
const radiusOfActiveHolder = 7;

type PropsType = {
  store: MindsVideoStoreType;
};

const createProgressBarStore = () => {
  const store = {
    lineX: new Animated.Value(0),
    slideX: new Animated.Value(0),
    moving: false,
    width: 0,
    setLineX(lineX: number) {
      this.lineX.setValue(lineX);
    },
    setSlideX(slideX: number) {
      this.slideX.setValue(slideX);
    },
    onPanResponderGrant() {
      this.moving = true;
      //@ts-ignore
      this.slideX.setOffset(this.slideX._value);
      this.slideX.setValue(0);
    },
    setMoving(moving: boolean) {
      this.moving = moving;
    },
    setWidth(event: LayoutChangeEvent) {
      this.width = event.nativeEvent.layout.width - radiusOfHolder * 2;
    },
  };
  return store;
};

const ProgressBar = observer(({ store }: PropsType) => {
  const localStore = useLocalStore(createProgressBarStore);
  const theme = ThemedStyles.style;

  const holderPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      localStore.onPanResponderGrant();
    },
    onPanResponderMove: (e, gestureState) => {
      //@ts-ignore
      const totalX = localStore.slideX._offset + gestureState.dx;
      const newPercent = (totalX / localStore.width) * 100;
      store.onProgressChanged(newPercent, false);
      Animated.event([null, { dx: localStore.slideX }])(e, gestureState);
    },
    onPanResponderRelease: () => {
      localStore.slideX.flattenOffset();
      //@ts-ignore
      const newPercent = (localStore.slideX._value / localStore.width) * 100;
      localStore.setMoving(false);
      store.onProgressChanged(newPercent, true);
    },
  });

  const onLinePressed = (e) => {
    const newPercent = (e.nativeEvent.locationX / localStore.width) * 100;
    store.onProgressChanged(newPercent, true);
  };

  useEffect(() => {
    if (!localStore.moving) {
      localStore.setSlideX((store.percent * localStore.width) / 100);
    }
  }, [store, localStore]);

  const percentContainer = { flex: store.percent, borderColor: colors.primary };
  const remainingPercentContainer = {
    flex: 100 - store.percent,
    borderColor: colors.light,
  };

  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <Text style={[styles.timeText, theme.marginRight2x]}>
          {store.currentTimeSeconds}
        </Text>
        <View
          style={styles.barView}
          onLayout={localStore.setWidth}
          {...holderPanResponder.panHandlers}>
          <TouchableOpacity
            style={[styles.line, percentContainer]}
            onPress={onLinePressed}
          />
          <TouchableOpacity
            style={[styles.line, remainingPercentContainer]}
            onPress={onLinePressed}
          />
        </View>
        <Text style={[styles.timeText, theme.marginLeft2x]}>
          {store.durationSeconds}
        </Text>
      </View>
    </View>
  );
});

let height = 3;

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
