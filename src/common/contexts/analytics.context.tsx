import { EventContext } from '@snowplow/react-native-tracker';
import React, { PropsWithChildren, createContext, useContext } from 'react';
import analyticsService, { ClickRef } from '../services/analytics.service';

const Context = createContext<EventContext[]>([]);

interface AnalyticsProviderProps {
  context?: EventContext | null;
}

export default function AnalyticsProvider({
  context,
  children,
}: PropsWithChildren<AnalyticsProviderProps>) {
  const contexts = useAnalyticsContext();

  return (
    <Context.Provider value={context ? [...contexts, context] : contexts}>
      {children}
    </Context.Provider>
  );
}

export const useAnalyticsContext = () => useContext(Context);
export const useAnalytics = () => {
  const analyticsContext = useAnalyticsContext();

  return {
    trackClick: (ref: ClickRef) => {
      return analyticsService.trackClick(ref, analyticsContext);
    },
    contexts: analyticsContext,
  };
};
export function withAnalyticsContext<T>(
  contextResolver: (props: T) => EventContext | null | undefined,
) {
  return (WrappedComponent: any) =>
    React.forwardRef((props: T, ref: React.Ref<T>) => (
      <AnalyticsProvider context={contextResolver(props)}>
        <WrappedComponent {...props} ref={ref} />
      </AnalyticsProvider>
    )) as any;
}
