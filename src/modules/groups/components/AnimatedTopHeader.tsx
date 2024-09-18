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

import { GroupMembersStoreType } from '../hooks/useGroupMembersStore';
import { GroupFeedStoreType } from '../hooks/useGroupFeedStore';
import GroupMoreMenu from './GroupMoreMenu';
import GroupChatButton from '~/modules/chat/components/GroupChatButton';
import sp from '~/services/serviceProvider';

type Props = {
  animationHeaderHeight: SharedValue<number>;
  scrollY: SharedValue<number>;
  group: GroupModel;
  currentStore?: GroupMembersStoreType | GroupFeedStoreType;
  top: number;
  hideBack?: boolean;
};

export default function AnimatedTopHeader({
  group,
  hideBack,
  animationHeaderHeight,
  scrollY,
  currentStore,
  top,
}: Props) {
  const navigation = useNavigation();
  const menuRef = useRef<any>();
  const bgColor = sp.styles.getColor('PrimaryBackground');

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
      paddingLeft: hideBack ? 16 : 0,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [159, 193],
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
        style={[styles.rowContainer, sp.styles.style.alignSelfCenterMaxWidth]}>
        {!hideBack && (
          <SmallCircleButton
            name="chevron-left"
            raised={true}
            onPress={navigation.goBack}
            color={sp.styles.getColor('PrimaryBackground')}
            iconStyle={styles.iconStyle}
            reverseColor={sp.styles.getColor('PrimaryText')}
          />
        )}
        <Animated.View style={titleStyle}>
          <H4 numberOfLines={1}>{group.name}</H4>
        </Animated.View>

        <GroupChatButton group={group} />

        <SmallCircleButton
          name="more-horiz"
          type="material"
          raised={true}
          onPress={() => menuRef.current?.present()}
          color={sp.styles.getColor('PrimaryBackground')}
          iconStyle={styles.iconStyle}
          reverseColor={sp.styles.getColor('PrimaryText')}
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

const styles = sp.styles.create({
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
