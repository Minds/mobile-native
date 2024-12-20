import React, { PropsWithChildren, createContext, useContext } from 'react';
import type { ClickRef, EventContext } from '../services/analytics.service';
import sp from '~/services/serviceProvider';
const Context = createContext<EventContext[]>([]);

interface AnalyticsProviderProps {
  context?: EventContext | EventContext[] | null;
}

export default function AnalyticsProvider({
  context,
  children,
}: PropsWithChildren<AnalyticsProviderProps>) {
  const contexts = useAnalyticsContext();

  const newContexts = [...contexts];

  if (Array.isArray(context)) {
    newContexts.push(...context);
  } else if (context) {
    newContexts.push(context);
  }

  return <Context.Provider value={newContexts}>{children}</Context.Provider>;
}

export const useAnalyticsContext = () => useContext(Context);
export const useAnalytics = () => {
  const analyticsContext = useAnalyticsContext();

  return {
    trackClick: (ref: ClickRef) => {
      return sp.resolve('analytics').trackClick(ref, analyticsContext);
    },
    contexts: analyticsContext,
  };
};

export function withAnalyticsContext<T>(
  contextResolver: (
    props: T,
  ) => EventContext | EventContext[] | null | undefined,
) {
  return (WrappedComponent: any): any => {
    const WithAnalytics = React.forwardRef<any, T>((props, ref) => (
      <AnalyticsProvider context={contextResolver(props as T)}>
        <WrappedComponent {...(props as T)} ref={ref} />
      </AnalyticsProvider>
    ));
    return WithAnalytics as any;
  };
}
