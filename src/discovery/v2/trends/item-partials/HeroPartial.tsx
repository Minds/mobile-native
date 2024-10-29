import React from 'react';
import { View } from 'react-native';
import RichPartialThumbnail from './RichPartialThumbnail';
import excerpt from '~/common/helpers/excerpt';
import {
  DISCOVERY_TRENDING_MAX_LENGTH,
  styles,
} from '../DiscoveryTrendsListItem';
import MText from '~/common/components/MText';
import sp from '~/services/serviceProvider';

type PropsType = {
  data: any;
};

const HeroPartial = ({ data }: PropsType) => {
  const entity = data.entity;
  return (
    <View style={[styles.heroContainer]}>
      <RichPartialThumbnail entity={entity} isHero />
      <View style={styles.container}>
        <View style={styles.body}>
          <MText style={styles.title}>
            {excerpt(data.title, DISCOVERY_TRENDING_MAX_LENGTH)}
          </MText>
          <MText style={styles.secondaryInformationBottom}>
            {data.volume} channels discussing -{' '}
            {sp.i18n.date(parseInt(entity.time_created, 10) * 1000, 'friendly')}
          </MText>
        </View>
      </View>
    </View>
  );
};

export default HeroPartial;
