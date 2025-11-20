import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oaacevaplgugwtvscznt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYWNldmFwbGd1Z3d0dnNjem50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDA4OTcsImV4cCI6MjA3OTIxNjg5N30.JpuL_ynhuD3UfGvQzQ0W3a5Gw-Z-yMv1z7XkRF6vfTU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Uploads an array of File objects to Supabase Storage.
 * @param {File[]} files - An array of File objects selected by the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of public URLs for the uploaded images.
 */
export const SupabaseUploader = async (files) => {
  if (!files || files.length === 0) {
    // Return an empty array instead of throwing an error if no files are provided,
    // as the calling component has already validated this.
    return [];
  }

  const uploadedUrls = [];

  for (const file of files) {
    try {
      
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_"); 
      
      const filePath = `products/${timestamp}${sanitizedFileName}`;

      // Upload file to the 'images' bucket
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false // Do not overwrite if file exists (though unique path prevents this)
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        // Throw a specific error for the file
        throw new Error(`Supabase upload failed for ${file.name}: ${uploadError.message}`);
      }

      // Get the public URL
      const {
        data: { publicUrl }
      } = supabase.storage.from("images").getPublicUrl(filePath);

      console.log(`Successfully uploaded: ${publicUrl}`);
      uploadedUrls.push(publicUrl);
    } catch (error) {
      console.error(`Error in SupabaseUploader for file ${file.name}:`, error);
      // Re-throw the error to be caught by the calling function (handleAddProduct)
      throw error;
    }
  }

  return uploadedUrls;
};