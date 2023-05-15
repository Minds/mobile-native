import React, { PropsWithChildren, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, View } from 'react-native';
import ErrorBoundary from '~/common/components/ErrorBoundary';

export type ErrorSuspenseProps = PropsWithChildren<{
  // ErrorFallback?: React.ComponentType<FallbackProps>;
  SuspenseFallback: React.ReactNode;
  onReset?: () => void;
  onError?: (
    error: Error,
    info: {
      componentStack: string;
    },
  ) => void;
}>;

export function ErrorSuspense(props: ErrorSuspenseProps): JSX.Element {
  const {
    // ErrorFallback = DefaultErrorFallback,
    SuspenseFallback = DefaultSuspenseFallback(),
    children,
  } = props;
  // const [reset, setReset] = useState(false);

  // const onReset = () => {
  //   setReset(false);
  //   props.onReset?.();
  // };

  return (
    <ErrorBoundary
      // onReset={onReset}
      // onError={props.onError}
      // resetKeys={[reset]}
      message="An error occurred">
      <Suspense fallback={SuspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// export function DefaultErrorFallback({
//   resetErrorBoundary,
// }: FallbackProps): JSX.Element {
//   const { t } = useTranslation('mainModule');
//   return (
//     <View>
//       <Text>{t('Please tap to retry')}</Text>
//       <Button title={t('Something went wrong')} onPress={resetErrorBoundary} />
//     </View>
//   );
// }

export function DefaultSuspenseFallback(): React.ReactNode {
  const { t } = useTranslation('mainModule');
  return (
    <View>
      <Button title={t('Loading')} />
    </View>
  );
}
