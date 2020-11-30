import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../../common/components/Button';
import TagSelect from '../../../common/components/TagSelect';
import { useLegacyStores } from '../../../common/hooks/use-stores';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';

/**
 * Verify Email Modal Screen
 */
export default observer(function SelectHashtagsScreen() {
  const theme = ThemedStyles.style;

  const { hashtag } = useLegacyStores();

  React.useEffect(() => {
    hashtag.loadSuggested();
  }, [hashtag]);

  const backgroundColor = ThemedStyles.getColor('primary_background');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';
  const gradient = (
    <LinearGradient colors={[startColor, endColor]} style={styles.linear} />
  );

  return (
    <ModalContainer title="Hashtags" onPressBack={NavigationService.goBack}>
      <View style={[theme.flexContainer, theme.paddingHorizontal4x]}>
        <Text style={[theme.fontLM, theme.textCenter]}>
          {i18n.t('onboarding.hashtagDescription')}
        </Text>
        <TagSelect
          tagStyle={styles.hashtag}
          tagSelectedStyle={theme.borderIconActive}
          textSelectedStyle={theme.colorPrimaryText}
          textStyle={[theme.colorSecondaryText, theme.fontLM, theme.bold]}
          onTagDeleted={hashtag.deselect}
          onTagAdded={hashtag.select}
          tags={hashtag.suggested}
          disableSort={true}
        />
        {gradient}
        <Button
          onPress={NavigationService.goBack}
          text={i18n.t('done')}
          containerStyle={[
            theme.transparentButton,
            theme.paddingVertical3x,
            theme.fullWidth,
            theme.marginTop,
            theme.borderPrimary,
          ]}
          textStyle={theme.buttonText}
        />
      </View>
    </ModalContainer>
  );
});

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
    height: 50,
    width: '100%',
    left: 0,
    bottom: 60,
    zIndex: 9999,
  },
});
