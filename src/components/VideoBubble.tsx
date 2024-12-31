import React, { forwardRef } from 'react';
import VideoPlayer from './VideoPlayer';
import { formatDate, formatNumber } from '../utils/formatters';
import { VideoBubbleProps } from '../types';

const VideoBubble = forwardRef<HTMLVideoElement, VideoBubbleProps>(({ 
  post,
  onPlay,
  onInfoClick,
  className = ""
}, ref) => {
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative w-full pt-[177.78%]">
        <VideoPlayer
          ref={ref}
          videoUrl={post.video_url}
          coverUrl={post.cover_url}
          onPlay={onPlay}
          className="absolute inset-0"
        />
      </div>
      <div className="p-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {formatDate(post.timestamp)}
          </span>
          <div className="bg-blue-500 dark:bg-blue-600 text-white rounded-md px-2 py-1 text-center">
            <span className="font-bold text-sm">
              {post.outlier_score.toFixed(1)}x
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Views: {formatNumber(post.views)}</span>
            <span>Likes: {formatNumber(post.likes)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Comments: {formatNumber(post.comments)}</span>
            <span>Shares: {formatNumber(post.shares)}</span>
          </div>
        </div>
        {post.categories?.custom_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.categories.custom_tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

VideoBubble.displayName = 'VideoBubble';

export default VideoBubble; 