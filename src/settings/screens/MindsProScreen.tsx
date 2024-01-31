import { Alert } from 'react-native';
import { B1, Button, Screen } from '~/common/ui';
// import i18n from '~/utils/locales';

export default function () {
  // const cancelSubscription = async () => {
  //   Alert.alert(i18n.t('confirm'), i18n.t('confirmNoUndo'), [
  //     { text: i18n.t('no'), style: 'cancel' },
  //     {
  //       text: i18n.t('yesImSure'),
  //       onPress: async () => {
  //         await this.client.delete('api/v2/pro');
  //       },
  //     },
  //   ]);
  //   try {
  //     await this.client.delete('api/v2/pro');
  //     this.toasterService.success(
  //       'You have successfully canceled your Minds Pro subscription.',
  //     );
  //     // should navigate back
  //     // this.router.navigate(['/', this.session.getLoggedInUser().username]);
  //   } catch (e) {
  //     // this.error = e.message;
  //     // this.toasterService.error('Error: ' + this.error);
  //   }
  // };
  return (
    <Screen>
      <B1 horizontal="XL2">Manage your subscription</B1>
      <Button
        mode="outline"
        type="warning"
        horizontal="XL2"
        vertical="XL2"
        spinner
        onPress={() => {}}>
        Cancel Subscription
      </Button>
      <B1 horizontal="XL2">
        You still have Minds Pro until 3:42pm on March 3rd, 2023
      </B1>
    </Screen>
  );
}
