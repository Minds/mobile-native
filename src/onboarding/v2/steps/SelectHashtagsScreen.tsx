import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { showNotification } from '~/../AppMessages';
import Button from '~/common/components/Button';
import MText from '~/common/components/MText';
import TagSelect from '~/common/components/TagSelect';
import { useLegacyStores } from '~/common/hooks/use-stores';

import ModalContainer from './ModalContainer';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

/**
 * Select Hashtag Screen
 */
export default withErrorBoundaryScreen(
  observer(function SelectHashtagsScreen({ navigation, route }) {
    const theme = sp.styles.style;

    const { hashtag } = useLegacyStores();

    React.useEffect(() => {
      hashtag.loadSuggested();
      let unsubscribe;

      // prevent leaving the screen if it is the initial screen
      if (route.params?.initial) {
        unsubscribe = navigation.addListener('beforeRemove', e => {
          if (hashtag.selectedCount >= 3) {
            return;
          }
          showNotification(sp.i18n.t('onboarding.selectThreeTags'), 'warning');
          // Prevent default behavior of leaving the screen
          e.preventDefault();
        });
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }

        // refresh in-feed notices when leaving the screen
        sp.resolve('inFeedNotices').load();
      };
    }, [hashtag, navigation, route]);

    const onPress = () => {
      if (hashtag.suggested.filter(s => s.selected).length >= 3) {
        sp.navigation.goBack();
      } else {
        showNotification(sp.i18n.t('onboarding.selectThreeTags'), 'warning');
      }
    };

    const backgroundColor = sp.styles.getColor('PrimaryBackground');
    const startColor = backgroundColor + '00';
    const endColor = backgroundColor + 'FF';
    const gradient = (
      <LinearGradient
        colors={[startColor, endColor]}
        style={styles.linear}
        pointerEvents="none"
      />
    );

    return (
      <ModalContainer
        title="Hashtags"
        contentContainer={theme.alignSelfCenterMaxWidth}
        onPressBack={sp.navigation.goBack}>
        <View style={[theme.flexContainer, theme.paddingHorizontal4x]}>
          <ScrollView contentContainerStyle={theme.paddingBottom7x}>
            <MText
              style={[theme.fontLM, theme.textCenter, theme.marginBottom2x]}>
              {sp.i18n.t('onboarding.hashtagDescription')}
            </MText>
            <TagSelect
              tagStyle={styles.hashtag}
              tagSelectedStyle={theme.bcolorIconActive}
              textSelectedStyle={theme.colorPrimaryText}
              textStyle={[theme.colorSecondaryText, theme.fontLM, theme.bold]}
              onTagDeleted={hashtag.deselect}
              onTagAdded={hashtag.select}
              tags={hashtag.suggested}
              disableSort={true}
            />
          </ScrollView>
          {gradient}
          <Button
            onPress={onPress}
            text={sp.i18n.t('done')}
            containerStyle={[
              theme.transparentButton,
              theme.fullWidth,
              theme.bcolorPrimaryBorder,
            ]}
            textStyle={theme.buttonText}
          />
        </View>
      </ModalContainer>
    );
  }),
  'SelectHashtagsScreen',
);

const styles = StyleSheet.create({
  textsContainer: {
    alignItems: 'center',
  },
  hashtag: {
    backgroundColor: '#00000050',
    margin: 8,
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#979797',
  },
  linear: {
    position: 'absolute',
    height: 80,
    width: '100%',
    left: 0,
    bottom: 30,
  },
});
