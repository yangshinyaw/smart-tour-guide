import { useState } from "react";
import { motion } from "framer-motion";
import PDFExporter from "./PDFExporter";

function App() {
  const [prompt, setPrompt] = useState("Generate a 1-day itinerary to");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");

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

  const handleRefineSubmit = async () => {
    const newPrompt = `${prompt}. Refine with: ${refinePrompt}`;
    await generateItinerary(newPrompt);
    setShowRefineModal(false);
    setRefinePrompt("");
  };

  const formatItinerary = (text) => {
    return text.split(/\n|•|-/).filter(line => line.trim());
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-10 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo and Title */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/compass.png" alt="Compass" className="h-10 w-10" />
        <h1 className="text-4xl font-bold">Smart Tour Guide</h1>
      </motion.div>

      {/* Input and Buttons */}
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
        <div className="flex gap-4 flex-wrap justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => generateItinerary()}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSurpriseMe}
            className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-semibold text-black transition"
            disabled={loading}
          >
            🎲 Surprise Me!
          </motion.button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </motion.div>

      {/* Itinerary Output */}
      {itinerary && (
        <motion.div
          className="mt-6 bg-gray-800 p-6 rounded-lg w-full max-w-xl text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div id="itinerary-content" className="space-y-2">
            {formatItinerary(itinerary).map((item, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                • {item.trim()}
              </motion.p>
            ))}
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={saveFavorite}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition"
            >
              💾 Save Itinerary
            </button>

            <PDFExporter targetRefId="itinerary-content" />

            <button
              onClick={() => setShowRefineModal(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition"
            >
              ✏️ Refine Itinerary
            </button>
          </div>
        </motion.div>
      )}

      {/* Favorites */}
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
                    <p className="whitespace-pre-wrap">{fav.slice(0, 300)}...</p>
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

      {/* Refine Modal */}
      {showRefineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black w-96">
            <h3 className="text-xl font-bold mb-4">Refine Itinerary</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="e.g., Focus on museums and local food."
              rows={4}
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRefineModal(false)}
                className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRefineSubmit}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default App;
