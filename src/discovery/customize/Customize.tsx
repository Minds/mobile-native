import React from 'react';
import { View, Text } from 'react-native';
import { BottomSheet } from '../../common/components/bottom-sheet';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import CustomizeManager from './CustomizeManager';

type PropsType = {};

const Customize = ({}: PropsType) => {
  const ref = React.useRef<any>();
  const show = React.useCallback(() => {
    ref.current?.present();
  }, []);
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('discovery.customizeTitle')}</Text>
      <Text style={styles.desc}>{i18n.t('discovery.customizeDesc')}</Text>
      <Button
        text={i18n.t('discovery.customize')}
        action
        onPress={show}
        testID="customizeBtn"
      />
      <BottomSheet ref={ref}>
        <Text style={styles.titleXL}>
          {i18n.t('discovery.customizeContent')}
        </Text>
        <CustomizeManager onClose={close} />
      </BottomSheet>
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['centered', 'paddingVertical7x', 'paddingHorizontal8x'],
  title: ['colorPrimaryText', 'fontLM', 'fontMedium', 'marginBottom'],
  titleXL: ['colorPrimaryText', 'fontXXL', 'fontMedium', 'marginBottom4x'],
  desc: [
    'colorSecondaryText',
    { fontSize: 15 },
    'marginBottom4x',
    'textCenter',
  ],
});

export default Customize;
