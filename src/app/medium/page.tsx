"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Define the type for the data items
type DataItem = {
  image?: string;
  name: string;
};

function MediumContent() {
  const searchParams = useSearchParams();
  const medium = searchParams.get("medium");
  const [data, setData] = useState<DataItem[]>([]);

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
            <h2 className="mt-2 text-lg font-bold">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MediumPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediumContent />
    </Suspense>
  );
}
