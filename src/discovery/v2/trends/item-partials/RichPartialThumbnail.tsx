import React from 'react';
import SmartImage from '../../../../common/components/SmartImage';
import type ActivityModel from '../../../../newsfeed/ActivityModel';
import { styles } from '../DiscoveryTrendsListItem';

type PropsType = {
  entity: ActivityModel;
  isHero?: boolean;
};

const RichPartialThumbnail = ({ entity, isHero }: PropsType) => {
  if (!entity.thumbnail_src) {
    return null;
  }
  const uri = entity.thumbnail_src.startsWith('//')
    ? `https:${entity.thumbnail_src}`
    : entity.thumbnail_src;
  const image = { uri };

  return (
    <SmartImage
      source={image}
      style={[styles.thumbnail, isHero ? styles.heroThumbnail : null]}
      resizeMode="cover"
    />
  );
};

export default RichPartialThumbnail;
