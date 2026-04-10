import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get("title") || "Able Care";
  const subtitle = searchParams.get("subtitle") || "Falls Prevention Technology";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1432FF 0%, #0B1F99 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#00FFD2",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#00FFD2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "#1432FF",
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.05em",
            }}
          >
            ABLE CARE
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? "48px" : "56px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 300,
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.4)",
            fontWeight: 300,
          }}
        >
          www.able-care.co
        </div>

        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,210,0.15), transparent 70%)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
