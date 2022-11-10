import { ReportingEventBase } from '../eventBase';

export interface CustomReportingEvent<TPayload> extends ReportingEventBase {
  name: 'custom';
  payload: TPayload;
}
