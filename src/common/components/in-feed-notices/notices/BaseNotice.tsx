import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { B2, Button, H3, IconButtonNext, IconNext } from '~/common/ui';
import { IconNameType } from '~/common/ui/icons/map';
import { NoticeName } from '.';
import sp from '~/services/serviceProvider';

type PropsType = {
  name?: NoticeName;
  title: string;
  description: string | ReactNode;
  iconName: IconNameType;
  btnText: string;
  dismissable?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  btnSecondaryText?: string;
  onSecondaryPress?: () => void;
  borderless?: boolean;
};

/**
 * Base in-feed notice component
 */
export default function BaseNotice({
  name,
  title,
  description,
  iconName,
  btnText,
  dismissable = true,
  onPress,
  btnSecondaryText,
  onSecondaryPress,
  onClose,
  borderless,
}: PropsType) {
  const [dismissed, setDismissed] = React.useState(false);

  return dismissed ? null : (
    <View style={borderless ? styles.container : styles.containerBordered}>
      <View style={styles.left}>
        <IconNext name={iconName} size="medium" color="PrimaryText" />
      </View>
      <View style={sp.styles.style.flexContainer}>
        <View style={sp.styles.style.rowJustifySpaceBetween}>
          <H3 bottom="XS">{title}</H3>
          {dismissable && (
            <View style={styles.right}>
              <IconButtonNext
                name="close"
                size="medium"
                color="PrimaryText"
                onPress={() => {
                  if (name) {
                    setDismissed(true);
                    sp.resolve('inFeedNotices').dismiss(name);
                  }
                  onClose?.();
                }}
              />
            </View>
          )}
        </View>
        <B2 color="secondary" bottom="L">
          {description}
        </B2>
        <View style={styles.buttonContainer}>
          {Boolean(onPress) && (
            <Button fit size="medium" type="action" spinner onPress={onPress}>
              {btnText}
            </Button>
          )}
          {Boolean(onSecondaryPress) && (
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

const styles = sp.styles.create({
  container: [
    'paddingVerticalL',
    'paddingRightL',
    'rowJustifyStart',
    'bcolorBaseBackground',
  ],
  get containerBordered() {
    return [...this.container, 'borderBottom1x'];
  },
  buttonContainer: [{ marginRight: 60 }],
  right: ['paddingTopXXS', 'alignEnd', 'flexContainer'],
  left: [{ width: 60 }, 'paddingTopXS', 'alignCenter'],
});
