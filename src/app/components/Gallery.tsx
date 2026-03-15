"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaTh, FaList } from "react-icons/fa";

interface GalleryProps {
  type: string;
}

interface GalleryItem {
  id: string;
  image?: string | null;
  slug: string;
  docs?: string;
  github_url?: string;
  name: string;
  medium?: string[];
  tags?: string[];
}

interface GalleryResponse {
  data: GalleryItem[];
  mediums: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export default function Gallery({ type }: GalleryProps) {
  const [data, setData] = useState<GalleryItem[]>([]);
  const [mediums, setMediums] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedMedium, type]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      type,
      search,
      page: String(page),
      limit: "9",
    });

    if (selectedMedium) {
      params.set("medium", selectedMedium);
    }

    async function loadData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/notion?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch items (${response.status})`);
        }

        const payload: GalleryResponse = await response.json();
        setData(Array.isArray(payload.data) ? payload.data : []);
        setMediums(Array.isArray(payload.mediums) ? payload.mediums : []);
        setPagination(
          payload.pagination || {
            page: 1,
            limit: 9,
            total: 0,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          }
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error:", error);
        setErrorMessage("Couldn’t load results right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [type, search, selectedMedium, page]);

  const hasData = data.length > 0;
  const pageLabel = useMemo(() => {
    if (!pagination.total) return "No results";
    return `Page ${pagination.page} of ${pagination.totalPages}`;
  }, [pagination.page, pagination.total, pagination.totalPages]);

  return (
    <div className="space-y-4">
      <div className="toolbar mb-4 rounded border border-gray-300 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded border p-2 sm:flex-grow"
            aria-label={`Search ${type}`}
          />
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setView("gallery")}
              className={`rounded p-2 ${view === "gallery" ? "bg-blue-100" : ""}`}
              aria-label="Gallery view"
            >
              <FaTh className={view === "gallery" ? "text-blue-500" : ""} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded p-2 ${view === "list" ? "bg-blue-100" : ""}`}
              aria-label="List view"
            >
              <FaList className={view === "list" ? "text-blue-500" : ""} />
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMedium("")}
            className={`rounded-full px-3 py-1 text-sm ${
              selectedMedium === "" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          {Array.isArray(mediums) &&
            mediums.map((medium) => (
              <button
                key={medium}
                onClick={() =>
                  setSelectedMedium((current) => (current === medium ? "" : medium))
                }
                className={`rounded-full px-3 py-1 text-sm ${
                  selectedMedium === medium ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {medium}
              </button>
            ))}
        </div>
      </div>

      {errorMessage && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading && (
        <p className="rounded border border-gray-200 bg-white p-3 text-sm text-gray-600">
          Loading results...
        </p>
      )}

      {!isLoading && !errorMessage && !hasData && (
        <p className="rounded border border-gray-200 bg-white p-3 text-sm text-gray-600">
          No matches found. Try a shorter keyword or clear filters.
        </p>
      )}

      {!isLoading && hasData && view === "gallery" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Link href={`/${type}/${item.slug}`} key={item.id}>
              <div className="h-full rounded border p-3 sm:p-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full rounded object-cover"
                  />
                )}
                <h2 className="mt-2 text-base font-bold sm:text-lg">{item.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {!isLoading && hasData && view === "list" ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:hidden">
            {data.map((item) => (
              <div key={item.id} className="rounded border p-3">
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{item.slug}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <Link href={`/${type}/${item.slug}`} className="underline">
                    View
                  </Link>
                  {item.docs && (
                    <a
                      href={item.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Docs
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Image</th>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Links</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.slug}
                          className="h-16 w-16 rounded object-cover"
                        />
                      )}
                    </td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/${type}/${item.slug}`} className="underline">
                          View
                        </Link>
                        {item.docs && (
                          <a
                            href={item.docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Docs
                          </a>
                        )}
                        {item.github_url && (
                          <a
                            href={item.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded border border-gray-300 p-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!pagination.hasPrevious || isLoading}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">{pageLabel}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!pagination.hasNext || isLoading}
          className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
