import { Heart, MessageCircle, Bookmark, Send, Flower2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PostCardProps {
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
  username, 
  userAvatar, 
  plantName, 
  plantImage, 
  likes, 
  comments, 
  shares,
  description,
  hasStory = false,
  isVerified = false,
  isFollowing = false
}: PostCardProps) => {
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
        {!isFollowing && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full px-4 border-border hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
          >
            Seguir
          </Button>
        )}
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={plantImage} 
          alt={plantName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
            <Send className="w-5 h-5" />
            <span className="text-sm font-medium">{shares}</span>
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto text-foreground hover:text-primary">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-sm">
          <span className="font-semibold text-foreground">{username}</span>
          <span className="text-foreground ml-2">{description}</span>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
