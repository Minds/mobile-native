import React from 'react';
import { View, StyleProp, TextStyle, StyleSheet } from 'react-native';
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
    <View style={[theme.rowJustifyStart, theme.paddingLeft]}>
      <ScrollView
        horizontal
        ref={topBarButtonTabBarRef}
        snapToAlignment={'center'}>
        {props.tabs.map((tab, i) => (
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
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
});

export default TopBarButtonTabBar;
