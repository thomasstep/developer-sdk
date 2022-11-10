import { ReportingEventBase } from '../eventBase';

export interface ActiveUserReportingEvent extends ReportingEventBase {
  name: 'activeUser';
}
