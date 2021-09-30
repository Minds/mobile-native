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
// import { Icon } from 'react-native-elements';
import { Icon } from '~ui/icons';
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
        ]}
      >
        {props.tabs.map((tab, i) =>
          !props.buttonCmp || props.buttonCmp === 'Button' ? (
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
          ) : (
            <TouchableOpacity
              key={i}
              onPress={() => props.onChange(tab.id)}
              style={
                tab.id === props.current
                  ? touchableContainerSelected
                  : touchableContainer
              }
            >
              {!!tab.title && (
                <TabTitle
                  isCurrent={tab.id === props.current}
                  title={tab.title}
                />
              )}
              {!!tab.icon && (
                <TabIcon
                  name={tab.icon.name}
                  type={tab.icon.type}
                  isCurrent={tab.id === props.current}
                />
              )}
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
    </View>
  );
}

const TabIcon = ({ name, type, isCurrent }) => (
  <Icon name={name} active={isCurrent} size={21} type={type} />
);

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
