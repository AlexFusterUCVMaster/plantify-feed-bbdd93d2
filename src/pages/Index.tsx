import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import plant1 from "@/assets/plant1.jpg";
import plant2 from "@/assets/plant2.jpg";
import plant3 from "@/assets/plant3.jpg";
import plant4 from "@/assets/plant4.jpg";

const mockPosts = [
  {
    id: 1,
    username: "PlantLover_92",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    plantName: "Monstera Deliciosa",
    plantImage: plant1,
    likes: 234,
    comments: 18,
    description: "¡Mi monstera finalmente tiene una hoja nueva! 🌿 Estoy tan emocionada"
  },
  {
    id: 2,
    username: "GreenThumbCarla",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
    plantName: "Pothos Rosa",
    plantImage: plant2,
    likes: 189,
    comments: 24,
    description: "Las flores de mi pothos son preciosas esta temporada 💕"
  },
  {
    id: 3,
    username: "SucculentJuan",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    plantName: "Colección de Suculentas",
    plantImage: plant3,
    likes: 312,
    comments: 31,
    description: "Mi colección va creciendo poco a poco 🌵 ¿Cuál es vuestra favorita?"
  },
  {
    id: 4,
    username: "UrbanJungle_Ana",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    plantName: "Ficus Lyrata",
    plantImage: plant4,
    likes: 421,
    comments: 45,
    description: "Mi ficus está alcanzando el techo! 🌳 Consejos para podarlo?"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
