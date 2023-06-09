import { createContext, useContext } from 'react';
import { ChannelRecommendationStore } from '~/common/components/ChannelRecommendation/hooks/useChannelRecommendation';
import { GroupRecommendationStore } from './hooks/useGroupRecommendation';

export type RecommendationContextType =
  | {
      groupRecommendation: GroupRecommendationStore;
      channelRecommendation: ChannelRecommendationStore;
    }
  | undefined;

export const RecommendationContext =
  createContext<RecommendationContextType>(undefined);

export default function useRecommendationContext() {
  return useContext(RecommendationContext)!;
}
