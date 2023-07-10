import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import i18nService from '~/common/services/i18n.service';
import { B2, Icon, IconButton, Row } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

export default function BoostRotatorHeader() {
  const navigation = useNavigation();

  const navToBoostSettings = () => navigation.navigate('BoostSettingsScreen');

  return (
    <View style={styles.container}>
      <Row align="centerBoth">
        <Icon name="boost" color="Link" right="S" size={18} />
        <B2 color="link">{i18nService.t('channel.boostComposer.title')}</B2>
      </Row>

      <IconButton
        onPress={navToBoostSettings}
        name="cog"
        color="PrimaryText"
        size={20}
      />
    </View>
  );
}

const styles = ThemedStyles.create({
  container: [
    'paddingHorizontal4x',
    'rowJustifySpaceBetween',
    'alignCenter',
    'paddingVertical3x',
    'bgMutedBackground',
  ],
});
