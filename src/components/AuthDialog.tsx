import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "La contraseña debe tener al menos 6 caracteres");
const usernameSchema = z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre es demasiado largo");

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    const emailResult = emailSchema.safeParse(loginEmail);
    if (!emailResult.success) {
      newErrors.loginEmail = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(loginPassword);
    if (!passwordResult.success) {
      newErrors.loginPassword = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    
    const usernameResult = usernameSchema.safeParse(signupName);
    if (!usernameResult.success) {
      newErrors.signupName = usernameResult.error.errors[0].message;
    }
    
    const emailResult = emailSchema.safeParse(signupEmail);
    if (!emailResult.success) {
      newErrors.signupEmail = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(signupPassword);
    if (!passwordResult.success) {
      newErrors.signupPassword = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) return;
    
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email o contraseña incorrectos");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Por favor confirma tu email antes de iniciar sesión");
      } else {
        toast.error("Error al iniciar sesión: " + error.message);
      }
      return;
    }
    
    toast.success("¡Bienvenido de vuelta!");
    onOpenChange(false);
    resetForm();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) return;
    
    setIsLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);
    
    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("Este email ya está registrado. Intenta iniciar sesión.");
      } else {
        toast.error("Error al crear cuenta: " + error.message);
      }
      return;
    }
    
    toast.success("¡Cuenta creada! Ya puedes empezar a usar Plantify");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Bienvenido a Plantify</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {errors.loginEmail && (
                  <p className="text-sm text-destructive">{errors.loginEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {errors.loginPassword && (
                  <p className="text-sm text-destructive">{errors.loginPassword}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nombre de usuario</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {errors.signupName && (
                  <p className="text-sm text-destructive">{errors.signupName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {errors.signupEmail && (
                  <p className="text-sm text-destructive">{errors.signupEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {errors.signupPassword && (
                  <p className="text-sm text-destructive">{errors.signupPassword}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
