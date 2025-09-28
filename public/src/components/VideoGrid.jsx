import React, { useEffect, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

export default function VideoGrid({ roomUrl, isHost }) {
  const [callObject, setCallObject] = useState(null);
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    const call = DailyIframe.createCallObject();
    setCallObject(call);

    call.join({ url: roomUrl });

    call.on('participant-updated', (event) => {
      setParticipants((prev) => ({ ...prev, [event.participant.session_id]: event.participant }));
    });

    call.on('participant-left', (event) => {
      setParticipants((prev) => {
        const copy = { ...prev };
        delete copy[event.participant.session_id];
        return copy;
      });
    });

    return () => call.destroy();
  }, [roomUrl]);

  return (
    <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-900">
      {Object.values(participants).map((p) => (
        <div key={p.session_id} className="w-24 h-24 bg-black rounded overflow-hidden relative">
          <video
            ref={(el) => {
              if (el && p.videoTrack) {
                el.srcObject = new MediaStream([p.videoTrack]);
                el.play().catch(() => {});
              }
            }}
            muted={p.local}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center">
            {p.user_name || 'Guest'}
          </div>
        </div>
      ))}
    </div>
  );
}