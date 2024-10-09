import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <video
        src={video.videoUrl}
        className="w-full h-64 object-cover"
        controls
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{video.username}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>ViralScore: {video.viralScore}</span>
          <span>Views: {video.views}</span>
          <span>Likes: {video.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;