import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Post {
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

const fetchPosts = async (): Promise<Post[]> => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Fetch likes and comments counts for each post
  const postsWithCounts = await Promise.all(
    (posts || []).map(async (post) => {
      const [likesResult, commentsResult] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact' }).eq('post_id', post.id),
        supabase.from('comments').select('id', { count: 'exact' }).eq('post_id', post.id),
      ]);

      return {
        id: post.id,
        username: post.username || 'Anonymous',
        userAvatar: post.user_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        plantName: post.plant_name,
        plantImage: post.plant_image,
        likes: likesResult.count || 0,
        comments: commentsResult.count || 0,
        shares: 0,
        description: post.description || '',
        hasStory: false,
        isVerified: post.is_verified || false,
        isFollowing: false,
      };
    })
  );

  return postsWithCounts;
};

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
};
