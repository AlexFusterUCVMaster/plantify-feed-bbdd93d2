import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEMO_IMAGES = [
  {
    name: "plant1.jpg",
    url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
  },
  {
    name: "plant2.jpg", 
    url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
  },
  {
    name: "plant3.jpg",
    url: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
  },
  {
    name: "plant4.jpg",
    url: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const uploadedImages: { name: string; publicUrl: string }[] = [];

    for (const image of DEMO_IMAGES) {
      // Fetch the image from URL
      const response = await fetch(image.url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(`demo/${image.name}`, uint8Array, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(`Error uploading ${image.name}:`, uploadError);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("plant-images")
        .getPublicUrl(`demo/${image.name}`);

      uploadedImages.push({
        name: image.name,
        publicUrl: urlData.publicUrl,
      });
    }

    // Update posts with new URLs
    const imageUrlMap: Record<string, string> = {};
    uploadedImages.forEach((img) => {
      imageUrlMap[`/src/assets/${img.name}`] = img.publicUrl;
    });

    // Get all posts and update their image URLs
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("id, plant_image");

    if (fetchError) {
      throw fetchError;
    }

    for (const post of posts || []) {
      const newUrl = imageUrlMap[post.plant_image];
      if (newUrl) {
        await supabase
          .from("posts")
          .update({ plant_image: newUrl })
          .eq("id", post.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        uploadedImages,
        message: "Demo images uploaded and posts updated" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
