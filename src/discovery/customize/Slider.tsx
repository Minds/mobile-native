import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Slider as ValueSlider } from 'react-native-elements';
import { useLocalStore } from 'mobx-react';

type data = {
  id: string;
  title: string;
  value: number;
  leftText: string;
  rightText: string;
};

type PropsType = {
  data: data;
};

const Slider = ({ data }: PropsType) => {
  const store = useLocalStore(() => ({
    question: data,
    onChange(value: number) {
      this.question.value = value;
    },
    get title() {
      return i18n.tf(
        `discovery.customizeQuestions.${this.question.id}.title`,
        this.question.title,
      );
    },
    get leftText() {
      return i18n.tf(
        `discovery.customizeQuestions.${this.question.id}.leftText`,
        this.question.leftText,
      );
    },
    get rightText() {
      return i18n.tf(
        `discovery.customizeQuestions.${this.question.id}.rightText`,
        this.question.rightText,
      );
    },
  }));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{store.title}</Text>
      <ValueSlider
        value={store.question.value}
        onSlidingComplete={store.onChange}
        thumbTintColor={ThemedStyles.getColor('Link')}
        minimumValue={0}
        maximumValue={100}
        maximumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
        minimumTrackTintColor={ThemedStyles.getColor('PrimaryBorder')}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{store.leftText}</Text>
        <Text style={styles.text}>{store.rightText}</Text>
      </View>
    </View>
  );
};

const styles = ThemedStyles.create({
  container: ['marginBottom7x'],
  title: ['fontL', 'fontMedium'],
  textContainer: ['rowJustifySpaceBetween'],
  text: [{ fontSize: 13 }, 'fontMedium', 'colorSecondaryText'],
});

export default Slider;
