import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { mockPosts } from "@/data/mockPosts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Vista móvil - Cards completas en columna */}
        <div className="max-w-2xl mx-auto space-y-6 md:hidden">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Vista desktop - Cuadrícula 3x3 de posts completos */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-w-7xl mx-auto">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
