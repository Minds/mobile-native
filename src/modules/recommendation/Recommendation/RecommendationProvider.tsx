import React from 'react';
import type UserModel from '~/channel/UserModel';
import { RecommendationContext } from './Recommendation.context';
import useChannelRecommendation from './hooks/useChannelRecommendation';
import useGroupRecommendation from './hooks/useGroupRecommendation';

type ProviderPropTypes = {
  children: React.ReactNode;
  location: string;
  channel?: UserModel;
  types: ('channel' | 'group')[];
};

const RecommendationProvider = ({
  children,
  location,
  channel,
  types,
}: ProviderPropTypes) => {
  const channelRecommendation = useChannelRecommendation(
    location,
    channel,
    types.includes('channel'),
  );
  const groupRecommendation = useGroupRecommendation(types.includes('group'));

  return (
    <RecommendationContext.Provider
      value={{
        groupRecommendation,
        channelRecommendation,
      }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export default RecommendationProvider;
