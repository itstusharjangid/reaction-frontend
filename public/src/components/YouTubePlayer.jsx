import React, { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase initialized separately

export default function YouTubePlayer({ roomId, isHost }) {
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');

  // Extract video ID from URL
  function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event) => {
            if (isHost && playerReady) {
              // Sync playback state to Firestore
              const state = event.data;
              const currentTime = playerRef.current.getCurrentTime();
              updateDoc(doc(db, 'rooms', roomId), {
                youtubeState: state,
                youtubeTime: currentTime,
              });
            }
          },
        },
      });
    };
  }, []);

  // Listen to Firestore for YouTube URL and playback sync
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      if (data.youtubeUrl && data.youtubeUrl !== youtubeUrl) {
        setYoutubeUrl(data.youtubeUrl);
        const id = extractVideoId(data.youtubeUrl);
        if (id && playerRef.current) {
          playerRef.current.loadVideoById(id);
          setVideoId(id);
        }
      }
      if (!isHost && playerRef.current && data.youtubeState !== undefined) {
        // Sync playback state for participants
        const state = data.youtubeState;
        const time = data.youtubeTime || 0;
        if (state === 1) {
          playerRef.current.seekTo(time, true);
          playerRef.current.playVideo();
        } else if (state === 2) {
          playerRef.current.pauseVideo();
        }
      }
    });
    return () => unsubscribe();
  }, [roomId, youtubeUrl, isHost]);

  // Host input to update YouTube URL
  async function handleUrlChange(e) {
    const url = e.target.value;
    setYoutubeUrl(url);
    if (isHost) {
      await updateDoc(doc(db, 'rooms', roomId), { youtubeUrl: url });
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isHost && (
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          value={youtubeUrl}
          onChange={handleUrlChange}
          className="w-full p-2 border rounded mb-2"
        />
      )}
      <div id="youtube-player" className="w-full aspect-video bg-black"></div>
    </div>
  );
}