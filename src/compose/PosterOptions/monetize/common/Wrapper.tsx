import React, { useCallback } from 'react';
import TopBar from '../../../TopBar';

import { View } from 'react-native';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: any;
  children: React.ReactNode;
  hideDone?: boolean;
  doneText?: string;
  onPressRight?: Function;
};

const Wrapper = ({
  store,
  children,
  hideDone,
  doneText,
  onPressRight,
}: PropsType) => {
  const theme = sp.styles.style;
  const rightText =
    hideDone === true ? null : doneText ? doneText : sp.i18n.t('done');

  const onPressRightCallBack = useCallback(() => {
    onPressRight && onPressRight();
    sp.navigation.goBack();
  }, [onPressRight]);

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText={sp.i18n.t('monetize.title')}
        rightText={rightText}
        onPressRight={onPressRightCallBack}
        onPressBack={sp.navigation.goBack}
        store={store}
        backIconName="chevron-left"
        backIconSize="large"
      />
      {children}
    </View>
  );
};

export default Wrapper;
