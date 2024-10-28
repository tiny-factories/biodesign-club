"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MediumsPage() {
  const [mediums, setMediums] = useState([]);

  useEffect(() => {
    fetch("/api/notion?mediums=true")
      .then((response) => response.json())
      .then((data) => setMediums(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>Mediums</h1>
      <ul>
        {mediums.map((medium, index) => (
          <li key={index}>
            <Link href={`/${medium}`}>{medium}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
