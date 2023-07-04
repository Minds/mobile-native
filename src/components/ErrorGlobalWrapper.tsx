import React, { FunctionComponent, PropsWithChildren } from 'react';
import ErrorBoundary from '~/common/components/ErrorBoundary';

export type ErrorGlobalWrapperProps = {
  onReset?: () => void;
  onError?: (
    error: Error,
    info: {
      componentStack: string;
    },
  ) => void;
};

export const ErrorGlobalWrapper: FunctionComponent<
  PropsWithChildren<ErrorGlobalWrapperProps>
> = ({ children, ...props }): JSX.Element => {
  // const [reset, setReset] = useState(false);

  // const onReset = () => {
  //   setReset(false);
  //   props.onReset?.();
  // };

  return (
    <ErrorBoundary
      {...props}
      // onReset={onReset}
      // resetKeys={[reset]}
      // FallbackComponent={ErrorFallBack}
      message="An error occurred">
      {children}
    </ErrorBoundary>
  );
};

// function ErrorFallBack({
//   error,
//   resetErrorBoundary,
// }: FallbackProps): JSX.Element {
//   const { t } = useTranslation('mainContainer');
//   return (
//     <View>
//       <Text>{t('Oh No.\nSomething went wrong')}</Text>
//       <Text>
//         {t(
//           'Something has gone wrong. Should this error continue please contact our helpdesk',
//         )}
//       </Text>
//       <Text>{t('Error - ') + error.message}</Text>
//       <Button title={t('Retry')} onPress={resetErrorBoundary} />
//     </View>
//   );
// }
