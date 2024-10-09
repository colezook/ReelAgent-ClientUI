. I want to add a feature that also adds the post date to the video bubble next to the likesimport { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useTheme } from 'next-themes';
import MenuBar from '../src/components/MenuBar';
import { Pool } from 'pg';

export default function TrendingPosts({ outliers }) {
  const videoRefs = useRef([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, outliers.length);
    setTheme('dark'); // Set dark theme by default
  }, [outliers, setTheme]);

  const handlePlay = (index) => {
    videoRefs.current.forEach((videoRef, i) => {
      if (i !== index && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Head>
        <title>Viral Brain - Trending Posts</title>
        <meta name="description" content="Trending viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outliers.map((outlier, index) => (
            <div key={outlier.post_id} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
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
                <h2 className="font-bold text-lg mb-2">{outlier.owner_username}</h2>
                <div className="flex justify-between text-sm">
                  <span>ViralScore: {outlier.outlier_score ? outlier.outlier_score.toFixed(2) : 'N/A'}</span>
                  <span>Views: {outlier.views ? outlier.views.toLocaleString() : 'N/A'}</span>
                  <span>Likes: {outlier.likes ? outlier.likes.toLocaleString() : 'N/A'}</span>
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
             video_play_count, likes_count, caption, url
      FROM outlier_posts
      WHERE status = 'approved'
      ORDER BY outlier_score DESC
      LIMIT 20
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
      link: row.url
    }));

    return { props: { outliers } };
  } catch (err) {
    console.error(err);
    return { props: { outliers: [] } };
  } finally {
    await pool.end();
  }
}