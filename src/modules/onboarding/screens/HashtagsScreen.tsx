import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import TagSelect from '~/common/components/TagSelect';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { Button, Screen, ScreenSection } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import Header from '../components/Header';
import { useIsFeatureOn } from 'ExperimentsProvider';
import AuthService from '~/auth/AuthService';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { useSurveyData } from '../hooks';

function HashTagsScreen({ navigation }) {
  const theme = ThemedStyles.style;
  const { hashtag } = useLegacyStores();
  const { noData } = useSurveyData();

  const mandatoryOnboarding = useIsFeatureOn(
    'minds-3921-mandatory-onboarding-tags',
  );

  const next = () =>
    mandatoryOnboarding
      ? navigation.navigate(noData ? 'OnboardingChannels' : 'OnboardingSurvey')
      : AuthService.setCompletedOnboard();

  React.useEffect(() => {
    hashtag.loadSuggested();
  }, [hashtag, navigation]);

  return (
    <Screen safe>
      <Header
        title="Hashtags"
        description="Select at least 3 tags that are of interest to you. This helps us
          recommend relevant content."
      />
      <ScrollView>
        <TagSelect
          tagStyle={styles.hashtag}
          tagSelectedStyle={styles.selected}
          textSelectedStyle={theme.colorPrimaryText}
          textStyle={styles.text}
          onTagDeleted={hashtag.deselect}
          onTagAdded={hashtag.select}
          tags={hashtag.suggested}
          disableSort={true}
        />
      </ScrollView>
      <ScreenSection bottom="L">
        <Button
          type="action"
          size="large"
          disabled={hashtag.selectedCount < 3}
          onPress={next}>
          Continue
        </Button>
      </ScreenSection>
    </Screen>
  );
}

export default withErrorBoundaryScreen(observer(HashTagsScreen));

const styles = ThemedStyles.create({
  text: ['colorSecondaryText', 'fontM', 'bold'],
  hashtag: [
    {
      margin: 8,
      padding: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      borderWidth: 1,
    },
    'bcolorPrimaryBorder',
  ],
  selected: ['bgLink', 'bcolorLink'],
});
