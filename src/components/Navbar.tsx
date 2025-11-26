import { Leaf, Search, Plus, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
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
          <Button variant="ghost" size="icon" className="text-foreground">
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
