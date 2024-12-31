import Head from "next/head";
import { useTheme } from "next-themes";
import { useRef, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Pool } from "pg";
import MenuBar from "../src/components/MenuBar";
import Sidebar from "../src/components/Sidebar";
import VideoGrid from "../src/components/VideoGrid";
import VideoPopup from "../src/components/VideoPopup";
import { formatNumber } from "../src/utils/formatters";
import { Video } from "../src/types";

interface TrendingPostsProps {
  outliers: Video[];
}

export default function TrendingPosts({ outliers }: TrendingPostsProps) {
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sortedOutliers, setSortedOutliers] = useState<Video[]>(outliers);
  const [sortBy, setSortBy] = useState("viralScore");
  const [timeframe, setTimeframe] = useState(30);
  const [selectedOutlier, setSelectedOutlier] = useState<Video | null>(null);
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
  }, []);

  useEffect(() => {
    if (mounted) {
      setTheme("dark");
    }
  }, [mounted, setTheme]);

  useEffect(() => {
    const sortAndFilterOutliers = () => {
      pauseAllVideos();
      const now = new Date();
      const filtered = outliers.filter((outlier) => {
        const postDate = new Date(outlier.timestamp || "");
        const daysDifference = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
        return (
          daysDifference <= timeframe &&
          outlier.views >= minViews &&
          outlier.likes >= minLikes &&
          outlier.outlier_score >= minViralScore
        );
      });

      const sorted = filtered.sort((a, b) => {
        switch (sortBy) {
          case "viralScore":
            return b.outlier_score - a.outlier_score;
          case "postDate":
            return new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime();
          case "views":
            return b.views - a.views;
          case "likes":
            return b.likes - a.likes;
          case "comments":
            return b.comments - a.comments;
          case "shares":
            return b.shares - a.shares;
          case "engagement":
            const getEngagement = (post: Video) =>
              (post.likes + post.comments * 2 + post.shares * 3) / post.views;
            return getEngagement(b) - getEngagement(a);
          case "username":
            return a.username.localeCompare(b.username);
          default:
            return 0;
        }
      });
      setSortedOutliers(sorted);
    };

    sortAndFilterOutliers();
  }, [sortBy, outliers, timeframe, minViews, minLikes, minViralScore]);

  const handlePlay = (postId: string) => {
    Object.entries(videoRefs.current).forEach(([key, videoRef]) => {
      if (key !== postId && videoRef && !videoRef.paused) {
        videoRef.pause();
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pauseAllVideos();
    setSortBy(e.target.value);
  };

  const handleTimeframeChange = (days: number) => {
    pauseAllVideos();
    setTimeframe(days);
  };

  const handleMinViewsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pauseAllVideos();
    setMinViews(parseInt(e.target.value));
  };

  const handleMinLikesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pauseAllVideos();
    setMinLikes(parseInt(e.target.value));
  };

  const handleMinViralScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pauseAllVideos();
    setMinViralScore(parseFloat(e.target.value));
  };

  const handleInfoClick = (outlier: Video) => {
    pauseAllVideos();
    const videoRef = videoRefs.current[outlier.post_id];
    if (videoRef) {
      setCurrentVideoTime(videoRef.currentTime);
    }
    setSelectedOutlier(outlier);
  };

  const handleClosePopup = () => {
    setSelectedOutlier(null);
    setCurrentVideoTime(0);
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"} text-gray-800 dark:text-white`}>
      <Head>
        <title>Viral Brain - Trending Posts</title>
        <meta name="description" content="Trending viral content outliers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <Sidebar
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        minViews={minViews}
        onMinViewsChange={handleMinViewsChange}
        minLikes={minLikes}
        onMinLikesChange={handleMinLikesChange}
        minViralScore={minViralScore}
        onMinViralScoreChange={handleMinViralScoreChange}
      />

      <main className="pl-64 pt-20 p-4">
        <VideoGrid
          videos={sortedOutliers}
          videoRefs={videoRefs}
          onPlay={handlePlay}
          onInfoClick={handleInfoClick}
        />
      </main>

      <footer className="pl-64 text-center py-4 bg-gray-100 dark:bg-gray-800">
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Powered by Viral Brain
        </a>
      </footer>

      {selectedOutlier && (
        <VideoPopup
          video={selectedOutlier}
          currentVideoTime={currentVideoTime}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<TrendingPostsProps> = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        c.post_id,
        c.user_id,
        c.username,
        c.caption,
        c.s3_video_url,
        c.s3_cover_url,
        c.play_count,
        c.like_count,
        c.comment_count,
        c.share_count,
        c.vb_score,
        cct.created_at,
        cct.main_type_id,
        cct.sub_type_ids,
        cct.custom_tags
      FROM clips c
      LEFT JOIN clip_content_types cct ON c.post_id = cct.clip_id
      ORDER BY c.vb_score DESC
    `);
    client.release();

    const outliers: Video[] = result.rows.map((row) => ({
      post_id: row.post_id,
      user_id: row.user_id,
      username: row.username,
      caption: row.caption,
      video_url: row.s3_video_url,
      cover_url: row.s3_cover_url,
      views: parseInt(row.play_count) || 0,
      likes: parseInt(row.like_count) || 0,
      comments: parseInt(row.comment_count) || 0,
      shares: parseInt(row.share_count) || 0,
      outlier_score: parseFloat(row.vb_score) || 0,
      categories: {
        main_type_id: row.main_type_id,
        sub_type_ids: row.sub_type_ids || [],
        custom_tags: row.custom_tags || []
      },
      timestamp: row.created_at ? row.created_at.toISOString() : null
    }));

    return { props: { outliers } };
  } catch (err) {
    console.error(err);
    return { props: { outliers: [] } };
  } finally {
    await pool.end();
  }
}; 