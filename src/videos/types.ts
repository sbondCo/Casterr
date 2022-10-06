export interface VideosState {
  recordings: Video[];
  clips: Video[];
}

export interface Video {
  name: string;
  videoPath: string;
  thumbPath?: string;
  fileSize?: number;
  fps?: string;
  duration?: number;
  isClip: boolean;
}
