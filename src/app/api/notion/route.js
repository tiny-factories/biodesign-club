import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getFirstFileUrl(property) {
  if (!property || property.type !== "files" || !Array.isArray(property.files)) {
    return null;
  }

  const firstFile = property.files[0];
  if (!firstFile) return null;
  if (firstFile.type === "file") return firstFile.file?.url ?? null;
  if (firstFile.type === "external") return firstFile.external?.url ?? null;
  return null;
}

function getTitle(properties, keys) {
  for (const key of keys) {
    const property = properties[key];
    if (property?.type === "title") {
      const text = property.title?.[0]?.plain_text;
      if (text) return text;
    }
  }
  return "";
}

function getRichText(properties, keys) {
  for (const key of keys) {
    const property = properties[key];
    if (property?.type === "rich_text") {
      const text = property.rich_text?.[0]?.plain_text;
      if (text) return text;
    }
  }
  return "";
}

function getUrl(properties, keys) {
  for (const key of keys) {
    const property = properties[key];
    if (property?.type === "url" && property.url) {
      return property.url;
    }
  }
  return "";
}

function getSelect(properties, keys) {
  for (const key of keys) {
    const property = properties[key];
    if (property?.type === "select" && property.select?.name) {
      return property.select.name;
    }
  }
  return "";
}

function getMultiSelect(properties, keys) {
  for (const key of keys) {
    const property = properties[key];
    if (property?.type === "multi_select" && Array.isArray(property.multi_select)) {
      return property.multi_select.map((item) => item.name).filter(Boolean);
    }
  }
  return [];
}

async function fetchAllNotionPages(databaseId) {
  const allResults = [];
  let cursor;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      start_cursor: cursor,
    });

    allResults.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  return allResults;
}

export async function GET(request) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: "NOTION_DATABASE_ID is not configured." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "";
    const medium = searchParams.get("medium");
    const search = searchParams.get("search") || "";
    const mediumsOnly = searchParams.get("mediums") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const parsedLimit = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Number.isNaN(parsedLimit)
      ? 10
      : Math.min(Math.max(parsedLimit, 1), 50);
    const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;

    const results = await fetchAllNotionPages(databaseId);
    const formattedData = results.map((entry) => {
      const properties = entry.properties || {};
      const name = getTitle(properties, ["Name", "name", "title", "Title"]) || "Untitled";
      const slug =
        getRichText(properties, ["slug", "Slug"]) ||
        toSlug(name) ||
        entry.id.replace(/-/g, "");
      const mediums = getMultiSelect(properties, ["Medium", "medium"]);
      const tags = getMultiSelect(properties, ["tags", "Tags"]);
      const image =
        getFirstFileUrl(properties.image) || getFirstFileUrl(properties.Image) || null;

      return {
        id: entry.id,
        slug,
        name,
        image,
        medium: mediums,
        tags,
        type:
          getSelect(properties, ["type", "Type"]) ||
          getRichText(properties, ["type", "Type"]) ||
          "",
        docs: getUrl(properties, ["docs", "Docs"]),
        github_url: getUrl(properties, ["github_url", "GitHub", "github"]),
      };
    });

    const allMediums = [...new Set(formattedData.flatMap((item) => item.medium))].sort(
      (a, b) => a.localeCompare(b)
    );

    if (mediumsOnly) {
      return NextResponse.json(allMediums);
    }

    const normalizedType = type.toLowerCase();
    const normalizedMedium = (medium || "").toLowerCase();
    const normalizedSearch = search.toLowerCase().trim();

    const filteredData = formattedData.filter((item) => {
      const matchesType = normalizedType
        ? item.type.toLowerCase() === normalizedType
        : true;
      const matchesMedium = normalizedMedium
        ? item.medium.some((value) => value.toLowerCase() === normalizedMedium)
        : true;
      const matchesSearch = normalizedSearch
        ? [item.name, item.slug, item.type, ...item.medium, ...item.tags]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      return matchesType && matchesMedium && matchesSearch;
    });

    const total = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (currentPage - 1) * limit;
    const data = filteredData.slice(start, start + limit);

    return NextResponse.json({
      data,
      mediums: allMediums,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
