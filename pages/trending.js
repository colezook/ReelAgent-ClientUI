import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useTheme } from 'next-themes';
import MenuBar from '../src/components/MenuBar';
import { Pool } from 'pg';

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'No date';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function TrendingPosts({ outliers }) {
  const videoRefs = useRef({});
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sortedOutliers, setSortedOutliers] = useState(outliers);
  const [sortBy, setSortBy] = useState('viralScore');
  const [timeframe, setTimeframe] = useState(30); // Default to 30 days (1M) 
  const [selectedOutlier, setSelectedOutlier] = useState(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [minViews, setMinViews] = useState(25000);
  const [minLikes, setMinLikes] = useState(1000);
  const [minViralScore, setMinViralScore] = useState(5);

  const pauseAllVideos = () => {
    Object.values(videoRefs.current).forEach((videoRef) => {
      if (videoRef && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  useEffect(() => {
    setMounted(true);
    setTheme('dark'); // Set dark theme by default
  }, [setTheme]);

  useEffect(() => {
    const sortAndFilterOutliers = () => {
      pauseAllVideos();
      const now = new Date();
      const filtered = outliers.filter(outlier => {
        const postDate = new Date(outlier.timestamp);
        const daysDifference = (now - postDate) / (1000 * 60 * 60 * 24);
        return daysDifference <= timeframe &&
               outlier.views >= minViews &&
               outlier.likes >= minLikes &&
               outlier.outlier_score >= minViralScore;
      });

      const sorted = filtered.sort((a, b) => {
        switch (sortBy) {
          case 'viralScore':
            return b.outlier_score - a.outlier_score;
          case 'postDate':
            return new Date(b.timestamp) - new Date(a.timestamp);
          case 'views':
            return b.views - a.views;
          case 'likes':
            return b.likes - a.likes;
          case 'username':
            return a.owner_username.localeCompare(b.owner_username);
          default:
            return 0;
        }
      });
      setSortedOutliers(sorted);
    };

    sortAndFilterOutliers();
  }, [sortBy, outliers, timeframe, minViews, minLikes, minViralScore]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (selectedOutlier) {
      const captionBubble = document.querySelector('.caption-bubble');
      const captionText = document.querySelector('.caption-text');
      const moreButton = document.querySelector('.more-button');

      if (captionText.scrollHeight > captionBubble.clientHeight) {
        moreButton.classList.add('visible');
        moreButton.addEventListener('click', () => {
          captionBubble.classList.toggle('expanded');
          moreButton.textContent = captionBubble.classList.contains('expanded') ? 'Less' : 'More';
        });
      }
    }
  }, [selectedOutlier]);

  const handlePlay = (postId) => {
    Object.entries(videoRefs.current).forEach(([key, videoRef]) => {
      if (key !== postId && videoRef && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  const handleSortChange = (e) => {
    pauseAllVideos();
    setSortBy(e.target.value);
  };

  const handleTimeframeChange = (days) => {
    pauseAllVideos();
    setTimeframe(days);
  };

  const handleMinViewsChange = (e) => {
    pauseAllVideos();
    setMinViews(parseInt(e.target.value));
  };

  const handleMinLikesChange = (e) => {
    pauseAllVideos();
    setMinLikes(parseInt(e.target.value));
  };

  const handleMinViralScoreChange = (e) => {
    pauseAllVideos();
    setMinViralScore(parseFloat(e.target.value));
  };

  const closePopup = () => {
    setSelectedOutlier(null);
    setCurrentVideoTime(0);
  };

  const TimeframeButton = ({ days, label }) => (
    <button
      onClick={() => handleTimeframeChange(days)}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
        timeframe === days
          ? styles.selectedTimeframe
          : 'bg-white text-black hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  const handleInfoClick = (outlier) => {
    // Pause all playing videos
    Object.values(videoRefs.current).forEach((videoRef) => {
      if (videoRef && !videoRef.paused) {
        videoRef.pause();
      }
    });

    const videoRef = videoRefs.current[outlier.post_id];
    if (videoRef) {
      setCurrentVideoTime(videoRef.currentTime);
    }
    setSelectedOutlier(outlier);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      closePopup();
    }
  };

  // Render a loader or nothing until the component has mounted
  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} text-gray-800 dark:text-white`}>
      <Head>
        <title>Viral Brain - Trending Posts</title>
        <meta name="description" content="Trending viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className={`container mx-auto px-4 pt-24 ${selectedOutlier ? 'blur-sm' : ''}`}>
        <div className={`mb-4 rounded-lg p-4 relative overflow-hidden ${styles['colorful-bg']}`}>
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              <TimeframeButton days={7} label="Last 7D" />
              <TimeframeButton days={14} label="Last 14D" />
              <TimeframeButton days={30} label="Last 1M" />
              <TimeframeButton days={90} label="Last 3M" />
            </div>
            <div className="flex-1 flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="min-views" className="block text-sm font-medium text-white mb-1">
                  Min Views: {formatNumber(minViews)}+
                </label>
                <input
                  type="range"
                  id="min-views"
                  min="25000"
                  max="1000000"
                  step="1000"
                  value={minViews}
                  onChange={handleMinViewsChange}
                  className="w-full accent-white"
                  style={{background: 'white'}}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="min-likes" className="block text-sm font-medium text-white mb-1">
                  Min Likes: {formatNumber(minLikes)}+
                </label>
                <input
                  type="range"
                  id="min-likes"
                  min="1000"
                  max="100000"
                  step="100"
                  value={minLikes}
                  onChange={handleMinLikesChange}
                  className="w-full accent-white"
                  style={{background: 'white'}}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="min-viral-score" className="block text-sm font-medium text-white mb-1">
                  Min Viral Score: {minViralScore.toFixed(1)}x+
                </label>
                <input
                  type="range"
                  id="min-viral-score"
                  min="5"
                  max="100"
                  step="0.1"
                  value={minViralScore}
                  onChange={handleMinViralScoreChange}
                  className="w-full accent-white"
                  style={{background: 'white'}}
                />
              </div>
            </div>
            <div className="flex-none">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-white text-black rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <option value="viralScore">Sort by Viral Score</option>
                <option value="views">Sort by Views</option>
                <option value="likes">Sort by Likes</option>
                <option value="postDate">Sort by Post Date</option>
                <option value="username">Sort by Username</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {sortedOutliers.map((outlier) => (
            <div key={outlier.post_id} className={`${styles.videoCard} bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden`}>
              <div className="relative w-full pt-[177.78%]">
                <video 
                  ref={el => {
                    if (el) {
                      videoRefs.current[outlier.post_id] = el;
                    }
                  }}
                  controls 
                  poster={outlier.cover_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  onPlay={() => handlePlay(outlier.post_id)}
                  playsInline
                  preload="metadata"
                >
                  <source src={outlier.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {formatDate(outlier.timestamp)}
                  </span>
                  <div className="bg-blue-500 dark:bg-blue-600 text-white rounded-md px-2 py-1 text-center">
                    <span className="font-bold text-sm">{outlier.outlier_score.toFixed(1)}x</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold truncate text-base text-gray-900 dark:text-white">@{outlier.owner_username}</h2>
                  <button 
                    className="bg-green-500 dark:bg-white text-white dark:text-gray-800 rounded-md px-2 py-1 text-center text-xs font-semibold border border-green-600 dark:border-gray-300"
                    onClick={() => handleInfoClick(outlier)}
                  >
                    INFO
                  </button>
                </div>
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-center">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-xs">
                      Views: {formatNumber(outlier.views)}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-center">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-xs">
                      Likes: {formatNumber(outlier.likes)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`text-center py-4 bg-gray-100 dark:bg-gray-800 ${selectedOutlier ? 'blur-sm' : ''}`}>
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Powered by Viral Brain
        </a>
      </footer>

      {/* Updated Pop-up window */}
      {selectedOutlier && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn popup-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white dark:bg-black rounded-lg w-full max-w-5xl animate-scaleIn overflow-hidden shadow-blue-glow">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 relative">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster={selectedOutlier.cover_url}
                  ref={(el) => {
                    if (el) {
                      el.currentTime = currentVideoTime;
                      if (currentVideoTime > 0) {
                        el.play();
                      }
                    }
                  }}
                >
                  <source src={selectedOutlier.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="w-full md:w-1/2 p-6 bg-white dark:bg-black relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">@{selectedOutlier.owner_username}</h2>
                  <div className="bg-gray-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md ml-auto mr-8">
                    {formatDate(selectedOutlier.timestamp)}
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    onClick={closePopup}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between space-x-2 mb-4">
                  <div className="flex-1 bg-purple-600 text-white rounded-lg px-2 py-1 text-center">
                    <span className="text-xs uppercase font-semibold">Viral Score</span>
                    <div className="text-lg font-bold">{selectedOutlier.outlier_score.toFixed(1)}x</div>
                  </div>
                  <div className="flex-1 bg-green-500 text-white rounded-lg px-2 py-1 text-center">
                    <span className="text-xs uppercase font-semibold">VIEWS</span>
                    <div className="text-lg font-bold">{formatNumber(selectedOutlier.views)}</div>
                  </div>
                  <div className="flex-1 bg-blue-700 text-white rounded-lg px-2 py-1 text-center">
                    <span className="text-xs uppercase font-semibold">LIKES</span>
                    <div className="text-lg font-bold">{formatNumber(selectedOutlier.likes)}</div>
                  </div>
                </div>
                <div className="mb-4 relative">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 caption-bubble">
                    <p className="text-gray-700 dark:text-gray-300 caption-text">{selectedOutlier.caption}</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-1 text-sm more-button hidden">
                    More
                  </button>
                </div>
                <div className="mb-4">
                  <a
                    href={selectedOutlier.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block transition-colors duration-200"
                  >
                    View Post
                  </a>
                </div>
                <div className="absolute bottom-6 left-6 w-1/2 aspect-w-9 aspect-h-16 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={selectedOutlier.cover_url} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT post_id, owner_username, outlier_score, video_s3_url, cover_s3_url, 
             video_play_count, likes_count, caption, url, timestamp
      FROM outlier_posts
      WHERE status = 'approved'
      ORDER BY outlier_score DESC
    `);
    client.release();

    const outliers = result.rows.map(row => ({
      post_id: row.post_id,
      owner_username: row.owner_username,
      outlier_score: parseFloat(row.outlier_score),
      video_url: row.video_s3_url,
      cover_url: row.cover_s3_url,
      views: parseInt(row.video_play_count),
      likes: parseInt(row.likes_count),
      caption: row.caption,
      link: row.url, // Make sure this is included
      timestamp: row.timestamp ? row.timestamp.toISOString() : null
    }));

    return { props: { outliers } };
  } catch (err) {
    console.error(err);
    return { props: { outliers: [] } };
  } finally {
    await pool.end();
  }
}