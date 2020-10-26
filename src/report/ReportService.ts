//@ts-nocheck
import api from './../common/services/api.service';
import { REASONS } from '../common/services/list-options.service';

/**
 * Report Service
 */
class ReportService {
  report(entity_guid, reason_code, sub_reason_code, note) {
    return api.post('api/v2/moderation/report', {
      entity_guid,
      reason_code,
      sub_reason_code,
      note,
    });
  }

  async get(filter, offset) {
    return await api.get(`api/v2/moderation/appeals/${filter}`, {
      limit: 12,
      offset: offset,
    });
  }

  async sendAppealNote(urn, note) {
    return await api.post(`api/v2/moderation/appeals/${urn}`, { note });
  }

  getAction(report) {
    let friendlyString =
      report.entity && report.entity.type === 'user'
        ? 'settings.reportedContent.action.banned'
        : 'settings.reportedContent.action.removed';

    switch (report.reason_code) {
      case 2:
        friendlyString = 'settings.reportedContent.action.actionNSFW';
        break;
      case 4:
      case 8:
        if (report.entity && report.entity.type === 'user')
          friendlyString = 'settings.reportedContent.action.actionStrike';
        break;
    }

    return friendlyString;
  }

  getReasonString(report) {
    return REASONS.filter((item) => {
      if (item.hasMore && item.reasons) {
        return (
          item.value === report.reason_code &&
          item.reasons[report.sub_reason_code - 1].value ===
            report.sub_reason_code
        );
      }
      return item.value === report.reason_code;
    })
      .map((item) => {
        if (item.hasMore && item.reasons) {
          return item.reasons[report.sub_reason_code - 1].label;
        }
        return item.label;
      })
      .join(', ');
  }
}

export default new ReportService();
