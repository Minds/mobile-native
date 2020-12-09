import React from 'react';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { BoostStoreType } from './createBoostStore';

type PropsType = {
  localStore: BoostStoreType;
  boostType: 'channel' | 'post' | 'offer';
};

const BoostButton = ({ localStore, boostType }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <Button
      onPress={() => false}
      text={i18n.t('boosts.boostChannel')}
      containerStyle={[
        theme.backgroundPrimary,
        theme.paddingVertical2x,
        theme.paddingHorizontal4x,
        theme.marginTop1x,
        theme.marginBottom7x,
        theme.marginRight5x,
        theme.borderLink,
        theme.border,
        theme.alignSelfEnd,
      ]}
      textStyle={[theme.buttonText, theme.colorPrimaryText, theme.bold]}
    />
  );
};

export default BoostButton;
