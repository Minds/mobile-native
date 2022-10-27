import React, { Suspense, useState } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native';

export type ErrorSuspenseProps = {
  ErrorFallback?: React.ComponentType<FallbackProps>;
  SuspenseFallback?: NonNullable<React.ReactNode> | null;
  children: React.ReactChildren | React.ReactNode | React.ReactNode[];
  onReset?: () => void;
  onError?: (
    error: Error,
    info: {
      componentStack: string;
    },
  ) => void;
};
export function ErrorSuspense(props: ErrorSuspenseProps): JSX.Element {
  const {
    ErrorFallback = DefaultErrorFallback,
    SuspenseFallback = DefaultSuspenseFallback,
    children,
  } = props;
  const [reset, setReset] = useState(false);

  const onReset = () => {
    setReset(false);
    props.onReset?.();
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={props.onError}
      resetKeys={[reset]}>
      <Suspense fallback={SuspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function DefaultErrorFallback({
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  const { t } = useTranslation('mainModule');
  return (
    <View>
      <Text>{t('Please tap to retry')}</Text>
      <Button title={t('Something went wrong')} onPress={resetErrorBoundary} />
    </View>
  );
}

export function DefaultSuspenseFallback(): JSX.Element {
  const { t } = useTranslation('mainModule');
  return (
    <View>
      <Button title={t('Loading')} />
    </View>
  );
}
