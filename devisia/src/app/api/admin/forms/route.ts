import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FormTemplatePayload {
  name: string;
  description?: string | null;
  json: string; // stringified JSON
}

// GET: list all form templates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const templates = await prisma.formTemplate.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(templates);
  } catch (err) {
    console.error("Erreur GET /forms", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// POST: create template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data: FormTemplatePayload = await req.json();
    if (!data.name || !data.json) {
      return NextResponse.json({ error: "Nom et JSON requis" }, { status: 400 });
    }

    const created = await prisma.formTemplate.create({
      data: {
        name: data.name,
        description: data.description || null,
        json: data.json,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Erreur POST /forms", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Nom déjà utilisé" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
