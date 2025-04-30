import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { supabase } from "@/infrastructure/supabase/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json();

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur dans Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        companyName: companyName || null,
      },
    });

    // Créer également l'utilisateur dans Supabase pour les fonctionnalités avancées
    const { data: supabaseUser, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
          company_name: companyName || null,
        },
      },
    });

    if (error) {
      console.error("Erreur Supabase lors de l'inscription:", error);
      // Ne pas échouer l'inscription si Supabase échoue, car nous avons déjà créé l'utilisateur dans Prisma
    }

    // Ne pas renvoyer le mot de passe hashé dans la réponse
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Inscription réussie", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
