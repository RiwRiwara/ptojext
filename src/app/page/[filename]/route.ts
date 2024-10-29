import { promises as fs } from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";

type Params = Promise<{ filename: string }>;

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  const filename = params.filename;

  const assetPath = path.join(
    process.cwd(),
    "src",
    "assets/templates",
    filename + ".html"
  );

  try {
    const fileContent = await fs.readFile(assetPath, "utf-8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("File not found", { status: 404 });
  }
}
