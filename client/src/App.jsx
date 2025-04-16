import React, { useState } from 'react';

function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [interests, setInterests] = useState('');
  const [itinerary, setItinerary] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination, days, interests }),
    });

    const data = await response.json();
    setItinerary(data.itinerary);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌍 SmartTour Guide</h1>
      <form onSubmit={handleSubmit}>
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <label>Days:</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <label>Interests:</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
        <button type="submit">Generate Itinerary</button>
      </form>

      {itinerary && (
        <div>
          <h3>Your Itinerary:</h3>
          <pre>{itinerary}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
