import { View, StyleSheet } from 'react-native';
import React from 'react';
import * as entities from 'entities';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

import GroupModel from '~/groups/GroupModel';
import { MINDS_CDN_URI } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import { B2, H4 } from '~/common/ui';
import SubscribeButton from './SubscribeButton';

const avatarSize = 83;
const avatarBorder = 3;

type Props = {
  animationHeaderHeight: SharedValue<number>;
  animationHeaderPosition: SharedValue<number>;
  group: GroupModel;
  top: number;
  hideBack?: boolean;
};

export default function AnimatedHeader({
  animationHeaderHeight,
  animationHeaderPosition,
  group,
  top,
  hideBack,
}: Props) {
  const avatarStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !animationHeaderPosition) {
      return {};
    }
    return {
      transform: [
        {
          scale: interpolate(
            -animationHeaderPosition.value,
            [20, 80],
            [1, 0.75],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, []);

  const bannerStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !animationHeaderPosition) {
      return {};
    }

    return {
      height: 178 + top,
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      transform: [
        {
          translateY: -animationHeaderPosition.value / 2,
        },
      ],
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !animationHeaderPosition || hideBack) {
      return { paddingTop: 8 };
    }

    return {
      paddingTop: 8,
      transform: [
        {
          translateX: interpolate(
            -animationHeaderPosition.value,
            [115, 150],
            [0, 38],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, []);

  return (
    <View style={ThemedStyles.style.bgPrimaryBackground}>
      <Animated.View style={bannerStyle}>
        <Image style={styles.banner} source={getBanner(group)} />
      </Animated.View>
      <View style={[styles.headerContainer, { marginTop: top + 150 }]}>
        <Animated.View style={[styles.avatar, avatarStyle]}>
          <Image
            source={getAvatar(group)}
            contentFit="cover"
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <View style={styles.join}>
          <SubscribeButton group={group} />
        </View>
        <Animated.View style={titleStyle}>
          <H4>{group.name}</H4>
        </Animated.View>
        <B2 color="secondary" vertical="XS">
          {entities.decodeHTML(group.briefdescription)}
        </B2>
      </View>
    </View>
  );
}

function getAvatar(group: GroupModel) {
  return `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large/${group.icontime}`;
}
function getBanner(group: GroupModel) {
  return `${MINDS_CDN_URI}fs/v1/banners/${group.guid}/fat/${group.icontime}`;
}

const styles = ThemedStyles.create({
  banner: { right: 0, bottom: 0, position: 'absolute', left: 0, top: 0 },
  headerContainer: [
    {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    'bgPrimaryBackground',
    'paddingHorizontal4x',
    'alignSelfCenterMaxWidth',
  ],
  join: { position: 'absolute', right: 16, top: 16 },
  avatar: [
    'bgPrimaryBackground',
    'bcolorPrimaryBackground',
    {
      marginTop: -avatarSize / 2,
      marginLeft: 8,
      width: avatarSize + avatarBorder * 2,
      height: avatarSize + avatarBorder * 2,
      borderRadius: 9999,
      overflow: 'hidden',
      borderWidth: avatarBorder,
      // margin: -avatarBorder,
    },
  ],
});
