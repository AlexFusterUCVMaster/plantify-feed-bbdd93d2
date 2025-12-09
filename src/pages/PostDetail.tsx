import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Send, Flower2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

import plant1 from "@/assets/plant1.jpg";
import plant2 from "@/assets/plant2.jpg";
import plant3 from "@/assets/plant3.jpg";
import plant4 from "@/assets/plant4.jpg";

const imageMap: Record<string, string> = {
  '/src/assets/plant1.jpg': plant1,
  '/src/assets/plant2.jpg': plant2,
  '/src/assets/plant3.jpg': plant3,
  '/src/assets/plant4.jpg': plant4,
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const [likesResult, commentsResult] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact' }).eq('post_id', data.id),
        supabase.from('comments').select('*').eq('post_id', data.id).order('created_at', { ascending: false }),
      ]);

      return {
        ...data,
        plantImage: imageMap[data.plant_image] || data.plant_image,
        likes: likesResult.count || 0,
        comments: commentsResult.data || [],
        commentsCount: commentsResult.data?.length || 0,
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Post no encontrado</h2>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleFollowClick = () => {
    setFollowing(!following);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden bg-card border-border shadow-lg">
            <div className="p-6 flex items-center gap-3 border-b border-border">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.user_avatar} alt={post.username} />
                <AvatarFallback className="bg-primary/10 text-primary">{post.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-foreground text-base">{post.username}</p>
                  {post.is_verified && (
                    <Flower2 className="w-4 h-4 text-primary fill-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{post.plant_name}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleFollowClick}
                className={`rounded-full px-4 transition-colors ${
                  following 
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600' 
                    : 'border-border hover:bg-green-500 hover:text-white hover:border-green-500'
                }`}
              >
                {following ? 'Siguiendo' : 'Seguir'}
              </Button>
            </div>

            <div className="relative aspect-square overflow-hidden bg-muted">
              <img 
                src={post.plantImage} 
                alt={post.plant_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 hover:text-primary ${liked ? 'text-green-500' : 'text-foreground'}`}
                  onClick={handleLikeClick}
                >
                  <Heart className={`w-6 h-6 transition-all ${liked ? 'fill-green-500 text-green-500' : ''}`} />
                  <span className="text-base font-medium">{post.likes + (liked ? 1 : 0)}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-base font-medium">{post.commentsCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
                  <Send className="w-6 h-6" />
                  <span className="text-base font-medium">0</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`ml-auto hover:text-primary ${saved ? 'text-green-500' : 'text-foreground'}`}
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark className={`w-6 h-6 transition-all ${saved ? 'fill-green-500 text-green-500' : ''}`} />
                </Button>
              </div>

              <div className="text-base border-t border-border pt-4">
                <span className="font-semibold text-foreground">{post.username}</span>
                <span className="text-foreground ml-2">{post.description}</span>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-4">Comentarios</h3>
                <div className="space-y-4">
                  {post.comments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay comentarios todavía</p>
                  ) : (
                    post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">Usuario</span>
                            <span className="text-foreground ml-2">{comment.content}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
