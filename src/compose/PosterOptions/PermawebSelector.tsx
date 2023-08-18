import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react';

import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
// import MText from '../../common/components/MText';
import { useComposeContext } from '~/compose/useComposeStore';

/**
 * Permaweb selector
 */
export default observer(function () {
  const theme = ThemedStyles.style;
  const store = useComposeContext();

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText="Permaweb"
        rightText={i18n.t('done')}
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        backIconName="chevron-left"
        backIconSize="large"
        store={store}
      />
      {/* <MText style={[styles.permawebTerms]}>{i18n.t('permaweb.terms')}</MText> */}
      {/* <MText style={[styles.permawebProcessTime]}>
        {i18n.t('permaweb.processingTime')}
      </MText> */}
      <View style={[styles.checkboxContainer]}>
        <CheckBox
          title={`${i18n.t('auth.accept')} ${i18n.t(
            'auth.termsAndConditions',
          )}.`}
          containerStyle={[theme.checkbox]}
          // checked={store.postToPermaweb}
          // onPress={() => store.togglePostToPermaweb()}
          textStyle={theme.colorPrimaryText}
          // @ts-ignore
          testID="checkbox"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  // permawebTerms: {
  //   marginHorizontal: 50,
  //   marginVertical: 20,
  // },
  // permawebProcessTime: {
  //   marginHorizontal: 50,
  // },
  checkboxContainer: {
    marginHorizontal: 50,
    alignSelf: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
});
