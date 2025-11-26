import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Send, Flower2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockPosts } from "@/data/mockPosts";
import { useState } from "react";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockPosts.find(p => p.id === Number(id));
  const [following, setFollowing] = useState(post?.isFollowing || false);

  if (!post) {
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
              <div className={post.hasStory ? "rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-green-600" : ""}>
                <Avatar className={`w-12 h-12 ${post.hasStory ? "border-2 border-background" : ""}`}>
                  <AvatarImage src={post.userAvatar} alt={post.username} />
                  <AvatarFallback className="bg-primary/10 text-primary">{post.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-foreground text-base">{post.username}</p>
                  {post.isVerified && (
                    <Flower2 className="w-4 h-4 text-primary fill-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{post.plantName}</p>
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
                alt={post.plantName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
                  <Heart className="w-6 h-6" />
                  <span className="text-base font-medium">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-base font-medium">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
                  <Send className="w-6 h-6" />
                  <span className="text-base font-medium">{post.shares}</span>
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto text-foreground hover:text-primary">
                  <Bookmark className="w-6 h-6" />
                </Button>
              </div>

              <div className="text-base border-t border-border pt-4">
                <span className="font-semibold text-foreground">{post.username}</span>
                <span className="text-foreground ml-2">{post.description}</span>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-4">Comentarios</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Comment1" />
                      <AvatarFallback className="bg-primary/10 text-primary">C</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">PlantFan_123</span>
                        <span className="text-foreground ml-2">¡Qué hermosa! 😍</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Comment2" />
                      <AvatarFallback className="bg-primary/10 text-primary">G</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">GreenAddict</span>
                        <span className="text-foreground ml-2">Consejos de cuidado? 🌱</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">hace 5 horas</p>
                    </div>
                  </div>
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
