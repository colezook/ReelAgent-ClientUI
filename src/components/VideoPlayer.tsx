import React, { forwardRef } from 'react';
import { VideoPlayerProps } from '../types';

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ 
  videoUrl, 
  coverUrl, 
  onPlay,
  currentTime = 0,
  className = ""
}, ref) => {
  return (
    <video
      ref={ref}
      controls
      poster={coverUrl}
      className={`w-full h-full object-cover ${className}`}
      onPlay={onPlay}
      playsInline
      preload="metadata"
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer; 