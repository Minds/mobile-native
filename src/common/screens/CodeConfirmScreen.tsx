import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { B1, Button } from '~ui';
import { ModalFullScreen } from '~ui';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '../services/i18n.service';
import InputContainer from '../components/InputContainer';

type PropsType = {
  title: string;
  description: string;
  error?: string;
  placeholder: string;
  maxLength?: number;
  keyboardType?: string;
  detail?: React.ReactNode;
  onBack?: () => void;
  onVerify?: () => void;
  onChangeText: (t: string) => void;
  value: string;
};

/**
 * Generic code confirmation modal screen
 */
const CodeConfirmScreen = ({
  onBack,
  title,
  description,
  detail,
  onVerify,
  maxLength,
  keyboardType,
  placeholder,
  onChangeText,
  value,
  error,
}: PropsType) => {
  const theme = ThemedStyles.style;

  // Disable back button on Android
  useBackHandler(
    useCallback(() => {
      return true;
    }, []),
  );

  return (
    <ModalFullScreen
      back={Boolean(onBack)}
      onBack={onBack}
      title={title}
      extra={
        onVerify ? (
          <Button mode="flat" size="small" type="action" onPress={onVerify}>
            {i18n.t('verify')}
          </Button>
        ) : undefined
      }>
      <ScrollView>
        <B1 color="secondary" vertical="XL" horizontal="L">
          {description}
        </B1>
        <View style={theme.fullWidth}>
          <InputContainer
            maxLength={maxLength}
            keyboardType={keyboardType}
            labelStyle={theme.colorPrimaryText}
            style={theme.colorPrimaryText}
            autoFocus
            placeholder={placeholder}
            onChangeText={onChangeText}
            onEndEditing={onVerify}
            error={error ? error : ''}
            value={value}
          />
        </View>
        {detail}
      </ScrollView>
    </ModalFullScreen>
  );
};

export default CodeConfirmScreen;
