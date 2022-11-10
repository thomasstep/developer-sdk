import AccountsSDK from '@livechat/accounts-sdk';
import { AuthorizeData, ReportingAPI } from './apis';
import { liveChatLabsUrls, liveChatUrls } from './config';
import { AccountsConfig, IAccountsSDK } from './sdks';
import { ReportingUtils } from './utils';

export type DeveloperAppAuthorizationMode = 'redirect' | 'popup' | 'iframe';

export interface DeveloperAppConfig {
  appId: string;
  install?: boolean;
  auth?: {
    clientId: string;
    mode?: 'popup' | 'iframe' | 'redirect';
    // clientType?: 'javascript_app' | 'server_app';
    // scopes?: string[];
    // redirectURI?: string[];
  };
  // widget?: {
  //   url: string;
  //   placement: 'plugin' | 'fullscreen' | 'messagebox' | 'settings';
  // }[];
  // appWebhooks?: {
  //   url: string;
  // };
  // chatActions?: {
  //   url: string;
  //   label: string;
  //   action: string;
  // };
  baseURL?: string;
  stage?: 'production' | 'labs';
}

export interface DeveloperApis {
  reporting: ReportingAPI;
}

export interface DeveloperUtils {
  reporting: ReportingUtils;
}

export class DeveloperApp {
  private constructor(
    public config: DeveloperAppConfig,
    public data: {
      authorization: AuthorizeData;
    },
    public apis: DeveloperApis,
    public utils: DeveloperUtils,
    public urls: typeof liveChatUrls
  ) {}

  static async init(
    config: DeveloperAppConfig,
    customUrls?: typeof liveChatUrls
  ): Promise<DeveloperApp> {
    if (!config.auth) {
      throw new Error('config missing authorization block');
    }

    const urls = {
      ...(config.stage === 'labs' ? liveChatLabsUrls : liveChatUrls),
      ...(customUrls ?? {}),
    };

    const authorizeData = await this.authorize(
      config.auth.mode ?? 'popup',
      new AccountsSDK({
        client_id: config.auth.clientId,
        server_url: urls.accounts,
      } as AccountsConfig)
    );

    const apis: DeveloperApis = {
      reporting: new ReportingAPI({
        appId: config.appId,
        platformUrl: urls.platformApi,
        token: authorizeData.access_token,
      }),
    };

    const utils: DeveloperUtils = {
      reporting: new ReportingUtils(apis.reporting),
    };

    const app = new DeveloperApp(
      config,
      {
        authorization: authorizeData,
      },
      apis,
      utils,
      urls
    );

    try {
      await app.utils.reporting.notifyUserActivity();
    } catch {
      console.warn('There was a problem with LiveChat Developer Console API');
    }

    return app;
  }

  private static async authorize(
    authorizationMode: DeveloperAppAuthorizationMode,
    accountsSdk: IAccountsSDK
  ) {
    try {
      if (authorizationMode === 'iframe') {
        return await accountsSdk.iframe().authorize();
      }

      if (authorizationMode === 'popup') {
        return await accountsSdk.popup().authorize();
      }

      if (authorizationMode === 'redirect') {
        return await accountsSdk.redirect().authorizeData();
      }
    } catch {
      throw new Error('Problem with authorization');
    }

    throw new Error('Invalid authorization mode');
  }
}
