import React from "react";
import PageHero from "../components/PageHero";

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <PageHero
        title="About"
        blurb="A community-driven space where people from diverse disciplines come together to explore the intersection of biology, design, and technology, fostering collaboration around innovative, sustainable, and regenerative solutions. These clubs serve as hubs for experimentation, learning, and creating projects inspired by natural systems and biomimicry. Here’s a more detailed breakdown of what a biodesign club might look like:"
      />
    </div>
  );
};

export default AboutPage;
