import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { B2, Button, H3, IconButtonNext, IconNext } from '~/common/ui';
import { IconNameType } from '~/common/ui/icons/map';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  title: string;
  description: string | ReactNode;
  iconName: IconNameType;
  btnText: string;
  onClose?: () => void;
  onPress: () => void;
  btnSecondaryText?: string;
  onSecondaryPress?: () => void;
};

/**
 * Base in-feed notice component
 */
export default function BaseNotice({
  title,
  description,
  iconName,
  btnText,
  onPress,
  btnSecondaryText,
  onSecondaryPress,
  onClose,
}: PropsType) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <IconNext name={iconName} size="medium" color="PrimaryText" />
      </View>
      <View style={ThemedStyles.style.flexContainer}>
        <View style={ThemedStyles.style.rowJustifySpaceBetween}>
          <H3 bottom="XS">{title}</H3>
          {onClose !== undefined && (
            <View style={styles.right}>
              <IconButtonNext
                name="close"
                size="medium"
                color="PrimaryText"
                onPress={onClose}
              />
            </View>
          )}
        </View>
        <B2 color="secondary" bottom="L">
          {description}
        </B2>
        <View style={styles.buttonContainer}>
          <Button fit size="medium" type="action" onPress={onPress}>
            {btnText}
          </Button>
          {Boolean(btnSecondaryText) && (
            <Button
              size="medium"
              type="base"
              mode="outline"
              onPress={onSecondaryPress}
              top="M">
              {btnSecondaryText}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = ThemedStyles.create({
  container: [
    'paddingVerticalL',
    'paddingRightL',
    'rowJustifyStart',
    'bcolorBaseBackground',
    'borderBottom1x',
  ],
  buttonContainer: [{ marginRight: 60 }],
  right: ['paddingTopXXS', 'alignEnd', 'flexContainer'],
  left: [{ width: 60 }, 'paddingTopXS', 'alignCenter'],
});
