import React, { PropsWithChildren } from 'react';
import { DefaultSuspenseFallback, ErrorSuspense } from './ErrorSuspense';

type WidgetProps = PropsWithChildren<{
  title?: string;
  onViewAll?: () => void;
}>;

export function Widget(props: WidgetProps): React.ReactNode {
  const { children, ...rest } = props;
  const errorSuspenseProps = {
    SuspenseFallback: DefaultSuspenseFallback(),
    // ErrorFallback: DefaultErrorFallback,
    children,
    ...rest,
  };

  return <ErrorSuspense {...errorSuspenseProps} />;
}
