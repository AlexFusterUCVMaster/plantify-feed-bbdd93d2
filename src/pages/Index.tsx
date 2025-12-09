import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: posts, isLoading, error } = usePosts();

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-destructive">Error al cargar los posts</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <>
            {/* Loading skeleton for mobile */}
            <div className="max-w-2xl mx-auto space-y-6 md:hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-lg" />
              ))}
            </div>
            {/* Loading skeleton for desktop */}
            <div className="hidden md:grid grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-lg" />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Vista móvil - Cards completas en columna */}
            <div className="max-w-2xl mx-auto space-y-6 md:hidden">
              {posts?.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>

            {/* Vista desktop - Cuadrícula 3x3 de posts completos */}
            <div className="hidden md:grid grid-cols-3 gap-6 max-w-7xl mx-auto">
              {posts?.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
