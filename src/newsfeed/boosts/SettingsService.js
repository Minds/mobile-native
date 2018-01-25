import api from './../../common/services/api.service';


/**
 * Settings Service
 */
class SettingsService {
  settings(guid, boost_rating, mature) {
    return api.post('api/v1/settings/' + guid, {boost_rating: boost_rating, mature: mature});
  }
}

export default new SettingsService();