"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define a type for the items in the data array
type ItemType = {
  image: string;
  name: string;
};

export default function MediumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const medium = searchParams.get("medium");
  const [data, setData] = useState<ItemType[]>([]);

  useEffect(() => {
    if (medium) {
      fetch(`/api/notion?medium=${medium}`)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [medium]);

  return (
    <div>
      <h1>Medium: {medium}</h1>
      <div className="grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="border p-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
