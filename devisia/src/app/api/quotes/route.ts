import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Récupérer tous les devis de cet utilisateur
    const quotes = await prisma.quote.findMany({
      where: {
        userId: userId
      },
      include: {
        client: true,
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validation basique des données
    if ((!data.clientId && !data.clientName) || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Veuillez fournir les informations client et au moins un article" },
        { status: 400 }
      );
    }
    
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Générer un numéro de devis unique avec l'année et un compteur
    const year = new Date().getFullYear();
    const lastQuote = await prisma.quote.findFirst({
      where: {
        quoteNumber: {
          startsWith: `DEV-${year}-`
        }
      },
      orderBy: {
        quoteNumber: 'desc'
      }
    });
    
    let quoteNumber = `DEV-${year}-001`;
    
    if (lastQuote) {
      const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[2]);
      quoteNumber = `DEV-${year}-${(lastNumber + 1).toString().padStart(3, '0')}`;
    }
    
    // Calculer le montant total
    const totalAmount = data.items.reduce((sum: number, item: any) => {
      const itemTotal = item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100);
      return sum + itemTotal;
    }, 0);
    
    // Créer le devis dans la base de données
    const newQuote = await prisma.quote.create({
      data: {
        quoteNumber,
        totalAmount,
        status: data.status || "DRAFT",
        expiryDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes || null,
        
        // Lier au client existant ou stocker les informations du client
        ...(data.clientId ? {
          client: {
            connect: { id: data.clientId }
          }
        } : {
          clientName: data.clientName,
          clientEmail: data.clientEmail || null,
          clientCompany: data.clientCompany || null,
          clientPhone: data.clientPhone || null
        }),
        
        // Lier à l'utilisateur
        user: {
          connect: { id: userId }
        },
        
        // Créer les éléments du devis
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate || null
          }))
        }
      },
      include: {
        client: true,
        items: true
      }
    });
    
    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du devis" },
      { status: 500 }
    );
  }
}
