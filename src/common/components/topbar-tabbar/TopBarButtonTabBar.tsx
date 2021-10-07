import React from 'react';
import {
  View,
  StyleProp,
  TextStyle,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { IconButton } from '~ui/icons';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import Button from '../Button';
import MText from '../MText';

export type ButtonTabType<T> = {
  id: T;
  title?: string;
  icon?: { name: string; type: string };
};

type PropsType<T> = {
  tabs: Array<ButtonTabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
  buttonCmp?: 'Button' | 'Touchable';
  scrollViewContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * TopBarButtonTabBar Ref
 */
export const topBarButtonTabBarRef = React.createRef<ScrollView>();

/**
 * Tab bar
 */
function TopBarButtonTabBar<T>(props: PropsType<T>) {
  const theme = ThemedStyles.style;

  const renderItem = (tab, i) => {
    if (!props.buttonCmp || props.buttonCmp === 'Button') {
      return (
        <Button
          borderless
          onPress={() => props.onChange(tab.id)}
          key={i}
          text={tab.title}
          containerStyle={[
            styles.buttonContainer,
            tab.id === props.current ? theme.bgLink : theme.bgTransparent,
          ]}
          textStyle={[
            styles.text,
            tab.id !== props.current ? theme.colorSecondaryText : {},
          ]}
        />
      );
    }

    if (tab.title) {
      return (
        <TouchableOpacity
          key={i}
          onPress={() => props.onChange(tab.id)}
          style={
            tab.id === props.current
              ? touchableContainerSelected
              : touchableContainer
          }>
          <TabTitle isCurrent={tab.id === props.current} title={tab.title} />
        </TouchableOpacity>
      );
    }

    if (tab.icon) {
      return (
        <IconButton
          scale
          key={i}
          onPress={() => props.onChange(tab.id)}
          name={tab.icon.name}
          active={tab.id === props.current}
          style={
            tab.id === props.current
              ? touchableContainerSelected
              : touchableContainer
          }
        />
      );
    }

    return null;
  };

  return (
    <View style={theme.rowJustifyStart}>
      <ScrollView
        horizontal
        ref={topBarButtonTabBarRef}
        contentContainerStyle={[
          Platform.OS === 'android'
            ? theme.paddingBottom
            : theme.paddingBottom2x,
          theme.paddingLeft2x,
          props.scrollViewContainerStyle,
        ]}>
        {props.tabs.map((tab, i) => renderItem(tab, i))}
      </ScrollView>
    </View>
  );
}

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

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  touchableContainer: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 17,
    alignItems: 'center',
  },
  touchableContainerSelected: {
    borderBottomColor: '#1B85D6',
    borderBottomWidth: 3,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  touchableText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
1;
const touchableTextStyleSelected = ThemedStyles.combine(
  styles.touchableText,
  'colorPrimaryText',
);

const touchableTextStyle = ThemedStyles.combine(
  styles.touchableText,
  'colorSecondaryText',
);

const touchableContainer = ThemedStyles.combine(
  'borderBottomHair',
  'bcolorPrimaryBorder',
  styles.touchableContainer,
);

const touchableContainerSelected = [
  styles.touchableContainer,
  styles.touchableContainerSelected,
];

export default TopBarButtonTabBar;
