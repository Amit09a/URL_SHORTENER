import React, { useState, useEffect } from "react";
import axios from "axios";

const UrlShortenerForm = () => {
  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/urls");
      setUrls(res.data);
    } catch (err) {
      console.error("Error fetching URLs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/shorten", { longUrl });
      setLongUrl("");
      fetchUrls();
    } catch (err) {
      console.error("Error shortening URL:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete("http://localhost:3000/api/urls");
      setUrls([]); // instantly clear UI
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">URL Shortener</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Short URL</th>
            <th className="border border-gray-200 px-6 py-2">Original URL</th>
            <th className="border border-gray-200 px-4 py-2 text-center">
              Visits
            </th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                <a
                  href={`http://localhost:3000/${url.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`http://localhost:3000/${url.shortCode}`}
                </a>
              </td>
              <td className="border border-gray-200 px-6 py-2 truncate max-w-xs">
                {url.longUrl}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-center">
                {url.clicks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {urls.length === 0 && (
        <p className="text-gray-500 mt-4">No shortened URLs yet.</p>
      )}
    </div>
  );
};

export default UrlShortenerForm;
