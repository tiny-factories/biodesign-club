// app/api/notion/route.js

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const medium = searchParams.get("medium");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const startCursor = page > 1 ? String((page - 1) * limit) : undefined;

    const filters = [];

    if (medium) {
      filters.push({
        property: "medium",
        select: {
          equals: medium,
        },
      });
    }

    if (search) {
      filters.push({
        property: "slug",
        rich_text: {
          contains: search,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        and: filters,
      },
      start_cursor: startCursor,
      page_size: limit,
    });

    const formattedData = response.results.map((page) => {
      const properties = page.properties;

      return {
        created: properties.Created?.created_time || "No creation date",
        medium: properties.Medium?.multi_select?.map((item) => item.name) || [],
        image: properties.image?.files?.[0]?.file?.url || "No image",
        tags: properties.tags?.multi_select?.map((tag) => tag.name) || [],
        name: properties.Name?.title?.[0]?.plain_text || "No name",
      };
    });

    const allMediums = [
      ...new Set(formattedData.flatMap((item) => item.medium)),
    ];

    return NextResponse.json({ data: formattedData, mediums: allMediums });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
