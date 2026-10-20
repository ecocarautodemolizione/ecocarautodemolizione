import QRCode from "qrcode";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") ?? "";
  const size = Number(searchParams.get("size") ?? 300);

  if (!text.trim()) {
    return new Response("Missing text", { status: 400 });
  }

  const pngBuffer = await QRCode.toBuffer(text, {
    type: "png",
    width: size,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
