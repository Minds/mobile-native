import React from 'react';
import { View, StyleProp, TextStyle, Platform, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ThemedStyles from '../../../styles/ThemedStyles';
import TabBarButtonTabBarItem from './TopBarButtonTabBarItem';

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

  // const renderItem = useCallback(
  //   (tab, i) => {
  //     if (!props.buttonCmp || props.buttonCmp === 'Button') {
  //       return (
  //         <Button
  //           borderless
  //           onPress={() => props.onChange(tab.id)}
  //           key={i}
  //           text={tab.title}
  //           containerStyle={[
  //             styles.buttonContainer,
  //             tab.id === props.current ? theme.bgLink : theme.bgTransparent,
  //           ]}
  //           textStyle={[
  //             styles.text,
  //             tab.id !== props.current ? theme.colorSecondaryText : {},
  //           ]}
  //         />
  //       );
  //     }

  //     if (tab.title) {
  //       return (
  //         <TouchableOpacity
  //           key={i}
  //           onPress={() => props.onChange(tab.id)}
  //           style={
  //             tab.id === props.current
  //               ? touchableContainerSelected
  //               : touchableContainer
  //           }>
  //           <TabTitle isCurrent={tab.id === props.current} title={tab.title} />
  //         </TouchableOpacity>
  //       );
  //     }

  //     if (tab.icon) {
  //       return (
  //         <IconButton
  //           scale
  //           key={i}
  //           onPress={() => props.onChange(tab.id)}
  //           name={tab.icon.name}
  //           active={tab.id === props.current}
  //           style={
  //             tab.id === props.current
  //               ? touchableContainerSelected
  //               : touchableContainer
  //           }
  //         />
  //       );
  //     }

  //     return null;
  //   },
  //   [props.buttonCmp, props.current, props.onChange],
  // );

  return (
    <View style={theme.rowJustifyStart}>
      <ScrollView
        horizontal
        ref={topBarButtonTabBarRef}
        contentContainerStyle={[
          Platform.OS === 'android'
            ? theme.paddingBottom
            : theme.paddingBottom2x,
          theme.paddingLeft3x,
          props.scrollViewContainerStyle,
        ]}>
        {props.tabs.map((tab, i) => (
          <TabBarButtonTabBarItem
            current={props.current}
            onChange={props.onChange}
            buttonCmp={props.buttonCmp}
            tab={tab}
            key={i}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default TopBarButtonTabBar;
