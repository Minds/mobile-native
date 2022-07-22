import { useContext } from 'react';
import { ChannelRecommendationContext } from '../ChannelRecommendationProvider';

export default function useChannelRecommendationContext() {
  return useContext(ChannelRecommendationContext);
}
