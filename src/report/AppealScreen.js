//@ts-nocheck
import React, { useCallback, useState } from 'react';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import { Text, Alert } from 'react-native';
import Button from '../common/components/Button';
import reportService from './ReportService';
import { useNavigation } from '@react-navigation/native';

export default function({route}) {
  const CS = ThemedStyles.style;
  const appeal = route.params?.appeal ?? null;
  const navigation = useNavigation();
  if (!appeal) {
    return (
      <View style={[CS.flexContainer, CS.backgroundSecondary, CS.centered]}>
        <Text>{i18n.t('settings.reportedContent.noAppealData')}</Text>
      </View>
    );
  }

  const [note, setNote] = useState(appeal.note);
  const [loading, setLoading] = useState(false);

  const save = useCallback( async () => {
    setLoading(true);
    try {
      await reportService.sendAppealNote(appeal.report.urn, note);
      setLoading(false);
      navigation.goBack();
    } catch(err) {
      setLoading(false);
      Alert.alert(i18n.t('ops'), i18n.t('settings.reportedContent.noAppealData'));
    }
  }, [setLoading, navigation]);

  return (
    <View style={[CS.flexContainer, CS.backgroundSecondary]}>
      <View style={styles.posterWrapper}>
          <TextInput
            style={[styles.poster, CS.colorPrimaryText]}
            editable={true}
            placeholder={i18n.t('settings.reportedContent.noteType')}
            placeholderTextColor={ThemedStyles.getColor('secondary_text')}
            underlineColorAndroid='transparent'
            onChangeText={setNote}
            textAlignVertical="top"
            value={note}
            multiline={true}
            selectTextOnFocus={false}
            onSelectionChange={this.onSelectionChanges}
            testID="AppealNote"
          />
          <Button
            onPress={save}
            text={i18n.t('save')}
          />
        </View>
    </View>
  );
}

const styles = {
  posterWrapper: {
    minHeight: 100,
    flexDirection: 'row',
  },
  poster: {
    alignContent: 'flex-start',
    padding: 15,
    paddingTop: 15,
    flex: 1,
  },
}