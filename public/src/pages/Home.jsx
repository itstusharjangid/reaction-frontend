import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  async function createRoom() {
    const res = await fetch('http://localhost:4000/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId: 'host' }),
    });
    const data = await res.json();
    navigate(`/room/${data.roomId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">ReactCast</h1>
      <button
        onClick={createRoom}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Room
      </button>
    </div>
  );
}