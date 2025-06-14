"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas authentifié
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    
    // Ici, vous pourriez ajouter une vérification du rôle admin
    // par exemple: if (session?.user?.role !== "admin") router.push("/dashboard");
  }, [router, status, session]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen w-full overflow-auto">
        <SidebarProvider>
          <div className="flex h-full w-full">
            <AdminSidebar />
            <SidebarInset className="flex flex-col flex-1 min-w-0 w-full">
              <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 ">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
