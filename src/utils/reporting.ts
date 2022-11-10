import { ReportingAPI, ErrorType } from '../apis';

export class ReportingUtils {
  constructor(private api: ReportingAPI) {}

  async notifyUserActivity() {
    await this.api.sendEvent({
      name: 'activeUser',
    });
  }

  async sendError(type: ErrorType) {
    await this.api.sendEvent({
      name: 'error',
      payload: {
        type,
      },
    });
  }

  async sendCustomEvent<TPayload>(payload: TPayload) {
    await this.api.sendEvent({
      name: 'custom',
      payload,
    });
  }
}
