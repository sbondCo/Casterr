export interface VideosState {
  recordings: Video[];
  clips: Video[];
}

export interface Video {
  name: string;
  videoPath: string;
  isClip: boolean;
  time?: number;
  thumbPath?: string;
  fileSize?: number;
  fps?: string;
  duration?: number;
  bookmarks?: number[];
}
