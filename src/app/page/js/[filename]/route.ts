import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = await params;

  const assetPath = path.join(
    process.cwd(),
    "src",
    "assets/js",
    filename + ".js"
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
    return new NextResponse("File not found", { status: 404 });
  }
}
