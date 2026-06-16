import { ImageResponse } from "next/og";
import { SITE_NAME, VALUE_PROPOSITION } from "@/config/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#050505",
          padding: "64px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ff2800",
            marginBottom: 24,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f2f2f2",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          PRATEEK
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#ff2800",
            marginTop: 16,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Software Engineer // Systems &amp; Data
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#a4a4a4",
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {VALUE_PROPOSITION}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 64,
            fontSize: 16,
            color: "#707070",
            letterSpacing: "0.15em",
          }}
        >
          SECTOR 01 // PADDOCK — INTERACTIVE 3D PORTFOLIO
        </div>
      </div>
    ),
    { ...size }
  );
}
