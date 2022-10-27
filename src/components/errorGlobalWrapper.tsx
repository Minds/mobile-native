import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Keyboard, Text, View } from 'react-native';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
// import { Layout } from '@ui-kitten/components';
// import { useTranslation } from 'modules/locales';

// import { Text } from './text';
// import { Button } from './button';
// import globalStyles from 'styles/globalStyles';
// import { useAlertModal } from 'services/hooks/modal';

export type ErrorGlobalWrapperProps = {
  onReset?: () => void;
  onError?: (
    error: Error,
    info: {
      componentStack: string;
    },
  ) => void;
};

export const ErrorGlobalWrapper: FunctionComponent<ErrorGlobalWrapperProps> = ({
  children,
  ...props
}): JSX.Element => {
  const [reset, setReset] = useState(false);

  const onReset = () => {
    setReset(false);
    props.onReset?.();
  };

  return (
    <ErrorBoundary
      {...props}
      onReset={onReset}
      resetKeys={[reset]}
      FallbackComponent={ErrorFallBack}>
      {children}
    </ErrorBoundary>
  );
};

function ErrorFallBack({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  const { t } = useTranslation('mainModule');
  return (
    <View onTouchStart={Keyboard.dismiss}>
      <Text>{t('Oh No.\nSomething went wrong')}</Text>
      <Text>
        {t(
          'Something has gone wrong. Should this error continue please contact our helpdesk',
        )}
      </Text>

      <Text>{t('Error - ') + error.message}</Text>

      <Button title="" onPress={resetErrorBoundary}>
        {t('Retry')}
      </Button>
    </View>
  );
}

export const ErrorGlobalModalWrapper = ({
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetErrorBoundary,
}: FallbackProps): null => {
  // const modal = useAlertModal();

  useEffect(() => {
    // modal.show({
    //   title: 'Oh no.\nSomething went wrong',
    //   message: error.message,
    //   secondAction: resetErrorBoundary,
    // });
  }, [error.message]);
  return null;
};
