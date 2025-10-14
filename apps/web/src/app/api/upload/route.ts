import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // The process is already running inside the /apps/web directory,
  // so we just need to point to the 'public' folder from there.
  const path = join(process.cwd(), "public/uploads", file.name);
  try {
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${file.name}`,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({
      success: false,
      message: "Error saving file.",
    });
  }
}
