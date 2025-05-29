"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        console.error("Erreur détaillée:", result.error);
        
        // Gérer différents types d'erreurs
        if (result.error.includes("email_not_confirmed")) {
          setError("Votre adresse email n'a pas été confirmée. Vérifiez votre boîte mail ou contactez le support.");
        } else if (result.error.includes("Invalid credentials") || result.error.includes("No user found")) {
          setError("Email ou mot de passe incorrect");
        } else if (result.error.includes("not found")) {
          setError("Compte non trouvé. Veuillez vérifier votre email ou vous inscrire.");
        } else {
          setError("Échec de la connexion: " + result.error);
        }
        return;
      }
      
      toast.success("Connexion réussie");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center text-secondary-600">
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link 
                href="/auth/forgotten-password" 
                className="text-sm text-primary-600 hover:text-primary-800 hover:underline"
              >
                Mot de passe oublié?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-secondary-600">Vous n'avez pas de compte? </span>
          <Link href="/auth/register" className="text-primary-600 hover:text-primary-800 hover:underline font-medium">
            Créer un compte
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
