import { useState } from "react";
import { Leaf, Search, Plus, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthDialog from "./AuthDialog";
import CreatePostDialog from "./CreatePostDialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    toast.success("Sesión cerrada");
  };

  const handleCreatePost = () => {
    if (!user) {
      toast.error("Inicia sesión para crear un post");
      setAuthDialogOpen(true);
      return;
    }
    setCreatePostDialogOpen(true);
  };

  const userInitial = user?.user_metadata?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const userName = user?.user_metadata?.username || user?.email?.split("@")[0] || "Usuario";

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Plantify</h1>
        </div>
        
        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar plantas..." 
              className="pl-10 bg-secondary/50 border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground"
            onClick={handleCreatePost}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Heart className="w-5 h-5" />
          </Button>
          
          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-foreground"
              onClick={() => setAuthDialogOpen(true)}
            >
              <User className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <CreatePostDialog open={createPostDialogOpen} onOpenChange={setCreatePostDialogOpen} />
    </nav>
  );
};

export default Navbar;
