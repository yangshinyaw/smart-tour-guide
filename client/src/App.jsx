import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

function App() {
  const [prompt, setPrompt] = useState("generate a 1 day itinerary to");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");

  const cities = [
    "Tokyo", "Paris", "New York", "Bangkok", "Barcelona",
    "Cairo", "Lisbon", "Buenos Aires", "Sydney", "Istanbul"
  ];

  const generateItinerary = async (customPrompt = prompt) => {
    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const response = await fetch("http://localhost:5000/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      const data = await response.json();
      setItinerary(data.itinerary || "No itinerary returned.");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const handleSurpriseMe = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const surprisePrompt = `Generate a 1-day itinerary for ${randomCity}`;
    setPrompt(surprisePrompt);
    generateItinerary(surprisePrompt);
  };

  const saveFavorite = () => {
    if (!itinerary) return;
    const newFavorites = [...favorites, itinerary];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const deleteFavorite = (index) => {
    const newFavorites = [...favorites];
    newFavorites.splice(index, 1);
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditedText(favorites[index]);
  };

  const saveEditedFavorite = () => {
    const updated = [...favorites];
    updated[editingIndex] = editedText;
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setEditingIndex(null);
    setEditedText("");
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start px-4 py-10 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo & Title */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/compass.png" alt="Compass" className="h-10 w-10" />
        <h1 className="text-4xl font-bold">Smart Tour Guide</h1>
      </motion.div>

      {/* Input & Buttons */}
      <motion.div
        className="flex flex-col items-center space-y-4 w-full max-w-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <input
          type="text"
          className="w-full px-4 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => generateItinerary()}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSurpriseMe}
            className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 transition font-semibold text-black"
            disabled={loading}
          >
            🎲 Surprise Me!
          </motion.button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </motion.div>

      {/* Typing Animation */}
      {itinerary && (
        <motion.div
          className="mt-6 bg-gray-800 p-6 rounded-lg w-full max-w-xl text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typewriter
            options={{
              delay: 15,
              cursor: "_",
            }}
            onInit={(typewriter) => {
              typewriter.typeString(itinerary).start();
            }}
          />

          {/* Save Button */}
          <button
            onClick={saveFavorite}
            className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
          >
            💾 Save Itinerary
          </button>
        </motion.div>
      )}

      {/* Saved Favorites Section */}
      {favorites.length > 0 && (
        <div className="mt-10 w-full max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">📚 Saved Itineraries</h2>
          <ul className="space-y-4">
            {favorites.map((fav, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg text-sm">
                {editingIndex === index ? (
                  <>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full p-2 text-black rounded-md mb-2"
                      rows={5}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditedFavorite}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{fav.slice(0, 300)}...</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEditing(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md text-sm text-black"
                      >
                        📝 Edit
                      </button>
                      <button
                        onClick={() => deleteFavorite(index)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default App;
