import { observer } from 'mobx-react';
import React from 'react';
import { Platform, Text, View } from 'react-native';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { BoostStoreType } from './createBoostStore';

type PropsType = {
  localStore: BoostStoreType;
};

const BoostInput = observer(({ localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const vPadding =
    Platform.OS === 'android' ? theme.paddingVertical0x : theme.paddingVertical;
  const marginB =
    Platform.OS === 'android' ? theme.marginBottom0x : theme.marginBottom;
  const commonProps = {
    keyboardType: 'decimal-pad',
    selectTextOnFocus: true,
    style: vPadding,
    containerStyle: theme.backgroundPrimaryHighlight,
    labelStyle: [marginB, theme.fontM],
  };
  return (
    <View>
      <InputContainer
        placeholder={i18n.t('views')}
        onChangeText={localStore.setAmountViews}
        value={localStore.amountViews.toString()}
        noBottomBorder
        {...commonProps}
      />
      <InputContainer
        placeholder={i18n.t('tokens')}
        onChangeText={localStore.setAmountTokens}
        value={localStore.amountTokens.toString()}
        {...commonProps}
      />
      <Text
        style={[
          theme.textRight,
          theme.paddingRight4x,
          theme.marginTop2x,
          theme.marginBottom6x,
          theme.colorSecondaryText,
          theme.fontLM,
        ]}>
        1 token = 1000 views
      </Text>
    </View>
  );
});

export default BoostInput;
