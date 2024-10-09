import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Pool } from 'pg';
import MenuBar from '../src/components/MenuBar';

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

    const outliers = result.rows.map(row => {
      console.log('Timestamp from database:', row.timestamp);
      return {
        post_id: row.post_id,
        owner_username: row.owner_username,
        outlier_score: parseFloat(row.outlier_score),
        video_url: row.video_s3_url,
        cover_url: row.cover_s3_url,
        views: parseInt(row.video_play_count),
        likes: parseInt(row.likes_count),
        caption: row.caption,
        link: row.url,
        timestamp: row.timestamp ? row.timestamp.toISOString() : null // Convert to ISO string
      };
    });

    return { props: { outliers } };
  } catch (err) {
    console.error(err);
    return { props: { outliers: [] } };
  } finally {
    await pool.end();
  }
}

// Add this function to format numbers
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
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', timestamp);
    return 'Invalid date';
  }
  
  return date.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Home({ outliers }) {
  const videoRefs = useRef([]);
  const [sortedOutliers, setSortedOutliers] = useState(outliers);
  const [sortBy, setSortBy] = useState('viralScore');

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, outliers.length);
  }, [outliers]);

  useEffect(() => {
    const sortOutliers = () => {
      const sorted = [...outliers].sort((a, b) => {
        switch (sortBy) {
          case 'viralScore':
            return b.outlier_score - a.outlier_score;
          case 'postDate':
            // Sort by timestamp, newest first
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

    sortOutliers();
  }, [sortBy, outliers]);

  const handlePlay = (index) => {
    videoRefs.current.forEach((videoRef, i) => {
      if (i !== index && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Head>
        <title>Viral Brain</title>
        <meta name="description" content="Showcase of viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <select
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="viralScore">Sort by Viral Score</option>
            <option value="postDate">Sort by Post Date (Newest)</option>
            <option value="views">Sort by Views</option>
            <option value="likes">Sort by Likes</option>
            <option value="username">Sort by Username</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOutliers.map((outlier, index) => (
            <div key={outlier.post_id} className={`${styles.videoCard} hover:animate-pop-up transition-all duration-300`}>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <video 
                  ref={el => videoRefs.current[index] = el}
                  controls 
                  poster={outlier.cover_url}
                  className="object-cover w-full h-full"
                  onPlay={() => handlePlay(index)}
                >
                  <source src={outlier.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4">
                <div className="flex flex-col mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {formatDate(outlier.timestamp)}
                  </span>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">@{outlier.owner_username}</h2>
                    <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="font-bold">{outlier.outlier_score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full px-3 py-1">
                    <span className="text-purple-600 dark:text-purple-300 font-medium">
                      Views: {formatNumber(outlier.views)}
                    </span>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full px-3 py-1">
                    <span className="text-purple-600 dark:text-purple-300 font-medium">
                      Likes: {formatNumber(outlier.likes)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 bg-gray-100 dark:bg-gray-800">
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Powered by Viral Brain
        </a>
      </footer>
    </div>
  );
}