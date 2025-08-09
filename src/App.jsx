import React, { useState } from "react";
import UrlShortenerForm from "./components/UrlShortenerForm";

function App() {
  const [shortUrl, setShortUrl] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <UrlShortenerForm setShortUrl={setShortUrl} />
      
      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Your short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
