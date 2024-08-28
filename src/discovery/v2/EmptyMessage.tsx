import { View } from 'react-native';
import { B2, H3, Icon } from '~/common/ui';
import Button from '~/common/components/Button';
import { IconMapNameType } from '~/common/ui/icons/map';

import sp from '~/services/serviceProvider';

type EmptyMessageProps = {
  icon?: IconMapNameType;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onPress?: () => void;
};
export const EmptyMessage = ({
  icon = 'ignite',
  title,
  subtitle,
  buttonText,
  onPress,
}: EmptyMessageProps) => {
  return (
    <View style={styles.container}>
      <Icon
        name={icon}
        size={24}
        style={styles.icon}
        color={sp.styles.theme === 1 ? 'White' : 'Black'}
      />
      <View style={styles.text}>
        <H3>{title}</H3>
        <B2 color="secondary" top="S" bottom="L">
          {subtitle}
        </B2>
        {onPress && buttonText ? (
          <Button
            text={buttonText}
            large
            primary
            centered={false}
            onPress={onPress}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = sp.styles.create({
  container: ['flexContainer', 'rowJustifySpaceBetween', 'marginVerticalXXL'],
  icon: ['marginHorizontalXXL', 'marginTop1x'],
  text: ['flexContainer', 'marginRightXL'],
});
