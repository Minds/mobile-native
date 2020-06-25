import React, { useCallback } from 'react';
import TopBar from '../../TopBar';
import ThemedStyles from '../../../styles/ThemedStyles';
import { View } from 'react-native';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';

type PropsType = {
  store: any;
  children: React.ReactNode;
  hideDone?: boolean;
  doneText?: string;
  onPressRight: Function;
};

const Wrapper = ({
  store,
  children,
  hideDone,
  doneText,
  onPressRight,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const rightText =
    hideDone === true ? null : doneText ? doneText : i18n.t('done');

  const onPressRightCallBack = useCallback(() => {
    onPressRight();
    NavigationService.goBack();
  }, [onPressRight]);

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <TopBar
        leftText={i18n.t('monetize.title')}
        rightText={rightText}
        onPressRight={onPressRightCallBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      {children}
    </View>
  );
};

export default Wrapper;
