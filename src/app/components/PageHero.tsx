import React from "react";

interface PageHeroProps {
  title: string;
  blurb: string;
  imageUrl?: string; // Optional image URL
}

const PageHero: React.FC<PageHeroProps> = ({ title, blurb, imageUrl }) => {
  return (
    <div className="h-1/3 w-full">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="page-hero-image" />
      )}
      <div className="">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="page-hero-blurb">{blurb}</p>
      </div>
    </div>
  );
};

export default PageHero;
