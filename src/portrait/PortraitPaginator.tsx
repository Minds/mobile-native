import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type ActivityModel from '../newsfeed/ActivityModel';
import { observer } from 'mobx-react';

type PropsType = {
  store: {
    setIndex: (number) => void;
    index: number;
  };
  activities: Array<ActivityModel>;
};

/**
 * Portrait paginator
 */
export default function PortraitPaginator({ store, activities }: PropsType) {
  const insets = useSafeAreaInsets();

  if (activities.length === 1) {
    return null;
  }

  const style = StyleSheet.flatten([
    styles.circlesContainer,
    { marginTop: insets.top ? insets.top - 5 : 0 },
  ]);
  return (
    <View style={style}>
      {activities.map((_, i) => (
        <Marker key={i} i={i} onPress={store.setIndex} store={store} />
      ))}
    </View>
  );
}

const Marker = observer(({ i, onPress, store }) => {
  return (
    <TouchableOpacity onPress={() => onPress(i)} style={styles.markerContainer}>
      <View
        style={[
          styles.marker,
          i > store.index ? styles.dark : styles.light,
          store.index === i ? styles.current : null,
        ]}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  light: {
    backgroundColor: '#FFFFFF',
  },
  dark: {
    backgroundColor: '#000000',
  },
  current: {
    opacity: 0.9,
  },
  markerContainer: {
    marginHorizontal: 3,
    flex: 1,
  },
  marker: {
    opacity: 0.4,
    width: '100%',
    height: 5,
    borderRadius: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  circlesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 73,
    left: 0,
    height: 8,
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 9999,
  },
});
