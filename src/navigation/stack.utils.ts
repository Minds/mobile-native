import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

export type ScreenProps<T> = {
  name: T;
  // eslint-disable-next-line no-undef
  comp: () => React.ComponentType<any>;
  options?: any;
  initialParams?: Partial<{}>;
  navigationKey?: string;
  hideIf?: boolean;
  bypassErrorBoundary?: boolean;
};

export const screenProps = (props: ScreenProps<any>) => {
  const { comp, bypassErrorBoundary = true, ...rest } = props;
  return {
    key: rest.name,
    ...rest,
    getComponent: bypassErrorBoundary
      ? comp
      : () => {
          const Component = comp();
          return withErrorBoundaryScreen(Component, rest.name);
        },
  };
};
