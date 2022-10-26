import React, { useCallback, useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { preLoadingTasks } from './modules';

export interface ApplicationLoaderProps {
  children: (config: any) => React.ReactElement;
}

// SplashScreen.preventAutoHideAsync().then(null);

export const AppLoading = (
  props: ApplicationLoaderProps,
): React.ReactElement | null => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const defaultConfig: Record<string, unknown> = {
    mapping: 'eva',
    theme: 'light',
  };

  useEffect(() => {
    async function prepare() {
      try {
        // await SplashScreen.preventAutoHideAsync();
        await startTasks();
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      // await SplashScreen.hideAsync();
    }
  }, [loading]);

  const loadingResult = defaultConfig || {};

  const startTasks = (): Promise<unknown> =>
    preLoadingTasks
      ? Promise.all([preLoadingTasks().map(task => task())])
      : Promise.resolve();

  if (loading) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>{props.children(loadingResult)}</View>
  );
};

if (__DEV__) {
  LogBox.ignoreLogs([
    'Functions are not valid as a React child',
    'ViewPropType',
    'EdgeInsetsPropType',
    'PointPropType',
    'ColorPropType',
    // '[react-native-gesture-handler] Seems like',
    'Require cycle',
    // 'VirtualizedLists should never be nested',
    // "Accessing the 'state' property of the 'route' object is not supported",
    'Input: unsupported configuration.',
    // 'Cannot update a component from inside the function body of a different component',
    // 'Functions are not valid as a React child',
    'Found screens with the same name nested inside one another.',
    // "The action 'RESET' with payload",
    'VirtualizedLists should never be nested',
  ]);
}
