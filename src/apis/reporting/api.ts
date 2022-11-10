import axios, { AxiosInstance } from 'axios';
import { ReportingEvent } from './contracts';

export class ReportingAPI {
  private instance: AxiosInstance;

  constructor(
    private config: {
      appId: string;
      token: string;
      platformUrl: string;
    }
  ) {
    this.instance = axios.create({
      baseURL: config.platformUrl,
      headers: {
        ['Authorization']: `Bearer ${config.token}`,
      },
    });
  }

  async sendEvent<TPayload = unknown>(
    event: ReportingEvent<TPayload>
  ): Promise<void> {
    await this.instance.post(`/apps/${this.config.appId}/events`, event);

    return;
  }
}
