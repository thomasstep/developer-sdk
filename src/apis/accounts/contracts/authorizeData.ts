export interface AuthorizeData {
  account_id: string;
  access_token: string;
  expires_in: number;
  organization_id: string;
  scope: string;
  token_type: 'Bearer';
}
