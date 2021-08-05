import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import Button from '../../common/components/Button';
import Slider from './Slider';

type PropsType = {};

const data = [
  {
    id: 'coso',
    title: 'Political Content',
    value: 50,
    leftText: 'LESS',
    rightText: 'MORE',
  },
  {
    id: 'coso',
    title: 'Opinions I disagree with',
    value: 50,
    leftText: 'LESS',
    rightText: 'MORE',
  },
  {
    id: 'coso',
    title: 'Political Beliefs',
    value: 50,
    leftText: 'LEFT',
    rightText: 'RIGHT',
  },
  {
    id: 'coso',
    title: 'Establishment',
    value: 50,
    leftText: 'TRUSTFUL',
    rightText: 'CRITICAL',
  },
];

const Questions = ({}: PropsType) => {
  return (
    <View style={styles.container}>
      <Text style={styles.desc}>{i18n.t('discovery.questionsDesc')}</Text>
      {data.map(value => (
        <Slider data={value} />
      ))}
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['paddingVertical2x'],
  desc: ['colorSecondaryText', 'marginBottom5x'],
});

export default Questions;
