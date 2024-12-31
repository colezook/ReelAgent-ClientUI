import React from 'react';
import VideoBubble from './VideoBubble';
import { VideoGridProps } from '../types';

const VideoGrid: React.FC<VideoGridProps> = ({ 
  videos, 
  videoRefs,
  onPlay,
  onInfoClick,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {videos.map((video) => (
        <VideoBubble
          key={video.post_id}
          ref={(el) => {
            if (el) {
              videoRefs.current[video.post_id] = el;
            }
          }}
          post={video}
          onPlay={() => onPlay(video.post_id)}
          onInfoClick={() => onInfoClick(video)}
        />
      ))}
    </div>
  );
};

export default VideoGrid; 