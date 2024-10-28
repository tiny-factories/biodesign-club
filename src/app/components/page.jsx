"use client";

import Gallery from "../components/Gallery";
import PageHero from "../components/PageHero";
export default function ComponentsPage() {
  return (
    <div>
        <PageHero
          title="Components"
          blurb="We're always working on something. Here are some of our ongoing projects."
        />
      <Gallery type="component" />
    </div>
  );
}