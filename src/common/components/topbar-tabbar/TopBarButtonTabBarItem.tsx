import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Icon, B4 } from '~ui';
import { ICON_TABS_HEIGHT } from '~styles/Tokens';
import Button from '../Button';
import MText from '../MText';
import PressableScale from '~/common/components/PressableScale';
import sp from '~/services/serviceProvider';

const TIMED = {
  duration: 175,
  easing: Easing.quad,
};

type TabTiltePropsType = {
  isCurrent: boolean;
  title: string;
};

function TabTitle({ isCurrent, title }: TabTiltePropsType) {
  if (!title) {
    return null;
  }

  return (
    <MText style={isCurrent ? touchableTextStyleSelected : touchableTextStyle}>
      {title}
    </MText>
  );
}

const TopBarButtonTabBarItem = ({ tab, buttonCmp, onChange, current }) => {
  const theme = sp.styles.style;
  const transform = useSharedValue(0);
  const isCurrent = tab.id === current;
  const isButton = !buttonCmp || buttonCmp === 'Button';
  const animatedViewStyles = isCurrent ? bottomLineSelected : bottomLine;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transform.value }],
    };
  });

  useEffect(() => {
    if (isButton) {
      return;
    }
    if (isCurrent) {
      transform.value = withTiming(-3 + StyleSheet.hairlineWidth, TIMED);
      return;
    }
    transform.value = withTiming(0, TIMED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent]);

  const renderChild = () => {
    if (isButton) {
      return (
        <Button
          borderless
          onPress={() => onChange(tab.id)}
          text={tab.title}
          containerStyle={[
            styles.buttonContainer,
            isCurrent ? theme.bgLink : theme.bgTransparent,
          ]}
          textStyle={[
            styles.text,
            sp.styles.theme === 1 ? theme.colorBlack : theme.colorWhite,
            !isCurrent ? theme.colorSecondaryText : {},
          ]}
          testID={tab.testID}
        />
      );
    }

    if (tab.title) {
      return (
        <TouchableOpacity
          onPress={() => onChange(tab.id)}
          testID={tab.testID}
          style={touchableContainer}>
          <TabTitle isCurrent={isCurrent} title={tab.title} />
        </TouchableOpacity>
      );
    }

    if (tab.icon) {
      return (
        <PressableScale
          onPress={() => onChange(tab.id)}
          style={[styles.iconContainer, touchableContainer]}
          testID={tab.testID}>
          <View style={theme.alignCenter}>
            <Icon name={tab.icon.name} active={isCurrent} />
          </View>
          {tab.icon.subtitle ? (
            <B4
              align="center"
              top="XXXS"
              font="medium"
              numberOfLines={1}
              color={isCurrent ? 'link' : 'secondary'}>
              {tab.icon.subtitle}
            </B4>
          ) : null}
        </PressableScale>
      );
    }

    return null;
  };

  return (
    <View style={containerStyles}>
      {renderChild()}
      {!isButton && (
        <Animated.View style={[animatedViewStyles, animatedStyles]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    marginVertical: 4,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLine: {
    position: 'absolute',
    bottom: -3 + StyleSheet.hairlineWidth,
    height: 3,
    width: '100%',
    left: 0,
    zIndex: 100,
  },
  touchableContainer: {
    flex: 1,
    height: ICON_TABS_HEIGHT,
    paddingBottom: 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
  },
  touchableText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

const touchableTextStyleSelected = sp.styles.combine(
  styles.touchableText,
  'colorPrimaryText',
);
const touchableTextStyle = sp.styles.combine(
  styles.touchableText,
  'colorSecondaryText',
);
const containerStyles = sp.styles.combine(styles.container);
const bottomLine = sp.styles.combine('bgPrimaryBorder', styles.bottomLine);
const bottomLineSelected = sp.styles.combine('bgIconActive', styles.bottomLine);
const touchableContainer = sp.styles.combine(styles.touchableContainer);

export default TopBarButtonTabBarItem;
