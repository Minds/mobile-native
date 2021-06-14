import React from 'react';
import {
  View,
  StyleProp,
  TextStyle,
  StyleSheet,
  Insets,
  Platform,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import Button from '../Button';

export type ButtonTabType<T> = {
  id: T;
  title: string;
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

  return (
    <View style={[theme.rowJustifyStart]}>
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
        {props.tabs.map((tab, i) =>
          !props.buttonCmp || props.buttonCmp === 'Button' ? (
            <Button
              borderless
              onPress={() => props.onChange(tab.id)}
              key={i}
              text={tab.title}
              containerStyle={[
                styles.buttonContainer,
                tab.id === props.current
                  ? theme.backgroundLink
                  : theme.backgroundTransparent,
              ]}
              textStyle={[
                styles.text,
                tab.id !== props.current ? theme.colorSecondaryText : {},
              ]}
            />
          ) : (
            <TouchableOpacity
              key={i}
              onPress={() => props.onChange(tab.id)}
              style={
                tab.id === props.current
                  ? touchableContainerSelected
                  : touchableContainer
              }>
              <Text
                style={
                  tab.id === props.current
                    ? touchableTextStyleSelected
                    : touchableTextStyle
                }>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
    </View>
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
  'borderPrimary',
  styles.touchableContainer,
);

const touchableContainerSelected = [
  styles.touchableContainer,
  styles.touchableContainerSelected,
];

export default TopBarButtonTabBar;
