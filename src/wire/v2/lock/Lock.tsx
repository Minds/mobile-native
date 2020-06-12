import React from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import LockTag from './LockTag';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
};

type BlockType = 'members' | 'paywall' | 'plus';

const getBlockType = (urn: string): BlockType => {
  if (!urn) {
    return 'paywall';
  }
  const type = urn.split(':')[1];

  // TODO how we indentify paywall if all are support-tier
  return type === 'support-tier' ? 'members' : 'plus';
};

const getTextForBlocked = (type: BlockType) => {
  let message = '';
  switch (type) {
    case 'members':
      message = 'Become a member to view this post';
      break;
    case 'plus':
      message = 'Join Plus to view this post';
      break;
    case 'paywall':
      message = 'Pay too see this post';
      break;
  }
  return message;
};

const Lock = observer(({ entity, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  const hasMedia = entity.hasMedia();
  // we don´t know yet what the data structure be like
  const blockedType = getBlockType(entity.wire_threshold);
  const message = getTextForBlocked(blockedType);
  if (!hasMedia) {
    return (
      <View
        style={[
          styles.mask,
          theme.backgroundSeparator,
          theme.centered,
          theme.padding2x,
        ]}>
        <Text style={[theme.colorWhite, theme.fontL]}>{message}</Text>
        <LockTag type={blockedType} />
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={entity.getThumbSource()}
      resizeMode="cover">
      <Text style={[theme.colorWhite, theme.fontL]}>{message}</Text>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Lock;
