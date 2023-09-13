import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { B3, B1, Icon } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

const colorMap = {
  gray: ['#1C1D1F77', '#1C1D1F77', '#8A8E9648'],
  yellow: ['#1C1D1F77', '#1C1D1F77', '#FFD04848'],
  purple: ['#1C1D1F77', '#1C1D1F77', '#A02BB348'],
  blue: ['#1C1D1F77', '#1C1D1F77', '#1B85D648'],
} as const;

export type CardColor = keyof typeof colorMap;

type BoostCashCardProps = {
  cardColor: CardColor;
  estimated: string;
  duration: number;
  amount: number;
  selected: boolean;
  onSelect: (color: CardColor) => void;
};
export const BoostCashCard = ({
  cardColor = 'blue',
  estimated,
  duration,
  amount,
  selected,
  onSelect,
}: BoostCashCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(cardColor)}
      style={styles.touchable}>
      <LinearGradient
        locations={[0, 0.24, 1]}
        colors={colorMap[cardColor] as unknown as string[]}
        style={styles.linear}
        start={{ x: 0.1, y: 0.2 }}
      />

      <View style={styles.topLeft}>
        <B3>Estimated view</B3>
        <B1 color="primary" font="black">
          {estimated}
        </B1>
      </View>

      <View style={styles.bottomLeft}>
        <B3>Duration</B3>
        <B1 color="primary" font="black">
          {duration} days
        </B1>
      </View>

      <Check checked={selected} />

      <View style={[styles.bottomRight, styles.pill]}>
        <B1 color="primary" font="black">
          {amount * duration} $
        </B1>
      </View>
    </TouchableOpacity>
  );
};

const Check = ({ checked }: { checked?: boolean }) => {
  return (
    <View style={[styles.topRight, checked ? styles.check : styles.checkBlank]}>
      {checked && <Icon name="check" color="Black" size="small" />}
    </View>
  );
};

const styles = ThemedStyles.create({
  touchable: [
    'marginTop6x',
    'marginHorizontal4x',
    'borderRadius12x',
    'bcolorActive',
    {
      minHeight: 120,
      borderWidth: 1,
    },
  ],
  linear: [
    'positionAbsolute',
    'borderRadius12x',
    {
      height: '100%',
      width: '100%',
    },
  ],
  rounded: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  get check() {
    return [this.rounded, 'bgLink', 'centered'];
  },
  get checkBlank() {
    return [this.rounded, 'border1x', 'bcolorWhite'];
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255,0.1)',
    borderRadius: 240,
  },
  topLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  topRight: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
