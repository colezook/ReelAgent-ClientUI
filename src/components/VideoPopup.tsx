import React, { useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { formatDate, formatNumber } from '../utils/formatters';
import { VideoPopupProps } from '../types';

const VideoPopup: React.FC<VideoPopupProps> = ({
  video,
  currentVideoTime,
  onClose,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  useEffect(() => {
    const captionBubble = document.querySelector(".caption-bubble");
    const captionText = document.querySelector(".caption-text");
    const moreButton = document.querySelector(".more-button");

    if (captionText?.scrollHeight && captionBubble?.clientHeight && 
        captionText.scrollHeight > captionBubble.clientHeight) {
      moreButton?.classList.add("visible");
      const handleMoreClick = () => {
        captionBubble.classList.toggle("expanded");
        if (moreButton instanceof HTMLElement) {
          moreButton.textContent = captionBubble.classList.contains("expanded")
            ? "Less"
            : "More";
        }
      };
      moreButton?.addEventListener("click", handleMoreClick);
      return () => moreButton?.removeEventListener("click", handleMoreClick);
    }
  }, []);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("popup-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn popup-overlay"
      onClick={handleOutsideClick}
    >
      <div className="bg-white dark:bg-black rounded-lg w-full max-w-5xl animate-scaleIn overflow-hidden shadow-blue-glow">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative">
            <VideoPlayer
              videoUrl={video.video_url}
              coverUrl={video.cover_url}
              currentTime={currentVideoTime}
              className="w-full h-full"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 bg-white dark:bg-black relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                @{video.username}
              </h2>
              <div className="bg-gray-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md ml-auto mr-8">
                {formatDate(video.timestamp)}
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-purple-600 text-white rounded-lg px-2 py-2 text-center">
                <span className="text-xs uppercase font-semibold">
                  Viral Score
                </span>
                <div className="text-lg font-bold">
                  {video.outlier_score.toFixed(1)}x
                </div>
              </div>
              <div className="bg-green-500 text-white rounded-lg px-2 py-2 text-center">
                <span className="text-xs uppercase font-semibold">
                  Views
                </span>
                <div className="text-lg font-bold">
                  {formatNumber(video.views)}
                </div>
              </div>
              <div className="bg-blue-700 text-white rounded-lg px-2 py-2 text-center">
                <span className="text-xs uppercase font-semibold">
                  Likes
                </span>
                <div className="text-lg font-bold">
                  {formatNumber(video.likes)}
                </div>
              </div>
              <div className="bg-orange-600 text-white rounded-lg px-2 py-2 text-center">
                <span className="text-xs uppercase font-semibold">
                  Comments
                </span>
                <div className="text-lg font-bold">
                  {formatNumber(video.comments)}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 caption-bubble">
                <p className="text-gray-700 dark:text-gray-300 caption-text">
                  {video.caption}
                </p>
              </div>
              <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-1 text-sm more-button hidden">
                More
              </button>
            </div>
            {video.categories?.custom_tags?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {video.categories.custom_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="absolute bottom-6 left-6 w-1/2 aspect-w-9 aspect-h-16 rounded-lg overflow-hidden shadow-md">
              <img
                src={video.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup; 