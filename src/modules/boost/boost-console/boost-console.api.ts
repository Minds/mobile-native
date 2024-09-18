import { ApiResponse } from '~/common/services/ApiResponse';
import { isNetworkError } from '~/common/services/ApiErrors';
import BoostModelV3 from '../models/BoostModelV3';
import { BoostConsoleBoost, BoostStatus } from './types/BoostConsoleBoost';
import sp from '~/services/serviceProvider';

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

    const data: any = await sp.api.get(
      `api/v2/boost/${filter}/${peer_filter}`,
      {
        offset: offset,
        limit: 15,
      },
    );

    return {
      entities: data.boosts || [],
      offset: data['load-next'],
    };
  } catch (err) {
    if (!isNetworkError(err)) {
      sp.log.exception('[BoostConsoleService]', err);
    }
    throw new Error(sp.i18n.t('boosts.errorGet'));
  }
}

export async function getBoostsV3(
  offset,
  location: 'feed' | 'sidebar' | 'explore',
  status?: BoostStatus,
) {
  try {
    const data = await sp.api.get<BoostsResponse>('api/v3/boosts/', {
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
      sp.log.exception('[BoostConsoleService]', err);
    }
    throw new Error(sp.i18n.t('boosts.errorGet'));
  }
}

export function revokeBoost(guid) {
  return sp.api.post(`api/v3/boosts/${guid}/cancel`);
}

export function rejectBoost(guid) {
  return sp.api.post(`api/v3/boosts/${guid}/reject`);
}

export function acceptBoost(guid) {
  return sp.api.post(`api/v3/boosts/${guid}/approve`);
}

export async function getSingleBoost(
  guid: string,
): Promise<BoostModelV3 | null> {
  const { boost } = await sp.api.get<SingleBoostsResponse>(
    `api/v3/boosts/${guid}`,
  );

  return boost ? BoostModelV3.create(boost) : null;
}
