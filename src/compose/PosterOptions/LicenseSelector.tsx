import React, { FC, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import { LICENSES } from '~/common/services/list-options.service';
import MText from '../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '~/compose/PosterOptions/PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';

const licenses = LICENSES.filter(l => l.selectable);

interface LicenseSelectorProps
  extends FC,
    StackScreenProps<PosterStackParamList, 'LicenseSelector'> {}

/**
 * Option
 * @param {Object} props
 */
const Option = props => {
  const onSelect = useCallback(() => {
    props.store.attachment.setLicense(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <TouchableOpacity
      style={[styles.optsRow, ThemedStyles.style.bcolorPrimaryBorder]}
      onPress={onSelect}>
      <MText
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}>
        {props.option.text}
      </MText>
      {props.selected && (
        <MIcon
          name="check"
          size={23}
          style={ThemedStyles.style.colorPrimaryText}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * License selector
 */
export default observer(function ({}: LicenseSelectorProps) {
  const theme = ThemedStyles.style;
  const store = useComposeContext();

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="License"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        backIconName="chevron-left"
        backIconSize="large"
        store={store}
      />
      <MText
        style={[
          theme.paddingVertical3x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.licenseDescription')}
      </MText>

      <BottomSheetScrollView>
        <MText
          style={[
            theme.paddingVertical4x,
            theme.colorTertiaryText,
            theme.fontS,
            theme.paddingHorizontal3x,
          ]}>
          {i18n.t('capture.pupularLicenses').toUpperCase()}
        </MText>

        {licenses.slice(0, 2).map(o => (
          <Option
            option={o}
            store={store}
            selected={store.attachment.license === o.value}
          />
        ))}

        <MText
          style={[
            theme.paddingVertical4x,
            theme.colorTertiaryText,
            theme.fontS,
            theme.paddingHorizontal3x,
          ]}>
          {i18n.t('capture.otherLicenses').toUpperCase()}
        </MText>
        {licenses.slice(2).map(o => (
          <Option
            option={o}
            store={store}
            selected={store.attachment.license === o.value}
          />
        ))}
      </BottomSheetScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  optsContainer: {
    marginBottom: 10,
  },
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
