import React from 'react';
import {
  DefaultErrorFallback,
  DefaultSuspenseFallback,
  ErrorSuspense,
} from './ErrorSuspense';

type WidgetProps = {
  title?: string;
  onViewAll?: () => void;
  children: React.ReactChildren | React.ReactNode | React.ReactNode[];
};

export function Widget(props: WidgetProps): JSX.Element {
  const { children, ...rest } = props;
  const errorSuspenseProps = {
    SuspenseFallback: DefaultSuspenseFallback,
    ErrorFallback: DefaultErrorFallback,
    children,
    ...rest,
  };

  return <ErrorSuspense {...errorSuspenseProps} />;
}
