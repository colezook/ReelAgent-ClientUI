import { AppProps } from 'next/app';

export interface Video {
  post_id: string;
  user_id: string;
  username: string;
  caption: string;
  video_url: string;
  cover_url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  outlier_score: number;
  categories: {
    main_type_id?: string;
    sub_type_ids: string[];
    custom_tags: string[];
  };
  timestamp: string | null;
}

export interface VideoPlayerProps {
  videoUrl: string;
  coverUrl: string;
  onPlay?: () => void;
  currentTime?: number;
  className?: string;
}

export interface VideoBubbleProps {
  post: Video;
  onPlay?: () => void;
  onInfoClick?: () => void;
  className?: string;
}

export interface VideoGridProps {
  videos: Video[];
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement | null }>;
  onPlay: (postId: string) => void;
  onInfoClick: (video: Video) => void;
  className?: string;
}

export interface VideoPopupProps {
  video: Video;
  currentVideoTime: number;
  onClose: () => void;
}

export interface SidebarProps {
  timeframe: number;
  onTimeframeChange: (days: number) => void;
  sortBy: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  minViews: number;
  onMinViewsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minLikes: number;
  onMinLikesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minViralScore: number;
  onMinViralScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TimeframeButtonProps {
  days: number;
  label: string;
  selected: boolean;
  onClick: (days: number) => void;
}

export interface RangeInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatValue?: (value: number) => string;
}

export interface MenuBarProps {
  className?: string;
}

export interface MyAppProps extends AppProps {
  // Add any additional props here if needed
} 