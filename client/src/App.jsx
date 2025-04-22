import { useState } from "react";
import Typewriter from "typewriter-effect";

function App() {
  const [prompt, setPrompt] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [favorites, setFavorites] = useState([]);

  const generateItinerary = async () => {
    const res = await fetch("http://localhost:5000/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setItinerary(data.itinerary);
  };

  const handleSurpriseMe = () => {
    const cities = ["Cairo", "Tokyo", "Paris", "New York", "Bangkok"];
    const random = cities[Math.floor(Math.random() * cities.length)];
    setPrompt(random);
  };

  const handleSave = () => {
    if (itinerary && !favorites.includes(itinerary)) {
      setFavorites([itinerary, ...favorites]);
    }
  };

  const handleDelete = (index) => {
    const updated = [...favorites];
    updated.splice(index, 1);
    setFavorites(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <img src="/compass.png" alt="Compass" className="h-10 w-10" />
          <h1 className="text-4xl font-bold tracking-wide">Smart Tour Guide</h1>
        </div>

        {/* Input & Buttons */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter a city (e.g. Paris, Cairo)"
            className="w-full px-4 py-3 text-black rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl font-semibold transition-all duration-200"
              onClick={generateItinerary}
            >
              Generate Itinerary
            </button>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold transition-all duration-200"
              onClick={handleSurpriseMe}
            >
              🎲 Surprise Me!
            </button>
          </div>
        </div>

        {/* Itinerary Display */}
        {itinerary && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-4">
            <div className="text-base leading-relaxed">
              <Typewriter
                options={{ delay: 15 }}
                onInit={(typewriter) => typewriter.typeString(itinerary).start()}
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              💾 Save Itinerary
            </button>
          </div>
        )}

        {/* Saved Itineraries */}
        {favorites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-400">
              <span>📚</span> Saved Itineraries
            </h2>
            {favorites.map((fav, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg relative group hover:shadow-lg transition-all"
              >
                <p className="text-sm line-clamp-4">{fav}</p>
                <button
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  onClick={() => handleDelete(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
