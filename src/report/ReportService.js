import api from './../common/services/api.service';

/**
 * Report Service
 */
class ReportService {

  report(entity_guid, reason_code, sub_reason_code , note) {
    return api.post('api/v2/moderation/report', {entity_guid, reason_code, sub_reason_code, note});
  }

}

export default new ReportService();