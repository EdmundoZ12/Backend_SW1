export interface ShotstackClip {
  asset: {
    type: 'image' | 'video';
    src: string;
    trim?: number;
  };
  start: number;
  length: number;
}

export interface ShotstackTimeline {
  tracks: {
    clips: ShotstackClip[];
  }[];
}

export interface ShotstackVideo {
  timeline: ShotstackTimeline;
}
