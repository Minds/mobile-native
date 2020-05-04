//@ts-nocheck
import api from './../../common/services/api.service';

/**
 * Vote an activity
 * @param {string} guid
 * @param {string} direction up|down
 * @param {*} data extra data
 */
export async function vote(guid, direction, data) {
  const response = await api.put(
    'api/v1/votes/' + guid + '/' + direction,
    data,
  );
  return { data: response };
}
