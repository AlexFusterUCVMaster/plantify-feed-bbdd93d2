import plant1 from "@/assets/plant1.jpg";
import plant2 from "@/assets/plant2.jpg";
import plant3 from "@/assets/plant3.jpg";
import plant4 from "@/assets/plant4.jpg";

export interface Post {
  id: number;
  username: string;
  userAvatar: string;
  plantName: string;
  plantImage: string;
  likes: number;
  comments: number;
  shares: number;
  hasStory?: boolean;
  description: string;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export const mockPosts: Post[] = [
  {
    id: 1,
    username: "PlantLover_92",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    plantName: "Monstera Deliciosa",
    plantImage: plant1,
    likes: 234,
    comments: 18,
    shares: 12,
    hasStory: true,
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
    shares: 8,
    isVerified: true,
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
    shares: 15,
    hasStory: true,
    isFollowing: true,
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
    shares: 23,
    isVerified: true,
    description: "Mi ficus está alcanzando el techo! 🌳 Consejos para podarlo?"
  },
  {
    id: 5,
    username: "BotanicaMaria",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    plantName: "Calathea Ornata",
    plantImage: plant1,
    likes: 156,
    comments: 12,
    shares: 6,
    hasStory: true,
    description: "Las rayas rosas son perfectas 🎨 Me encanta como se ve con luz natural"
  },
  {
    id: 6,
    username: "PlantDad_Luis",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
    plantName: "Orquídea Phalaenopsis",
    plantImage: plant2,
    likes: 278,
    comments: 20,
    shares: 11,
    isFollowing: true,
    description: "Tres meses para que floreciera y valió la pena! 🌸"
  },
  {
    id: 7,
    username: "CactusQueen",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    plantName: "Echeveria Lola",
    plantImage: plant3,
    likes: 195,
    comments: 16,
    shares: 9,
    isVerified: true,
    description: "Los colores pastel de esta suculenta son un sueño 💜"
  },
  {
    id: 8,
    username: "TropicalPedro",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    plantName: "Alocasia Amazónica",
    plantImage: plant4,
    likes: 342,
    comments: 28,
    shares: 18,
    hasStory: true,
    description: "Hojas tan brillantes que parecen de plástico! ✨ Pero son 100% reales"
  },
  {
    id: 9,
    username: "GardenLover_Elena",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    plantName: "Philodendron Brasil",
    plantImage: plant1,
    likes: 267,
    comments: 22,
    shares: 14,
    description: "El variegado amarillo está increíble este año 💛🌿"
  }
];
