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
export const SupabaseUploader = async (files, folder = "products") => {
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

/**
 * Uploads a single profile picture to Supabase Storage in ProfilePictures folder.
 * @param {File} file - A single File object for the profile picture.
 * @returns {Promise<string>} A promise that resolves to the public URL of the uploaded image.
 */
export const uploadProfilePicture = async (file, folder = "profilePicture") => {
  if (!file) {
    throw new Error("No file provided for profile picture upload");
  }

  try {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filePath = `ProfilePictures/${timestamp}_${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      throw new Error(
        `Profile picture upload failed: ${uploadError.message}`
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    console.log(`Successfully uploaded profile picture: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading profile picture:`, error);
    throw error;
  }
};

/**
 * Deletes an image from Supabase Storage using its Public URL.
 * Used when replacing profile pictures to keep storage clean.
 * @param {string} imageUrl - The full public URL of the image to delete.
 */
export const deleteImageFromSupabase = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Check if the URL actually belongs to your Supabase project
    if (!imageUrl.includes(SUPABASE_URL)) {
      return; // Not a Supabase image, skip deletion
    }

    // URL format: .../storage/v1/object/public/images/Folder/Filename.jpg
    // We need to extract: Folder/Filename.jpg
    const bucketName = "images";
    const pathParts = imageUrl.split(`${bucketName}/`);

    if (pathParts.length < 2) {
      console.warn("Could not parse Supabase path for deletion:", imageUrl);
      return;
    }

    const pathToDelete = pathParts[1]; // The path relative to the bucket

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([pathToDelete]);

    if (error) {
      console.error("Error deleting old image from Supabase:", error);
    } else {
      console.log("Successfully deleted old image:", pathToDelete);
    }
  } catch (err) {
    console.error("Unexpected error deleting image:", err);
  }
};