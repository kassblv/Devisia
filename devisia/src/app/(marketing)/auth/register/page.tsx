import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata = {
  title: "Inscription | Devisia - Générateur de devis",
  description: "Créez un compte Devisia pour commencer à générer vos devis professionnels",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col ">
 
      
      <main className="relative flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>

    </div>
  );
}
