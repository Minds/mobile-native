import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import { B1, B2 } from '~ui';

export type TabType<T> = {
  id: T;
  title: string;
  subtitle?: string;
  testID?: string;
};

type PropsType<T> = {
  tabs: Array<TabType<T>>;
  current: T;
  onChange: (id: T) => void;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  right?: React.ReactNode;
};

/**
 * topbarTabbarRef Ref
 */
export const topbarTabbarRef = React.createRef<ScrollView>();

/**
 * Tab bar
 */
function TopbarTabbar<T>(props: PropsType<T>) {
  const theme = ThemedStyles.style;

  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.borderBottomHair,
        theme.bcolorPrimaryBorder,
        props.containerStyle,
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={topbarTabbarRef}>
        {props.tabs.map((tab, i) => (
          <TouchableOpacity
            onPress={() => props.onChange(tab.id)}
            key={i}
            testID={tab.testID}
            style={[
              tab.id === props.current
                ? styles.tabStyleCurrent
                : styles.tabStyle,
              props.tabStyle,
            ]}>
            <B1
              font="medium"
              color={tab.id === props.current ? 'primary' : 'secondary'}>
              {tab.title}
            </B1>
            {!!tab.subtitle && <B2 vertical="XXXS">{tab.subtitle}</B2>}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {props.right}
    </View>
  );
}

export default TopbarTabbar;

const styles = ThemedStyles.create({
  scrollContainer: ['marginHorizontal2x', 'paddingRight4x'],
  tabStyleCurrent: [
    'paddingVertical2x',
    'marginTop',
    'marginHorizontal3x',
    'borderBottom5x',
    'bcolorTabBorder',
  ],
  tabStyle: [
    'paddingVertical2x',
    'marginTop',
    'marginHorizontal3x',
    'borderBottom5x',
    'bcolorTransparent',
  ],
});
