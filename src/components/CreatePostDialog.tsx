import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Upload, X, ImagePlus, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateDescription = async () => {
    if (!imagePreview) {
      toast.error("Primero selecciona una imagen");
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("describe-plant-image", {
        body: { imageBase64: imagePreview },
      });

      if (error) {
        throw error;
      }

      if (data?.description) {
        setDescription(data.description);
        toast.success("¡Descripción generada!");
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Error al generar la descripción");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para crear un post");
      return;
    }

    if (!imageFile) {
      toast.error("Por favor selecciona una imagen");
      return;
    }

    if (!plantName.trim()) {
      toast.error("Por favor ingresa el nombre de la planta");
      return;
    }

    setIsLoading(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("plant-images")
        .getPublicUrl(fileName);

      // Get user profile for username and avatar
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url, is_verified")
        .eq("user_id", user.id)
        .single();

      // Create post
      const { error: postError } = await supabase.from("posts").insert({
        user_id: user.id,
        plant_name: plantName.trim(),
        plant_image: urlData.publicUrl,
        description: description.trim() || null,
        username: profile?.username || user.user_metadata?.username || user.email?.split("@")[0],
        user_avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        is_verified: profile?.is_verified || false,
      });

      if (postError) {
        throw postError;
      }

      toast.success("¡Post creado exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
      resetForm();
    } catch (error: unknown) {
      console.error("Error creating post:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error al crear el post: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPlantName("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Compartir tu planta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Image upload */}
          <div className="space-y-2">
            <Label>Foto de tu planta</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="relative aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video max-w-xs mx-auto border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <ImagePlus className="w-10 h-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Haz clic para subir una imagen
                </span>
              </button>
            )}
          </div>

          {/* Plant name */}
          <div className="space-y-2">
            <Label htmlFor="plant-name">Nombre de la planta</Label>
            <Input
              id="plant-name"
              placeholder="Ej: Monstera Deliciosa"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={!imagePreview || isGeneratingDescription || isLoading}
                className="gap-1 text-xs"
              >
                {isGeneratingDescription ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Generar con IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Cuéntanos sobre tu planta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading || isGeneratingDescription}
              maxLength={500}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !imageFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publicar
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
