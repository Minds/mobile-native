import React, { useCallback } from 'react';
import {
  RenderPassReport,
  PerformanceProfiler,
  LogLevel,
} from '@shopify/react-native-performance';
import { ListsProfiler } from '@shopify/react-native-performance-lists-profiler';

import { IS_PERFMON_ENABLED } from '~/config/Config';
import * as Sentry from '@sentry/react-native';

export function PerformanceProvider({
  children,
}: React.PropsWithChildren<any>) {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    Sentry.captureMessage('minds_performance_report', {
      extra: (report as unknown) as Record<string, any>,
    });
  }, []);

  const onInteractiveCallback = useCallback((TTI: number, listName: string) => {
    if (TTI > 0) {
      Sentry.captureMessage('minds_list_performance', {
        extra: { listName, TTI },
      });
      console.log(`${listName}'s TTI: ${TTI}`);
    }
  }, []);

  const onBlankAreaCallback = useCallback(
    (offsetStart: number, offsetEnd: number, listName: string) => {
      if (offsetStart > 0 || offsetEnd > 0) {
        Sentry.captureMessage('minds_list_performance', {
          extra: { listName, offsetStart, offsetEnd },
        });
        console.log(
          `Blank area for ${listName}: offset: [${offsetStart}, ${offsetEnd}]`,
        );
      }
    },
    [],
  );

  const errorHandler = useCallback((error: Error) => {
    console.log(`PerformanceProfiler ERROR: ${error}`);
  }, []);

  return (
    <PerformanceProfiler
      enabled={IS_PERFMON_ENABLED}
      onReportPrepared={onReportPrepared}
      errorHandler={errorHandler}
      logLevel={LogLevel.Info}>
      <ListsProfiler
        onInteractive={onInteractiveCallback}
        onBlankArea={onBlankAreaCallback}>
        {children}
      </ListsProfiler>
    </PerformanceProfiler>
  );
}
