import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type.split("/")[0];
    if (fileType !== "image" && fileType !== "video") {
      return NextResponse.json(
        { error: "File must be an image or video" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for videos, 5MB for images)
    const maxSize = fileType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Max ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Create unique filename
    const timestamp = new Date().getTime();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
    const filePath = `${timestamp}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from("lesson-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from("lesson-media")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
