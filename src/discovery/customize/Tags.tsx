import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from '../../common/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import TagSelect from '../../common/components/TagSelect';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { observer } from 'mobx-react';

type PropsType = {};

const backgroundColor = ThemedStyles.getColor('PrimaryBackground');
const startColor = backgroundColor + '00';
const endColor = backgroundColor + 'FF';

const Tags = observer(({}: PropsType) => {
  const theme = ThemedStyles.style;

  const { hashtag } = useLegacyStores();

  React.useEffect(() => {
    hashtag.loadSuggested();
  }, [hashtag]);

  const gradient = (
    <LinearGradient colors={[startColor, endColor]} style={styles.linear} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('discovery.tagsTitle')}</Text>
      <Text style={styles.desc}>{i18n.t('discovery.tagsDesc')}</Text>
      <TagSelect
        tagStyle={styles.hashtag}
        tagSelectedStyle={styles.hashtagSelected}
        textSelectedStyle={styles.tagTextSelected}
        textStyle={styles.tagText}
        onTagDeleted={hashtag.deselect}
        onTagAdded={hashtag.select}
        tags={hashtag.suggested}
        disableSort={true}
      />
      {gradient}
    </View>
  );
});

const styles = ThemedStyles.create({
  container: ['paddingVertical2x'],
  title: ['fontL', 'bold', 'marginBottom'],
  desc: ['colorSecondaryText', 'marginBottom6x'],
  tagText: ['fontL', 'fontMedium'],
  tagTextSelected: ['fontL', 'fontMedium', 'colorWhite'],
  textStyle: ['colorSecondaryText', 'fontLM', 'bold'],
  hashtag: [
    'bgTransparent',
    'paddingHorizontal3x',
    'paddingVertical2x',
    'border',
    'bcolorPrimaryBorder',
  ],
  hashtagSelected: [
    'bgLink',
    'paddingHorizontal3x',
    'paddingVertical2x',
    'border',
    'bcolorLink',
  ],
  linear: [
    {
      position: 'absolute',
      height: 50,
      width: '100%',
      left: 0,
      bottom: 0,
      zIndex: 9999,
    },
  ],
});

export default Tags;
