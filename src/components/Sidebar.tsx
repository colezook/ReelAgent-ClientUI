import React from 'react';
import { formatNumber } from '../utils/formatters';
import { SidebarProps, TimeframeButtonProps, RangeInputProps } from '../types';

const TimeframeButton: React.FC<TimeframeButtonProps> = ({ days, label, selected, onClick }) => (
  <button
    onClick={() => onClick(days)}
    className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      selected
        ? 'bg-purple-600 text-white'
        : 'bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

const RangeInput: React.FC<RangeInputProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  formatValue 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}: {formatValue ? formatValue(value) : value}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full accent-purple-600"
    />
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  timeframe,
  onTimeframeChange,
  sortBy,
  onSortChange,
  minViews,
  onMinViewsChange,
  minLikes,
  onMinLikesChange,
  minViralScore,
  onMinViralScoreChange,
}) => {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 h-screen fixed left-0 top-20 overflow-y-auto p-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timeframe</h3>
        <div className="space-y-2">
          <TimeframeButton days={7} label="Last 7D" selected={timeframe === 7} onClick={onTimeframeChange} />
          <TimeframeButton days={14} label="Last 14D" selected={timeframe === 14} onClick={onTimeframeChange} />
          <TimeframeButton days={30} label="Last 1M" selected={timeframe === 30} onClick={onTimeframeChange} />
          <TimeframeButton days={90} label="Last 3M" selected={timeframe === 90} onClick={onTimeframeChange} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <RangeInput
          label="Min Views"
          value={minViews}
          min={25000}
          max={1000000}
          step={1000}
          onChange={onMinViewsChange}
          formatValue={(val) => `${formatNumber(val)}+`}
        />
        <RangeInput
          label="Min Likes"
          value={minLikes}
          min={1000}
          max={100000}
          step={100}
          onChange={onMinLikesChange}
          formatValue={(val) => `${formatNumber(val)}+`}
        />
        <RangeInput
          label="Min Viral Score"
          value={minViralScore}
          min={5}
          max={100}
          step={0.1}
          onChange={onMinViralScoreChange}
          formatValue={(val) => `${val.toFixed(1)}x+`}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sort By</h3>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="viralScore">Viral Score</option>
          <option value="views">Views</option>
          <option value="likes">Likes</option>
          <option value="comments">Comments</option>
          <option value="shares">Shares</option>
          <option value="engagement">Engagement</option>
          <option value="postDate">Post Date</option>
          <option value="username">Username</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar; 