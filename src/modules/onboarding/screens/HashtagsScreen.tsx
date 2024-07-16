import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import TagSelect from '~/common/components/TagSelect';
import { useLegacyStores } from '~/common/hooks/use-stores';
import { Button, Screen, ScreenSection } from '~/common/ui';

import Header from '../components/Header';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

function HashTagsScreen({ navigation }) {
  const theme = sp.styles.style;
  const { hashtag } = useLegacyStores();

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
          onPress={() => sp.resolve('auth').setCompletedOnboard()}>
          Continue
        </Button>
      </ScreenSection>
    </Screen>
  );
}

export default withErrorBoundaryScreen(observer(HashTagsScreen));

const styles = sp.styles.create({
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
