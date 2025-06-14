import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FormTemplatePayload {
  name: string;
  description?: string | null;
  json: string;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data: FormTemplatePayload = await req.json();
    const updated = await prisma.formTemplate.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        json: data.json,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erreur PUT /forms/[id]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.formTemplate.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /forms/[id]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
