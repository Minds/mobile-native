import React from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import ThemedStyles from '../styles/ThemedStyles';
import excerpt from '../common/helpers/excerpt';
import type { PortraitBarItem } from './createPortraitStore';
import PressableScale from '../common/components/PressableScale';
import navigationService from '../navigation/NavigationService';
import MText from '../common/components/MText';

type PropsType = {
  item: PortraitBarItem;
  index: number;
};

/**
 * Portrait content bar items
 * @param props Props
 */
export default observer(function PortraitContentBarItem(props: PropsType) {
  const onPress = React.useCallback(() => {
    navigationService.push('PortraitViewerScreen', {
      index: props.index,
    });
  }, [props.index]);

  return (
    <View style={containerStyle}>
      <PressableScale onPress={onPress} activeOpacity={0.5}>
        <FastImage
          source={props.item.user.getAvatarSource()}
          style={styles.avatar}
        />
        {props.item.unseen ? <View style={styles.unseen} /> : null}
      </PressableScale>
      <MText style={textStyle}>{excerpt(props.item.user.username, 10)}</MText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    overflow: 'visible',
  },
  text: {
    marginTop: 8,
  },
  unseen: {
    zIndex: 9990,
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2.2,
    borderRadius: 30,
    position: 'absolute',
    borderColor: '#ECDA51',
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
});

const textStyle = ThemedStyles.combine(
  'fontM',
  styles.text,
  'colorSecondaryText',
);

const containerStyle = ThemedStyles.combine(
  'columnAlignCenter',
  styles.container,
  'bgTransparent',
  'centered',
);
