import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Send, Flower2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface PostCardProps {
  id: string;
  username: string;
  userAvatar: string;
  plantName: string;
  plantImage: string;
  likes: number;
  comments: number;
  shares: number;
  description: string;
  hasStory?: boolean;
  isVerified?: boolean;
  isFollowing?: boolean;
}

const PostCard = ({ 
  id,
  username, 
  userAvatar, 
  plantName, 
  plantImage, 
  likes, 
  comments: initialCommentCount, 
  shares,
  description,
  hasStory = false,
  isVerified = false,
  isFollowing = false
}: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [following, setFollowing] = useState(isFollowing);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        user_id,
        created_at,
        profiles:user_id (username, avatar_url)
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setCommentsList(data as unknown as Comment[]);
    }
  };

  const handleFollowClick = () => {
    setFollowing(!following);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleImageClick = () => {
    navigate(`/post/${id}`);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: commentText.trim(),
        post_id: id,
        user_id: user.id,
      })
      .select(`
        id,
        content,
        user_id,
        created_at,
        profiles:user_id (username, avatar_url)
      `)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
    } else if (data) {
      setCommentsList([data as unknown as Comment, ...commentsList]);
      setCommentCount(commentCount + 1);
      setCommentText("");
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="overflow-hidden bg-card border-border shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex items-center gap-3">
        <div className={hasStory ? "rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-green-600" : ""}>
          <Avatar className={`w-10 h-10 ${hasStory ? "border-2 border-background" : ""}`}>
            <AvatarImage src={userAvatar} alt={username} />
            <AvatarFallback className="bg-primary/10 text-primary">{username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-foreground text-sm">{username}</p>
            {isVerified && (
              <Flower2 className="w-4 h-4 text-primary fill-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{plantName}</p>
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

      <div 
        className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
        onClick={handleImageClick}
      >
        <img 
          src={plantImage} 
          alt={plantName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 hover:text-primary ${liked ? 'text-green-500' : 'text-foreground'}`}
            onClick={handleLikeClick}
          >
            <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-green-500 text-green-500' : ''}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 hover:text-primary ${showComments ? 'text-primary' : 'text-foreground'}`}
            onClick={handleCommentClick}
          >
            <MessageCircle className={`w-5 h-5 ${showComments ? 'fill-primary/20' : ''}`} />
            <span className="text-sm font-medium">{commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
            <Send className="w-5 h-5" />
            <span className="text-sm font-medium">{shares}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`ml-auto hover:text-primary ${saved ? 'text-green-500' : 'text-foreground'}`}
            onClick={() => setSaved(!saved)}
          >
            <Bookmark className={`w-5 h-5 transition-all ${saved ? 'fill-green-500 text-green-500' : ''}`} />
          </Button>
        </div>

        <div className="text-sm">
          <span className="font-semibold text-foreground">{username}</span>
          <span className="text-foreground ml-2">{description}</span>
        </div>

        {showComments && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder={user ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                disabled={!user || isSubmitting}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleSubmitComment}
                disabled={!user || !commentText.trim() || isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                Publicar
              </Button>
            </div>

            {commentsList.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {commentsList.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {comment.profiles?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <span className="font-semibold text-foreground">
                        {comment.profiles?.username || "Usuario"}
                      </span>
                      <span className="text-foreground ml-2">{comment.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
