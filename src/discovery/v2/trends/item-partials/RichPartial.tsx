import React from 'react';
import { View, Text } from 'react-native';
import RichPartialThumbnail from './RichPartialThumbnail';
import excerpt from '../../../../common/helpers/excerpt';
import {
  DISCOVERY_TRENDING_MAX_LENGTH,
  styles,
} from '../DiscoveryTrendsListItem';
import i18n from '../../../../common/services/i18n.service';

type PropsType = {
  data: any;
};

const RichPartial = ({ data }: PropsType) => {
  const entity = data.entity;
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>
          {excerpt(data.title, DISCOVERY_TRENDING_MAX_LENGTH)}
        </Text>
        <Text style={styles.secondaryInformationBottom}>
          {data.volume} channels discussing -{' '}
          {i18n.date(parseInt(entity.time_created, 10) * 1000, 'friendly')}
        </Text>
      </View>
      <RichPartialThumbnail entity={data.entity} />
    </View>
  );
};

export default RichPartial;
