import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(request, { params }) {
  const { tag } = params;
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        or: [
          {
            property: "tags",
            multi_select: {
              contains: tag,
            },
          },
          {
            property: "type",
            select: {
              equals: "boards",
            },
          },
        ],
      },
    });

    const formattedData = response.results.map((page) => {
      const properties = page.properties;
      return {
        slug: properties.slug?.rich_text?.[0]?.plain_text || "No slug",
        image: properties.image?.files?.[0]?.file?.url || "No image",
        title: properties.title?.title?.[0]?.plain_text || "No title",
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching items by tag:", error);
    return NextResponse.error();
  }
}
