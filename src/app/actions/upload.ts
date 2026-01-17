"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'image' or 'video'

    if (!file) {
      return { error: "No file uploaded" };
    }

    const supabase = await createClient();
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Upload failed: User not authenticated", authError);
      return { error: "Unauthorized: Please log in" };
    }

    // Create unique filename
    const timestamp = new Date().getTime();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
    const filePath = `${user.id}/${timestamp}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from("lesson-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload file: " + uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("lesson-media")
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error("Internal upload error:", error);
    return { error: "Internal server error" };
  }
}
