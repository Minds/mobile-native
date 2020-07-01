import React from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import LockTag from './LockTag';
import Colors from '../../../styles/Colors';

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
      message = 'Join Minds+ to view this post';
      break;
    case 'paywall':
      message = 'Pay 1 Token see this post';
      break;
  }
  return message;
};

const Lock = observer(({ entity, navigation }: PropsType) => {
  const theme = ThemedStyles.style;
  // we don´t know yet what the data structure be like
  //const blockedType = getBlockType(entity.wire_threshold);
  const message = getTextForBlocked('members');

  if (!entity.hasThumbnails() && !entity.hasMedia()) {
    return (
      <View
        style={[
          styles.mask,
          theme.backgroundSeparator,
          theme.centered,
          theme.padding2x,
        ]}>
        <Text style={[theme.colorWhite, theme.fontL]}>{message}</Text>
        <LockTag type={'members'} />
      </View>
    );
  }

  const playButton = entity.hasVideo() ? (
    <Icon
      style={styles.videoIcon}
      name="play-circle-outline"
      size={86}
      color={Colors.light}
    />
  ) : null;

  return (
    <ImageBackground
      style={[styles.backgroundImage, styles.mask]}
      source={entity.getThumbSource('large')}
      resizeMode="cover">
      {!playButton && (
        <Text style={[theme.colorWhite, theme.fontL, theme.fontSemibold]}>{message}</Text>
      )}
      <LockTag type={'members'} />
      {playButton}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    position: 'relative',
    alignSelf: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

export default Lock;
