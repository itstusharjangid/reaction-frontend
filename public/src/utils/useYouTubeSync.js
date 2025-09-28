import { useEffect, useRef, useState } from 'react';

export function useYouTubeSync(roomId, isHost, onPlayerReady) {
  const playerRef = useRef(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    // Load YouTube IFrame API script
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
          onReady: () => {
            setPlayerReady(true);
            onPlayerReady && onPlayerReady(playerRef.current);
          },
          onStateChange: (event) => {
            if (isHost) {
              // Sync playback state to Firestore here (to be implemented)
            }
          },
        },
      });
    };
  }, [roomId]);

  return { playerRef, youtubeUrl, setYoutubeUrl, playerReady };
}