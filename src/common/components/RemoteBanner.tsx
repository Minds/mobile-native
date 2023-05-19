import Banner from './Banner';
import Link from './Link';
import analyticsService from '../services/analytics.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Trans } from 'react-i18next';
import i18n from '../services/i18n.service';
import { Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { gqlClient } from '~/services';

const GET_TOPBAR_QUERY = gql`
  {
    topbarAlert {
      data {
        id
        attributes {
          message
          enabled
          url
          identifier
          onlyDisplayAfter
        }
      }
    }
  }
`;

export default function RemoteBanner() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['topbarAlert'],
    queryFn: async () => {
      return gqlClient().request(GET_TOPBAR_QUERY);
    },
  });

  console.log('DATA', JSON.stringify(data), isLoading, isError);

  if (!data || isLoading || isError) {
    return null;
  }

  const onPress = () => {
    analyticsService.trackClick('banner:wefounder:action');
    Linking.openURL('https://wefunder.com/minds/');
  };

  return (
    <Banner
      name="banner:wefounder"
      onPress={onPress}
      text={
        <Trans
          i18nKey="link"
          defaults={i18n.t('banners.wefounder.title')}
          components={{
            link: <RemoteLink />,
          }}
        />
      }
    />
  );
}

const RemoteLink = () => (
  <Link style={ThemedStyles.style.fontMedium}>
    {i18n.t('banners.wefounder.refer')}
  </Link>
);

// {
//   "topbarAlert": {
//     "data": {
//       "id": "1",
//       "attributes": {
//         "message": "[Refer](/settings/other/referrals) sales, fans and creators for a share of earnings.",
//         "enabled": true,
//         "url": null,
//         "identifier": "affiliates",
//         "onlyDisplayAfter": "2023-04-30T23:00:00.000Z"
//       }
//     }
//   }
// }
