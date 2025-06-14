import LoginForm from "@/components/auth/LoginFormShadcn";

export const metadata = {
  title: "Connexion | Devisia - Générateur de devis",
  description: "Connectez-vous à votre compte Devisia pour gérer vos devis",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
