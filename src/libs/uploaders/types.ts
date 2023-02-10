export interface Uploaders {
  youtube?: YouTubeUploader;
}

export interface YouTubeUploader {
  access_token: string;
  expires: number;
  refresh_token: string;
  scope: string;
  username?: string;
}
