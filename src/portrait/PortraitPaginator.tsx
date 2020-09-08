import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Pagination } from '@crowdlinker/react-native-pager';

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
  return (
    <Pagination
      pageInterpolation={pagerAnimation}
      style={styles.circlesContainer}>
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
  },
  circlesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 110,
    left: 0,
    height: 8,
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
    zIndex: 9999,
  },
});
