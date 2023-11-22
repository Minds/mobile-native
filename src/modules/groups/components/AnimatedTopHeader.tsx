import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import SmallCircleButton from '~/common/components/SmallCircleButton';
import { H4 } from '~/common/ui';
import type GroupModel from '~/groups/GroupModel';
import ThemedStyles from '~/styles/ThemedStyles';
import { GroupMembersStoreType } from '../hooks/useGroupMembersStore';
import { GroupFeedStoreType } from '../hooks/useGroupFeedStore';
import GroupMoreMenu from './GroupMoreMenu';

type Props = {
  animationHeaderHeight: SharedValue<number>;
  scrollY: SharedValue<number>;
  group: GroupModel;
  currentStore?: GroupMembersStoreType | GroupFeedStoreType;
  top: number;
};

export default function AnimatedTopHeader({
  group,
  animationHeaderHeight,
  scrollY,
  currentStore,
  top,
}: Props) {
  const navigation = useNavigation();
  const menuRef = useRef<any>();
  const bgColor = ThemedStyles.getColor('PrimaryBackground');

  const topbarStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !scrollY) {
      return {};
    }
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 200],
      [bgColor + '00', bgColor],
    );

    return {
      height: top + 54,
      backgroundColor,
    };
  }, []);

  const titleStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !scrollY) {
      return {};
    }

    return {
      flex: 1,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [151, 185],
            [34, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, []);

  return (
    <Animated.View style={[styles.container, topbarStyle]}>
      <View
        style={[
          styles.rowContainer,
          ThemedStyles.style.alignSelfCenterMaxWidth,
        ]}>
        <SmallCircleButton
          name="chevron-left"
          raised={true}
          onPress={navigation.goBack}
          color={ThemedStyles.getColor('PrimaryBackground')}
          iconStyle={styles.iconStyle}
          reverseColor={ThemedStyles.getColor('PrimaryText')}
        />
        <Animated.View style={titleStyle}>
          <H4 numberOfLines={1}>{group.name}</H4>
        </Animated.View>
        <SmallCircleButton
          name="more-horiz"
          type="material"
          raised={true}
          onPress={() => menuRef.current?.present()}
          color={ThemedStyles.getColor('PrimaryBackground')}
          iconStyle={styles.iconStyle}
          reverseColor={ThemedStyles.getColor('PrimaryText')}
        />
        <GroupMoreMenu
          ref={menuRef}
          group={group}
          onSearchGroupPressed={() => currentStore?.toggleSearch()}
        />
      </View>
    </Animated.View>
  );
}

const styles = ThemedStyles.create({
  container: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    width: '100%',

    justifyContent: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: { fontSize: 25 },
});
