import { EventContext } from '@snowplow/react-native-tracker';
import React, { PropsWithChildren, createContext, useContext } from 'react';
import analyticsService, { ClickRef } from '../services/analytics.service';

const Context = createContext<EventContext[]>([]);

interface AnalyticsContextProps {
  context?: EventContext | null;
}

export default function AnalyticsContext({
  context,
  children,
}: PropsWithChildren<AnalyticsContextProps>) {
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
    getContexts: () => analyticsContext,
  };
};
export function withAnalyticsContext<T>(
  contextResolver: (props: T) => EventContext | null | undefined,
) {
  return (WrappedComponent: any) =>
    React.forwardRef((props: T, ref: React.Ref<T>) => (
      <AnalyticsContext context={contextResolver(props)}>
        <WrappedComponent {...props} ref={ref} />
      </AnalyticsContext>
    )) as any;
}
