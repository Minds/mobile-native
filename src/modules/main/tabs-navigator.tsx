import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  BottomNavigationTab,
  Divider,
  BottomNavigation,
  useTheme,
} from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'utils/locales';
import { Icon, IconStyle, Text } from 'components/.';
import { SubscriptionPickerBottomSheet } from './widgets/subscriptionPickerBottomSheet';
import { renderNavigationTab, renderTabScreens } from './modules';

const ROOT_ROUTES: string[] = ['Home', 'Payments', 'Hub'];

const BottomTab = createBottomTabNavigator();
export function TabsNavigator(): React.ReactElement {
  return (
    <>
      <BottomTab.Navigator
        screenOptions={({ navigation }) => {
          const { routes, index } = navigation.getState();
          const route = routes[index];
          return {
            tabBarStyle:
              ROOT_ROUTES.includes(route.name) &&
              (route.state?.index || 0) === 0
                ? { display: 'none' }
                : null,
            headerShown: false,
          };
        }}
        initialRouteName={ROOT_ROUTES[0]}
        backBehavior={'history'}
        tabBar={props => <BottomTabBar {...props} />}>
        {renderTabScreens(BottomTab.Screen as React.ComponentType)}
      </BottomTab.Navigator>
      <SubscriptionPickerBottomSheet />
    </>
  );
}

function BottomTabBar({
  navigation,
  descriptors,
}: BottomTabBarProps): React.ReactElement {
  const { index, routes } = navigation.getState();
  const focusedRoute = routes[index];
  const { tabBarStyle } = descriptors[focusedRoute.key].options;
  const transforms = useVisibilityAnimation(!tabBarStyle);
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation('mainContainer');
  const bottomTabStyle = !tabBarStyle
    ? ({ display: 'none' } as ViewStyle)
    : { backgroundColor: theme['background-basic-color-1'] };

  const onSelect = (index: number): void => {
    navigation.navigate(routes[index].name);
  };

  const animatedStyle = {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme['background-basic-color-1'],
    paddingBottom: tabBarStyle ? Math.max(safeAreaInsets.bottom, 0) : -150,

    ...transforms,
  };
  return (
    <Animated.View
      style={[
        animatedStyle,
        { backgroundColor: theme['background-basic-color-1'] },
      ]}>
      <Divider />
      <BottomNavigation
        appearance="noIndicator"
        selectedIndex={index}
        style={bottomTabStyle}
        onSelect={onSelect}>
        {renderNavigationTab(({ name, iconName }, index) => (
          <BottomNavigationTab
            key={`${index}`}
            title={props => <Text {...props}>{t(name)}</Text>}
            icon={props => {
              const isActive =
                (props?.style as IconStyle)?.tintColor ===
                theme['color-primary-default'];
              const name = `${iconName}${isActive ? '-active' : '-inactive'}`;
              return <Icon {...props} name={name} />;
            }}
          />
        ))}
      </BottomNavigation>
    </Animated.View>
  );
}

const useVisibilityAnimation = (visible: boolean): ViewStyle => {
  const animation = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0),
  );
  React.useEffect(() => {
    Animated.timing(animation.current, {
      duration: 200,
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateY = (animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 58],
  }) as never) as number;

  return {
    transform: [{ translateY }],
    position: visible ? undefined : 'absolute',
  };
};
