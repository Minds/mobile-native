import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Pagination } from '@crowdlinker/react-native-pager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropsType = {
  store: {
    setIndex: (number) => void;
  };
  pages: Array<React.ReactNode>;
};

const pagerAnimation = {
  transform: [
    {
      scale: {
        inputRange: [-2, -1, 0, 1, 2],
        outputRange: [0.9, 0.9, 1, 0.9, 0.9],
      },
    },
  ],
  opacity: {
    inputRange: [-2, -1, 0, 1, 2],
    outputRange: [0.25, 0.25, 0.6, 0.15, 0.15],
  },
};

/**
 * Portrait paginator
 */
export default function PortraitPaginator({ store, pages }: PropsType) {
  const insets = useSafeAreaInsets();

  const style = StyleSheet.flatten([
    styles.circlesContainer,
    { marginTop: insets.top ? insets.top - 5 : 0 },
  ]);
  return (
    <Pagination pageInterpolation={pagerAnimation} style={style}>
      {React.Children.map(pages, (_, i) => (
        <Marker i={i} onPress={store.setIndex} />
      ))}
    </Pagination>
  );
}

function Marker({ i, onPress }) {
  return <TouchableOpacity onPress={() => onPress(i)} style={styles.marker} />;
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 8,
    borderRadius: 10,
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
    top: 73,
    left: 0,
    height: 8,
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 9999,
  },
});
