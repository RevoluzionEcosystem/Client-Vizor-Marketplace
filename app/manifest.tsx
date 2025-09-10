import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vizor",
    short_name: "W3W",
    description:
      "We do the investments, you claim your share of the profits. Professionally managed crypto investments.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1115",
    theme_color: "#47E2D0",    icons: [
      {
        src: "/assets/images/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/images/logo.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/assets/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "portrait",
    categories: ["finance", "business", "technology", "blockchain"],    
    screenshots: [
      {
        src: "/assets/images/screenshot-home.png",
        sizes: "1280x720",
        type: "image/png",
      },
      {
        src: "/assets/images/screenshot-staking.png",
        sizes: "1280x720",
        type: "image/png",
      },
      {
        src: "/assets/images/screenshot-profits.png",
        sizes: "1280x720",
        type: "image/png",
      },
    ],    shortcuts: [
      {
        name: "Staking",
        url: "/staking",
        description: "Stake your W3W tokens and earn rewards",
      },
      {
        name: "Governance",
        url: "/governance",
        description: "Vote on investment strategies",
      },
      {
        name: "Profits",
        url: "/profits",
        description: "View and claim your profit share",
      },
    ],    related_applications: [
      {
        platform: "web",
        url: "https://vizor.com",
      },
    ],
  };
}
