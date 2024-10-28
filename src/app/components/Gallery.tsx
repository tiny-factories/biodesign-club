import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTh, FaList } from "react-icons/fa";

interface GalleryProps {
  type: string;
}

interface GalleryItem {
  image?: string;
  slug: string;
  docs?: string;
  github_url?: string;
  name?: string;
}

export default function Gallery({ type }: GalleryProps) {
  const [data, setData] = useState<GalleryItem[]>([]);
  const [mediums, setMediums] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("gallery");

  useEffect(() => {
    fetch(`/api/notion?type=${type}&search=${search}&page=${page}&limit=10`)
      .then((response) => response.json())
      .then(({ data, mediums }) => {
        setData(data);
        setMediums(mediums || []);
      })
      .catch((error) => console.error("Error:", error));
  }, [type, search, page]);

  return (
    <div>
      <div className="toolbar flex flex-col space-y-4 mb-4 p-4 border border-gray-300 rounded">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow border p-2 rounded"
          />
          <div className="flex space-x-2">
            <button onClick={() => setView("gallery")} className="p-2">
              <FaTh className={view === "gallery" ? "text-blue-500" : ""} />
            </button>
            <button onClick={() => setView("list")} className="p-2">
              <FaList className={view === "list" ? "text-blue-500" : ""} />
            </button>
          </div>
        </div>
        <div className="flex space-x-2">
          {Array.isArray(mediums) &&
            mediums.map((medium) => (
              <button
                key={medium}
                onClick={() => setSearch(medium)}
                className={`p-2 rounded-full ${
                  search === medium ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {medium}
              </button>
            ))}
        </div>
      </div>

      {view === "gallery" ? (
        <div className="grid grid-cols-3 gap-4">
          {data.map((item, index) => (
            <Link href={`/${type}/${item.slug}`} key={index}>
              <div className="border p-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.slug}
                    className="w-full h-48 object-cover"
                  />
                )}
                <h2 className="mt-2 text-lg font-bold">{item.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Links</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.slug}
                      className="w-16 h-16 object-cover"
                    />
                  )}
                </td>
                <td className="border p-2">{item.slug}</td>
                <td className="border p-2">
                  <Link href={`/${type}/${item.slug}`}>View</Link>
                  {item.docs && (
                    <a
                      href={item.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Docs
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
