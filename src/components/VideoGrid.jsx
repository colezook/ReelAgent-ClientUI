import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.slice(0, 3).map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;