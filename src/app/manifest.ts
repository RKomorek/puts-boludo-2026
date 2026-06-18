import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PutsBoludo 2026",
    short_name: "PutsBoludo",
    description:
      "Bolão da Copa do Mundo 2026 — palpites, resultados e ranking entre amigos.",
    start_url: "/jogos",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eef6f1",
    theme_color: "#0a7a4b",
    lang: "pt-BR",
    categories: ["sports", "social"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
