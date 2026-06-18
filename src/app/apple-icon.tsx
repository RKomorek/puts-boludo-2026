import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #055c37, #0e8f58)",
          borderRadius: 36,
        }}
      >
        <div style={{ color: "#f0b429", fontSize: 72, fontWeight: 800 }}>P</div>
        <div style={{ color: "#ffffff", fontSize: 18, marginTop: 4 }}>2026</div>
      </div>
    ),
    { ...size },
  );
}
