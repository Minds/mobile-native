import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import { useLegacyStores } from '~/common/hooks/use-stores';
import Button from '../../../common/components/Button';
import Wrapper from './common/Wrapper';
import { CheckBox } from 'react-native-elements';
import MText from '../../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '~/compose/PosterOptions/PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';
import { AppStackParamList } from '~/navigation/NavigationTypes';

const createPlusMonetizeStore = () => {
  const store = {
    agreedTerms: false,
    setAgreedTerms() {
      this.agreedTerms = !this.agreedTerms;
    },
  };
  return store;
};

type PropsType = StackScreenProps<
  PosterStackParamList & AppStackParamList,
  'PlusMonetize'
>;

const PlusMonetizeScreen = observer(({ navigation }: PropsType) => {
  const { user } = useLegacyStores();
  const store = useComposeContext();
  const theme = ThemedStyles.style;

  const localStore = useLocalStore(createPlusMonetizeStore);

  const save = useCallback(() => {
    const exclusivity = null;
    store.savePlusMonetize(exclusivity);
  }, [store]);

  const onComplete = useCallback(
    (success: any) => {
      if (success) {
        user.me.togglePlus();
      }
    },
    [user],
  );

  if (!user.me.plus) {
    return (
      <Wrapper store={store} hideDone={true} onPressRight={save}>
        <View style={[theme.paddingVertical6x, theme.paddingHorizontal3x]}>
          <MText
            style={[
              theme.colorSecondaryText,
              theme.fontL,
              theme.paddingVertical2x,
            ]}>
            {i18n.t('monetize.plusMonetize.notPlus')}
          </MText>
          <Button
            text={i18n.t('monetize.plusMonetize.upgrade')}
            textStyle={styles.title}
            onPress={() =>
              navigation.push('UpgradeScreen', { onComplete, pro: false })
            }
          />
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      store={store}
      doneText={i18n.t('save')}
      onPressRight={save}
      hideDone={!localStore.agreedTerms}>
      <View style={[theme.paddingVertical6x, theme.paddingHorizontal3x]}>
        <MText
          style={[
            theme.colorSecondaryText,
            theme.fontL,
            theme.paddingVertical2x,
          ]}>
          Submit this post to Minds+ Premium Content and earn a share of our
          revenue based on how it performs.
        </MText>
        <CheckBox
          containerStyle={[theme.checkbox, styles.checkbox]}
          title={
            <MText style={[theme.colorPrimaryText, theme.fontL]}>
              I agree to the{' '}
              <MText
                style={theme.link}
                // onPress={() =>
                //   Linking.openURL('https://www.minds.com/p/monetization-terms')
                // }
              >
                Minds monetization terms{' '}
              </MText>
              and have the rights to monetize this content.
            </MText>
          }
          checked={localStore.agreedTerms}
          onPress={localStore.setAgreedTerms}
        />

        <MText style={[theme.fontL, theme.paddingLeft10x]}>
          • This content is my original content
        </MText>
        <MText
          style={[theme.fontL, theme.paddingBottom3x, theme.paddingLeft10x]}>
          • This content is exclusive to Minds+
        </MText>
        <MText
          style={[theme.fontL, theme.paddingVertical2x, theme.paddingLeft7x]}>
          I understand that violation of these requirements may result in losing
          the ability to publish Premium Content for Minds+ members.
        </MText>
      </View>
    </Wrapper>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
  checkbox: {
    marginRight: 10,
    marginVertical: 15,
    paddingTop: 0,
  },
});

export default PlusMonetizeScreen;
