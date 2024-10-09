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
             video_play_count, likes_count, caption, url
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

export default function Home({ outliers }) {
  const videoRefs = useRef([]);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, outliers.length);
  }, [outliers]);

  const handlePlay = (index) => {
    videoRefs.current.forEach((videoRef, i) => {
      if (i !== index && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Viral Brain</title>
        <meta name="description" content="Showcase of viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className={styles.main}>
        <div className={styles.grid}>
          {outliers.map((outlier, index) => (
            <div key={outlier.post_id} className={styles.card}>
              <div className={styles.videoContainer}>
                <video 
                  ref={el => videoRefs.current[index] = el}
                  controls 
                  poster={outlier.cover_url}
                  className={styles.video}
                  onPlay={() => handlePlay(index)}
                >
                  <source src={outlier.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className={styles.videoInfo}>
                <h2>{outlier.owner_username}</h2>
                <div className={styles.stats}>
                  <span>Score: {outlier.outlier_score.toFixed(2)}</span>
                  <span>Views: {outlier.views.toLocaleString()}</span>
                  <span>Likes: {outlier.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Viral Brain
        </a>
      </footer>
    </div>
  );
}