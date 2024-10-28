import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const { searchParams } = new URL(url);
    const medium = searchParams.get("medium") ?? "";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const startCursor = page > 1 ? undefined : undefined;

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

    const databaseId = process.env.NOTION_DATABASE_ID ?? "default_database_id";

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: filters,
      },
      start_cursor: startCursor,
      page_size: limit,
    });

    const formattedData = response.results.map((page) => {
      if ("properties" in page) {
        const properties = page.properties;
        const createdProperty = properties.Created;
        let created = "No creation date";

        if (createdProperty && createdProperty.type === "created_time") {
          const createdTime = createdProperty.created_time;
          if (typeof createdTime === "string") {
            created = createdTime;
          }
        }

        const medium = properties.Medium;
        let mediumNames: string[] = [];
        if (medium && medium.type === "multi_select") {
          if (Array.isArray(medium.multi_select)) {
            mediumNames = medium.multi_select.map((item) => item.name);
          } else if (medium.multi_select && "options" in medium.multi_select) {
            mediumNames = medium.multi_select.options.map((item) => item.name);
          }
        }

        const tags = properties.tags;
        let tagNames: string[] = [];
        if (tags && tags.type === "multi_select") {
          if (Array.isArray(tags.multi_select)) {
            tagNames = tags.multi_select.map((tag) => tag.name);
          } else if (tags.multi_select && "options" in tags.multi_select) {
            tagNames = tags.multi_select.options.map((option) => option.name);
          }
        }

        const imageProperty = properties.image;
        let imageUrl = "No image";

        if (
          imageProperty &&
          imageProperty.type === "files" &&
          Array.isArray(imageProperty.files) &&
          imageProperty.files.length > 0
        ) {
          const fileItem = imageProperty.files[0];
          if (fileItem.type === "file") {
            imageUrl = fileItem.file.url || "No image";
          } else if (fileItem.type === "external") {
            imageUrl = fileItem.external.url || "No image";
          }
        }

        const nameProperty = properties.Name;
        let name = "No name";

        if (
          nameProperty &&
          nameProperty.type === "title" &&
          Array.isArray(nameProperty.title)
        ) {
          name = nameProperty.title[0]?.plain_text || "No name";
        }

        return {
          created,
          medium: mediumNames,
          image: imageUrl,
          tags: tagNames,
          name,
        };
      }
      return {
        created: "No creation date",
        medium: [],
        image: "No image",
        tags: [],
        name: "No name",
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
