import { ReportingEventBase } from '../eventBase';

export enum ErrorType {
  '4xx' = '4xx',
  '5xx' = '5xx',
}

export interface ErrorReportingEvent extends ReportingEventBase {
  name: 'error';
  payload: {
    type: ErrorType;
  };
}
