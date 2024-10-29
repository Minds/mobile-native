import React from 'react';

import { SocialProfile, SocialProfileMeta } from '../../types/Common';
import FaIcon from '@expo/vector-icons/FontAwesome5';
import { Linking, View } from 'react-native';
import sp from '~/services/serviceProvider';

const getSocialProfileMeta = (key: string): SocialProfileMeta => {
  let defaultMeta: SocialProfileMeta = {
    key: '',
    label: '',
    link: '#',
    icon: 'Link',
    domain: '',
  };

  if (!key) {
    return defaultMeta;
  }

  for (let i in socialProfileMeta) {
    if (socialProfileMeta[i].key === key) {
      return socialProfileMeta[i];
    }
  }

  return defaultMeta;
};

/**
 * Polyfill for pre-2019 social profile metadata in channels
 * @param profiles
 */
const buildFromLegacyChannelProfile = (
  profiles: Array<SocialProfile>,
): Array<SocialProfile> => {
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].key !== 'other' && !profiles[i].value.includes('/')) {
      profiles[i].value = getSocialProfileMeta(profiles[i].key).link.replace(
        ':value',
        profiles[i].value,
      );
    }
  }

  return profiles;
};

type PropsType = {
  socialLinks?: Array<SocialProfile>;
};

const SocialLinks = ({ socialLinks }: PropsType) => {
  const theme = sp.styles.style;

  if (!socialLinks) {
    return null;
  }

  const parsedSocialLinks = buildFromLegacyChannelProfile(socialLinks)
    .filter(socialLink => socialLink.key && socialLink.value)
    .map(socialLink => {
      socialLink = { ...socialLink }; // Clone

      if (!socialLink.value.toLowerCase().startsWith('http')) {
        socialLink.value = `https://${socialLink.value}`;
      }

      return socialLink;
    });

  return (
    <View style={theme.rowJustifyStart}>
      {parsedSocialLinks.map(socialLink => {
        const meta = getSocialProfileMeta(socialLink.key);
        return (
          <FaIcon
            key={socialLink.key}
            name={meta.icon}
            size={16}
            onPress={() => Linking.openURL(socialLink.value)}
            color={sp.styles.getColor('Icon')}
            style={theme.marginHorizontal}
          />
        );
      })}
    </View>
  );
};

export default SocialLinks;

export const socialProfileMeta: SocialProfileMeta[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    link: 'https://www.facebook.com/:value',
    icon: 'facebook-official',
    domain: 'facebook.com',
  },
  {
    key: 'github',
    label: 'Github',
    link: 'https://github.com/:value',
    icon: 'github',
    domain: 'github.com',
  },
  {
    key: 'twitch',
    label: 'Twitch',
    link: 'https://www.twitch.tv/:value',
    icon: 'twitch',
    domain: 'twitch.tv',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    link: 'https://linkedin.com/in/:value',
    icon: 'linkedin',
    domain: 'linkedin.com',
  },
  {
    key: 'youtube_channel',
    label: 'YouTube Channel',
    link: 'https://www.youtube.com/channel/:value',
    icon: 'youtube',
    domain: 'youtube.com',
  },
  {
    key: 'reddit',
    label: 'Reddit',
    link: 'https://www.reddit.com/u/:value',
    icon: 'reddit',
    domain: 'reddit.com',
  },
  {
    key: 'soundcloud',
    label: 'SoundCloud',
    link: 'https://soundcloud.com/:value',
    icon: 'soundcloud',
    domain: 'soundcloud.com',
  },
  {
    key: 'tumblr',
    label: 'Tumblr Site',
    link: 'https://:value.tumblr.com',
    icon: 'tumblr',
    domain: 'tumblr.com',
  },
  {
    key: 'twitter',
    label: 'Twitter',
    link: 'https://twitter.com/:value',
    icon: 'twitter',
    domain: 'twitter.com',
  },
  {
    key: 'github',
    label: 'Github',
    link: 'https://github.com/:value',
    icon: 'github',
    domain: 'github.com',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    link: 'https://www.instagram.com/:value',
    icon: 'instagram',
    domain: 'instagram.com',
  },
  {
    key: 'wikipedia_user',
    label: 'Wikipedia User',
    link: 'https://wikipedia.org/wiki/:value',
    icon: 'wikipedia-w',
    domain: 'wikipedia.com',
  },
  {
    key: 'imdb_user',
    label: 'IMDb User',
    link: 'https://www.imdb.com/name/:value',
    icon: 'imdb',
    domain: 'imdb.com',
  },
  {
    key: 'steam',
    label: 'Steam Profile',
    link: 'https://steamcommunity.com/id/:value/',
    icon: 'steam',
    domain: 'steamcommunity.com',
  },
  {
    key: 'deviantart',
    label: 'Deviantart User',
    link: 'https://:value.deviantart.com/',
    icon: 'deviantart',
    domain: 'deviantart.com',
  },
  {
    key: 'discord',
    label: 'Discord Server',
    link: 'https://discord.me/:value',
    icon: 'discord',
    domain: 'discord.me',
  },
  {
    key: 'flickr',
    label: 'Flickr Profile',
    link: 'https://www.flickr.com/photos/:value/',
    icon: 'flickr',
    domain: 'flickr.com',
  },
  {
    key: 'flipboard',
    label: 'Flipboard Profile',
    link: 'https://www.flipboard.com/:value',
    icon: 'flipboard',
    domain: 'flipboard.com',
  },
  {
    key: 'gitlab',
    label: 'Gitlab Profile',
    link: 'https://www.gitlab.com/:value',
    icon: 'gitlab',
    domain: 'gitlab.com',
  },
  {
    key: 'gitter',
    label: 'Gitter Profile',
    link: 'https://gitter.im/:value',
    icon: 'gitter',
    domain: 'gitter.im',
  },
  {
    key: 'goodreads',
    label: 'Goodreads Profile',
    link: 'https://www.goodreads.com/user/show/:value',
    icon: 'goodreads',
    domain: 'goodreads.com',
  },
  {
    key: 'google_plus',
    label: 'Google Plus Profile',
    link: 'https://plus.google.com/:value',
    icon: 'google-plus',
    domain: 'google.com',
  },
  {
    key: 'mastodon',
    label: 'Mastodon Profile',
    link: 'https://mastodon.social/:value',
    icon: 'mastodon',
    domain: 'mastodon.social',
  },
  {
    key: 'medium',
    label: 'Medium Profile',
    link: 'https://medium.com/:value',
    icon: 'medium-m',
    domain: 'medium.com',
  },
  {
    key: 'patreon',
    label: 'Patreon Profile',
    link: 'https://www.patreon.com/:value',
    icon: 'patreon',
    domain: 'patreon.com',
  },
  {
    key: 'slack',
    label: 'Slack Channel',
    link: 'https://:value.slack.com',
    icon: 'slack',
    domain: 'slack.com',
  },
  {
    key: 'other',
    label: 'Other',
    link: '',
    icon: 'Link',
    domain: '',
  },
];
