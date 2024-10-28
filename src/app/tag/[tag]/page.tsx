"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PageHero from "../../components/PageHero";

// Define an interface for the expected data structure
interface Project {
  slug: string;
  image?: string;
  title: string;
}

export default function TagPage() {
  const pathname = usePathname();
  const tag = pathname.split("/").pop(); // Extract the tag from the pathname
  const [data, setData] = useState<Project[]>([]);

  useEffect(() => {
    if (tag) {
      fetch(`/api/tags/${tag}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text(); // Use text() to handle empty responses
        })
        .then((text) => {
          if (text) {
            return JSON.parse(text); // Parse only if text is not empty
          }
          return [];
        })
        .then((data) => setData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [tag]);

  return (
    <div>
      <PageHero
        title={`${tag}`}
        blurb="Browse all projects tagged with this tag."
      />
      <div className="grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Link href={`/projects/${item.slug}`} key={index}>
            <div className="border p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <h2 className="mt-2 text-lg font-bold">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
