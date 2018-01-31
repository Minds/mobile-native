import api from './../common/services/api.service';


/**
 * Report Service
 */
class ReportService {

  report(guid, subject, note) {
    return api.post('api/v1/entities/report/' + guid, {subject: subject, note: note});
  }

}

export default new ReportService();