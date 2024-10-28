import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const tagCounts = {};

    response.results.forEach((page) => {
      const tags = page.properties.tags?.multi_select || [];
      tags.forEach((tag) => {
        if (tagCounts[tag.name]) {
          tagCounts[tag.name]++;
        } else {
          tagCounts[tag.name] = 1;
        }
      });
    });

    const formattedTags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.error();
  }
}
