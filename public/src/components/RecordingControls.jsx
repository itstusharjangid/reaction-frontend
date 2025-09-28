import React, { useRef, useState } from 'react';

export default function RecordingControls({ containerRef }) {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  async function startRecording() {
    if (!containerRef.current) return alert('Container not ready');

    const stream = containerRef.current.captureStream(30); // 30 FPS
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reactcast_recording.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }

  return (
    <div className="my-2">
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Stop Recording
        </button>
      )}
    </div>
  );
}