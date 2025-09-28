import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTubePlayer from '../components/YouTubePlayer';
import VideoGrid from '../components/VideoGrid';
import RecordingControls from '../components/RecordingControls';

export default function Room() {
  const { roomId } = useParams();
  const [isHost, setIsHost] = useState(false);
  const containerRef = useRef(null);

  // For demo, first user is host (improve with auth)
  useEffect(() => {
    // Simple host assignment: if URL has ?host=1, user is host
    const params = new URLSearchParams(window.location.search);
    setIsHost(params.get('host') === '1');
  }, []);

  // Daily.co room URL (replace with your Daily.co room URL or create dynamically)
  const dailyRoomUrl = `https://your-domain.daily.co/${roomId}`;

  return (
    <div className="flex flex-col min-h-screen p-2 bg-gray-800 text-white">
      <h2 className="text-xl font-semibold mb-2">Room: {roomId}</h2>
      <div ref={containerRef} className="flex flex-col md:flex-row flex-1 gap-2">
        <div className="flex-1">
          <YouTubePlayer roomId={roomId} isHost={isHost} />
        </div>
        <div className="w-full md:w-1/3 bg-gray-900 rounded p-2">
          <VideoGrid roomUrl={dailyRoomUrl} isHost={isHost} />
        </div>
      </div>
      <RecordingControls containerRef={containerRef} />
      <div className="mt-2">
        <p>Share this link to invite participants:</p>
        <input
          type="text"
          readOnly
          value={window.location.href}
          className="w-full p-2 rounded text-black"
          onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
}