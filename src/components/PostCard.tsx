import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Send, Flower2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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
  comments, 
  shares,
  description,
  hasStory = false,
  isVerified = false,
  isFollowing = false
}: PostCardProps) => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(isFollowing);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(false);

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
          <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments}</span>
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
      </div>
    </Card>
  );
};

export default PostCard;
