import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import Tags from '../Tags';
import { TranslateStoreType } from './createTranslateStore';
import { TranslatePropsType } from './Translate';
import { Icon } from 'react-native-elements';
import i18n from '../../services/i18n.service';

interface PropsType extends TranslatePropsType {
  translateStore: TranslateStoreType;
}

const Translated = observer(({ translateStore, style }: PropsType) => {
  const navigation = useNavigation();
  const tagProps = {
    style,
    navigation,
  };
  const mappingCallback = useCallback(
    (v: string) => !!v && <Tags {...tagProps}>{v}</Tags>,
    [tagProps],
  );
  if (!translateStore.translated) {
    return null;
  }

  const theme = ThemedStyles.style;

  const data = translateStore.getDataFromTranslation();

  return (
    <View>
      <View
        style={[
          theme.paddingLeft2x,
          theme.marginTop2x,
          theme.borderLeft2x,
          theme.borderGreyed,
        ]}>
        {data.map(mappingCallback)}
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter, theme.marginTop]}>
        <Icon
          name="md-globe"
          type="ionicon"
          size={14}
          iconStyle={styles.icon}
        />
        <Text style={[theme.paddingLeft, theme.colorDarkGreyed]}>
          {i18n.t('translate.from')}{' '}
          <Text style={theme.bold}>{translateStore.translatedFrom}</Text>
        </Text>
      </View>
      <View style={[theme.rowJustifyStart, theme.alignCenter, theme.marginTop]}>
        <Text style={[theme.bold, theme.colorPrimaryText]} onPress={this.hide}>
          {i18n.t('hide')}
        </Text>
        <Text
          style={[theme.bold, theme.colorPrimaryText, theme.paddingLeft2x]}
          onPress={this.showPicker}>
          {i18n.t('translate.changeLanguage')}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  icon: {
    marginTop: 2,
  },
});

export default Translated;
