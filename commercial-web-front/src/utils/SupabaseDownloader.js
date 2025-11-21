// commercial-web-front/src/utils/SupabaseUploader.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oaacevaplgugwtvscznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYWNldmFwbGd1Z3d0dnNjem50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA4OTcsImV4cCI6MjA3OTIxNjg5N30.JpuL_ynhuD3UfGvQzQ0W3a5Gw-Z-yMv1z7XkRF6vfTU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Uploads an array of File objects to Supabase Storage.
 * @param {File[]} files - An array of File objects selected by the user.
 * @param {string} [folder="products"] - Folder prefix in the bucket.
 * @returns {Promise<string[]>} A promise that resolves to an array of public URLs.
 */
export const SupabaseDownloader = async (files, folder = "ProfilePictures") => {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedUrls = [];

  for (const file of files) {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

      const filePath = `${folder}/${timestamp}_${sanitizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        throw new Error(
          `Supabase upload failed for ${file.name}: ${uploadError.message}`
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      console.log(`Successfully uploaded: ${publicUrl}`);
      uploadedUrls.push(publicUrl);
    } catch (error) {
      console.error(`Error in SupabaseUploader for file ${file.name}:`, error);
      throw error;
    }
  }

  return uploadedUrls;
};

