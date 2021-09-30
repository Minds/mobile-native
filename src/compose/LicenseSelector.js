import React, { useCallback } from 'react';
import _ from 'lodash';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import TopBar from './TopBar';
import i18n from '../common/services/i18n.service';
import NavigationService from '../navigation/NavigationService';
import { LICENSES } from '../common/services/list-options.service';
import MText from '../common/components/MText';

const licenses = LICENSES.filter(l => l.selectable);

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
      onPress={onSelect}
    >
      <MText
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}
      >
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
export default observer(function (props) {
  const theme = ThemedStyles.style;
  const store = props.route.params.store;

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="License"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <MText
        style={[
          theme.paddingVertical3x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}
      >
        {i18n.t('capture.licenseDescription')}
      </MText>

      <ScrollView style={styles.body}>
        <MText
          style={[
            theme.paddingVertical4x,
            theme.colorTertiaryText,
            theme.fontS,
            theme.paddingHorizontal3x,
          ]}
        >
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
          ]}
        >
          {i18n.t('capture.otherLicenses').toUpperCase()}
        </MText>
        {licenses.slice(2).map(o => (
          <Option
            option={o}
            store={store}
            selected={store.attachment.license === o.value}
          />
        ))}
      </ScrollView>
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
