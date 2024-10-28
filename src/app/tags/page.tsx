"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "../components/PageHero";

// Define the type for the tags
type Tag = {
  name: string;
  count: number;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  useEffect(() => {
    fetch("/api/tags")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const filteredTags = tags
    .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return b.count - a.count;
      }
    });

  return (
    <div className="flex flex-col ">
      <PageHero
        title="All Tags"
        blurb="Browse all tags to find the perfect item."
      />
      <input
        type="text"
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4"
      />
      <select
        onChange={(e) => setSortOrder(e.target.value)}
        value={sortOrder}
        className="border p-2 mb-4"
      >
        <option value="name">Sort by Name</option>
        <option value="count">Sort by Item Count</option>
      </select>
      <ul className="flex flex-wrap">
        {filteredTags.map((tag) => (
          <li key={tag.name} className="mb-2 mr-2">
            <Link href={`/tag/${tag.name}`}>
              <div className="border p-2 hover:bg-gray-200">
                {tag.name} ({tag.count})
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
