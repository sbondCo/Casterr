export interface Uploaders {
  youtube?: YouTubeUploader;
}

export interface YouTubeUploader {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}
