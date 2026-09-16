import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 35% 30%, #f0d78c 0%, #c9a13b 55%, #9c7a26 100%)",
            color: "#0a0a0a",
            fontSize: 26,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
          }}
        >
          K
        </div>
      </div>
    ),
    { ...size }
  );
}
