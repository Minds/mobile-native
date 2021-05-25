import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IS_IOS, BOTTOM_TABS_HEIGHT, THEME } from '../styles/Tokens';
import TopShadow from '../common/components/TopShadow';
import { useStores } from '../common/hooks/use-stores';

const { width } = Dimensions.get('screen');

const focusedState = { selected: true };

const shadowOpt = {
  width,
  color: '#000000',
  border: 3.5,
  opacity: 0.08,
  x: 0,
  y: 0,
};

export default ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const { chat } = useStores();
  // const containerStyle = useStyle(
  //   'rowJustifySpaceEvenly',
  //   'backgroundSecondary',
  //   styles.tabBar,
  // );
  const { routes, index } = state;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const routeNavigate = useCallback(
    routeName => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  const routeEmmit = useCallback(
    emmitObject => {
      return navigation.emit(emmitObject);
    },
    [navigation],
  );

  const renderIcons = useMemo(() => {
    console.log('re-rendering -- icons');
    return routes?.map((route, _index) => {
      const { options } = descriptors[route.key];
      const focused = index === _index;
      const icon = options.tabBarIcon({ focused, route });

      const onPress = () => {
        const event = routeEmmit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (route.name === 'MessengerTab') {
          chat.openChat();
          return;
        }

        if (!focused && !event.defaultPrevented) {
          routeNavigate(route.name);
        }
      };

      const onLongPress = () => {
        routeEmmit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      const Component = options.tabBarButton || TouchableOpacity;

      return (
        <Component
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityState={focused ? focusedState : null}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.buttonContainer}>
          {icon}
        </Component>
      );
    });
  }, [routes, index, chat, descriptors, routeNavigate, routeEmmit]);

  return (
    <SafeAreaView style={styles.tabBar} edges={['bottom']}>
      {!IS_IOS && <TopShadow setting={shadowOpt} />}
      {renderIcons}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: BOTTOM_TABS_HEIGHT,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: THEME.secondary_background,
  },
});
