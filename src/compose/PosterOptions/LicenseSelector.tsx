import React, { useCallback } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import TopBar from '../TopBar';
import { LICENSES } from '~/common/services/list-options.service';
import MText from '../../common/components/MText';
import { useComposeContext } from '~/compose/useComposeStore';
import MenuItemOption from '../../common/components/menus/MenuItemOption';
import sp from '~/services/serviceProvider';

const licenses = LICENSES.filter(l => l.selectable);

/**
 * Option
 * @param {Object} props
 */
const Option = props => {
  const onSelect = useCallback(() => {
    props.store.attachments.setLicense(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <MenuItemOption
      title={props.option.text}
      selected={props.selected}
      onPress={onSelect}
      noBorderTop={props.noBorderTop}
    />
  );
};

/**
 * License selector
 */
export default observer(function () {
  const theme = sp.styles.style;
  const store = useComposeContext();

  const i18n = sp.i18n;
  const navigation = sp.navigation;
  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="License"
        rightText={i18n.t('done')}
        onPressRight={navigation.goBack}
        onPressBack={navigation.goBack}
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
            key={o.text}
            option={o}
            store={store}
            selected={store.attachments.license === o.value}
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
        {licenses.slice(2).map((o, i) => (
          <Option
            key={o.text}
            option={o}
            store={store}
            selected={store.attachments.license === o.value}
            noBorderTop={i > 0}
          />
        ))}
      </BottomSheetScrollView>
    </View>
  );
});
