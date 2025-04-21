import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [prompt, setPrompt] = useState("generate a 1 day itinerary to");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateItinerary = async () => {
    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const response = await fetch("http://localhost:5000/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setItinerary(data.itinerary || "No itinerary returned.");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
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

      {/* Form Section */}
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
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={generateItinerary}
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition font-semibold"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </motion.button>

        {error && <p className="text-red-500">{error}</p>}
      </motion.div>

      {/* Itinerary Display */}
      {itinerary && (
        <motion.div
          className="mt-6 bg-gray-800 p-6 rounded-lg w-full max-w-xl whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {itinerary}
        </motion.div>
      )}
    </motion.div>
  );
}

export default App;
