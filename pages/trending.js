import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useTheme } from 'next-themes';
import MenuBar from '../src/components/MenuBar';

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
    <div className={`${styles.container} bg-gray-900 text-white`}>
      <Head>
        <title>Viral Brain - Trending Posts</title>
        <meta name="description" content="Trending viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-800 shadow-md p-4 sticky top-0 z-10">
        {/* ... (keep the existing header content) */}
      </header>

      <main className={styles.main}>
        <div className={styles.videoGrid}>
          {outliers.map((outlier, index) => (
            <div key={outlier.post_id} className={styles.videoCard}>
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
                  <span>ViralScore: {outlier.outlier_score ? outlier.outlier_score.toFixed(2) : 'N/A'}</span>
                  <span>Views: {outlier.views ? outlier.views.toLocaleString() : 'N/A'}</span>
                  <span>Likes: {outlier.likes ? outlier.likes.toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`${styles.footer} bg-gray-800`}>
        {/* ... (keep the existing footer content) */}
      </footer>
    </div>
  );
}

// Add getServerSideProps to fetch outliers data
export async function getServerSideProps() {
  // Implement the logic to fetch outliers data
  // Return the data as props
}