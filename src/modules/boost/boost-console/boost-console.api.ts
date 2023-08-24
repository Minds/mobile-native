import api, {
  ApiResponse,
  isNetworkError,
} from '~/common/services/api.service';
import i18n from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import BoostModelV3 from '../models/BoostModelV3';
import { BoostConsoleBoost, BoostStatus } from './types/BoostConsoleBoost';

type BoostsResponse = {
  boosts: BoostConsoleBoost[];
  offset?: string;
  has_more: boolean;
} & ApiResponse;

type SingleBoostsResponse = {
  boost: BoostConsoleBoost;
} & ApiResponse;

export async function getBoosts(offset, filter, peer_filter) {
  try {
    if (filter === 'feed') {
      filter = 'newsfeed';
    }

    const data: any = await api.get(`api/v2/boost/${filter}/${peer_filter}`, {
      offset: offset,
      limit: 15,
    });

    return {
      entities: data.boosts || [],
      offset: data['load-next'],
    };
  } catch (err) {
    if (!isNetworkError(err)) {
      logService.exception('[BoostConsoleService]', err);
    }
    throw new Error(i18n.t('boosts.errorGet'));
  }
}

export async function getBoostsV3(
  offset,
  location: 'feed' | 'sidebar' | 'explore',
  status?: BoostStatus,
) {
  try {
    const data = await api.get<BoostsResponse>('api/v3/boosts/', {
      offset: offset,
      limit: 15,
      status,
      location: location === 'feed' ? 1 : 2,
    });

    return {
      entities: data.boosts || [],
      offset: data.has_more ? (offset ?? 0) + 15 : 0, // v3 doesn't use offset strings
    };
  } catch (err) {
    if (!isNetworkError(err)) {
      logService.exception('[BoostConsoleService]', err);
    }
    throw new Error(i18n.t('boosts.errorGet'));
  }
}

export function revokeBoost(guid) {
  return api.post(`api/v3/boosts/${guid}/cancel`);
}

export function rejectBoost(guid) {
  return api.post(`api/v3/boosts/${guid}/reject`);
}

export function acceptBoost(guid) {
  return api.post(`api/v3/boosts/${guid}/approve`);
}

export async function getSingleBoost(
  guid: string,
): Promise<BoostModelV3 | null> {
  const { boost } = await api.get<SingleBoostsResponse>(
    `api/v3/boosts/${guid}`,
  );

  return boost ? BoostModelV3.create(boost) : null;
}
