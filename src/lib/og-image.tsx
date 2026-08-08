import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

/**
 * Shared renderer behind both `opengraph-image.tsx` and `twitter-image.tsx`,
 * so the two special files stay one-liners and the card can't drift out of
 * sync between platforms. Colors match `globals.css` exactly — `next/og`
 * renders through Satori, which cannot read CSS custom properties, so the
 * hexes are inlined here rather than referenced.
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#050506",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 15% 10%, rgba(255,106,26,0.16), transparent 60%), " +
            "radial-gradient(ellipse 800px 500px at 90% 90%, rgba(45,212,191,0.12), transparent 60%)",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#ff6a1a",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 34,
              height: 34,
              alignItems: "center",
              justifyContent: "center",
              background: "#ff6a1a",
              color: "#050506",
              fontWeight: 700,
              borderRadius: 6,
            }}
          >
            A
          </div>
          [· portfolio ·]
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            color: "#e9edf6",
            letterSpacing: -2,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#2dd4bf",
          }}
        >
          {site.role}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 22,
            color: "#8b95ad",
            letterSpacing: 1,
          }}
        >
          Python · LangChain · LangGraph · RAG systems
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
