import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import Tags from '../Tags';
import { TranslateStoreType } from './createTranslateStore';
import { TranslatePropsType } from './Translate';
import { Icon } from 'react-native-elements';
import i18n from '../../services/i18n.service';
import MText from '../MText';

interface PropsType extends TranslatePropsType {
  translateStore: TranslateStoreType;
  showPicker: any;
}

const Translated = observer(
  ({ translateStore, style, showPicker }: PropsType) => {
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
            theme.bcolorPrimaryBorder,
          ]}>
          {data.map(mappingCallback)}
        </View>
        <View
          style={[theme.rowJustifyStart, theme.alignCenter, theme.marginTop]}>
          <Icon
            name="md-globe"
            type="ionicon"
            size={14}
            iconStyle={styles.icon}
          />
          <MText style={[theme.paddingLeft, theme.colorSecondaryText]}>
            {i18n.t('translate.from')}{' '}
            <MText style={theme.bold}>{translateStore.translatedFrom}</MText>
          </MText>
        </View>
        <View
          style={[theme.rowJustifyStart, theme.alignCenter, theme.marginTop]}>
          <MText
            style={[theme.bold, theme.colorPrimaryText]}
            onPress={translateStore.hide}>
            {i18n.t('hide')}
          </MText>
          <MText
            style={[theme.bold, theme.colorPrimaryText, theme.paddingLeft2x]}
            onPress={showPicker}>
            {i18n.t('translate.changeLanguage')}
          </MText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  icon: {
    marginTop: 2,
  },
});

export default Translated;
