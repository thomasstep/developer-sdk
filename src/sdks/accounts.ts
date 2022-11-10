import { AuthorizeData } from '../apis';

export interface AccountsConfig {
  client_id: string;
  prompt?: string;
  response_type?: 'token' | 'code';
  popup_flow?: 'auto' | 'manual';
  state?: string;
  verify_state?: boolean;
  verify_callback?: boolean;
  scope?: null;
  redirect_uri?: string;
  email_hint?: string;
  server_url?: string;
  path?: string;
  tracking?: {
    utm_source: string;
    utm_medium: string;
  };
  transaction?: {
    namespace: string;
    key_length: number;
    force_local_storage: boolean;
  };
  pkce?: {
    enabled: boolean;
    code_verifier_length: number;
    code_challange_method: 'S256' | 'plain';
  };
}

export interface TransactionData {
  [key: string]: unknown;
}

export interface IAccountsSDK {
  iframe(config?: AccountsConfig): {
    authorize: () => Promise<AuthorizeData>;
    iframeID: () => string;
    removeIframe: () => void;
  };
  popup(config?: AccountsConfig): { authorize: () => Promise<AuthorizeData> };
  redirect(config?: AccountsConfig): {
    authorize: () => void;
    authorizeData: () => Promise<AuthorizeData>;
  };
  authorizeUrl(options?: AccountsConfig, flow?: string): string;
  verify(authorizeData: AuthorizeData): TransactionData | null;
}
