"use client";

import Gallery from "../components/Gallery";
import PageHero from "../components/PageHero";

export default function ProjectsPage() {
  return (
    <div>
      <PageHero
        title="Projects"
        blurb="We're always working on something. Here are some of our ongoing projects."
      />
      <Gallery type="project" />
    </div>
  );
}
