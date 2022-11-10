import { ActiveUserReportingEvent } from './events/activeUser';
import { CustomReportingEvent } from './events/custom';
import { ErrorReportingEvent } from './events/error';

export type ReportingEvent<TPayload = unknown> =
  | ActiveUserReportingEvent
  | ErrorReportingEvent
  | CustomReportingEvent<TPayload>;
