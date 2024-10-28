"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/notion")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>Notion Data</h1>
    </div>
  );
}
