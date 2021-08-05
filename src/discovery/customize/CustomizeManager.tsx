import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from '../../common/components/Button';
import { observer, useLocalStore } from 'mobx-react';
import Questions from './Questions';
import Tags from './Tags';

type PropsType = {
  onClose: () => void;
};

const CustomizeManager = observer(({ onClose }: PropsType) => {
  const store = useLocalStore(() => ({
    step: 'questions' as 'questions' | 'tags',
    onContinue() {
      this.step = 'tags';
    },
    handlePress() {
      this.currrentIsQuestions ? this.onContinue() : onClose();
    },
    get buttonText() {
      return this.currrentIsQuestions ? i18n.t('continue') : i18n.t('done');
    },
    get currrentIsQuestions() {
      return this.step === 'questions';
    },
  }));

  return (
    <View>
      {store.currrentIsQuestions ? <Questions /> : <Tags />}
      <Button
        text={store.buttonText}
        action
        onPress={store.handlePress}
        containerStyle={buttonStyle}
      />
    </View>
  );
});

const buttonStyle = ThemedStyles.combine('alignSelfEnd');

export default CustomizeManager;
