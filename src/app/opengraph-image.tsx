import { renderOgImage } from "@/lib/og-image";

export const alt = "Areeb ur Rehman - Full-Stack Web Developer, AI Engineer, Backend Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
