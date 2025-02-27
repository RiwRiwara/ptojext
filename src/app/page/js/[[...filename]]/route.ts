import { promises as fs } from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";

type Params = Promise<{ filename: string[] }>;

export async function GET(
  request: NextRequest,
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  const filename = params.filename?.length ? params.filename.join("/") : null;
  if (!filename) {
    return new NextResponse("No filename provided", { status: 400 });
  }

  const assetPath = path.join(
    process.cwd(),
    "src",
    "assets/js",
    `${filename}.js`
  );

  try {
    const fileContent = await fs.readFile(assetPath, "utf-8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("File not found", { status: 404 });
  }
}
