import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Couleurs par défaut pour le thème du PDF
const DEFAULT_COLORS = {
  primary: rgb(0.2, 0.4, 0.6),     // Bleu foncé pour l'en-tête et les titres
  secondary: rgb(0.8, 0.3, 0.2),   // Rouge pour les accents
  tertiary: rgb(0.3, 0.7, 0.4),    // Vert pour les totaux et les éléments positifs
  text: rgb(0.1, 0.1, 0.1),        // Presque noir pour le texte principal
  lightText: rgb(0.5, 0.5, 0.5),   // Gris pour les textes secondaires
  background: rgb(0.98, 0.98, 0.98),// Fond très légèrement gris
  tableHeader: rgb(0.95, 0.95, 0.98), // Fond légèrement bleu pour en-têtes de tableau
  tableBorder: rgb(0.8, 0.8, 0.8),  // Gris pour les bordures de tableau
  tableBorderStrong: rgb(0.6, 0.6, 0.6), // Bordure plus foncée pour tableau
};

// GET - Exporter un devis au format PDF
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Vérification de l'authentification
  try {
    // Récupérer la session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    const userId = session.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Utilisateur non identifié" }, { status: 401 });
    }
    
    // Récupérer l'ID du devis depuis les paramètres d'URL
    // Nous devons attendre params car il est asynchrone dans Next.js 13+
    const quoteId = await params.id;
    
    // Récupérer les données du devis
    const quote = await prisma.quote.findUnique({
      where: {
        id: quoteId,
        userId // S'assurer que le devis appartient à l'utilisateur
      },
      include: {
        client: true,
        items: true,
        user: true
      }
    });
    
    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    // Récupérer les préférences utilisateur (pour la personnalisation)
    // Vous pourriez ajouter un modèle UserSettings dans Prisma pour stocker ces préférences
    const userSettings = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        companyName: true,
        firstName: true,
        lastName: true,
        email: true,
        // Vous pouvez ajouter d'autres champs ici comme logoUrl, primaryColor, etc.
      }
    });

    // Création du document PDF
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage([595.28, 841.89]); // Format A4
    
    // Chargement des polices
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Dimensions et positions
    const { width, height } = currentPage.getSize();
    const margin = 50;
    let currentY = height - margin;
    
    // Fonction helper pour ajouter du texte
    const addText = (text: string, x: number, y: number, size: number = 12, font = helveticaFont, color = DEFAULT_COLORS.text) => {
      currentPage.drawText(text, {
        x,
        y,
        size,
        font,
        color
      });
      return y - (size * 1.5); // Retourne la position Y pour le prochain texte
    };
    
    // Fonction helper pour ajouter une ligne horizontale
    const addLine = (y: number, color = DEFAULT_COLORS.tableBorder, thickness = 1) => {
      currentPage.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness,
        color,
      });
      return y - 15; // Retourne la position Y pour le prochain élément
    };

    // Fonction pour ajouter un rectangle de fond
    const addRect = (x: number, y: number, width: number, height: number, color = DEFAULT_COLORS.background) => {
      currentPage.drawRectangle({
        x,
        y: y - height, // Ajustement car PDF-lib dessine depuis le coin inférieur gauche
        width,
        height,
        color,
        borderWidth: 0
      });
    };

    // Fonction helper pour ajouter un texte aligné à droite
    const addRightAlignedText = (text: string, x: number, y: number, size: number = 12, font = helveticaFont, color = DEFAULT_COLORS.text) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      currentPage.drawText(text, {
        x: x - textWidth, // Aligne à droite
        y,
        size,
        font,
        color
      });
      return y - (size * 1.5); // Retourne la position Y pour le prochain texte
    };

    // Fonction pour dessiner une cellule de tableau complète
    const drawTableCell = (x: number, y: number, width: number, height: number, text: string, isHeader = false, alignRight = false) => {
      // Dessiner le rectangle de fond
      const bgColor = isHeader ? DEFAULT_COLORS.tableHeader : rgb(1, 1, 1);
      currentPage.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        color: bgColor,
        borderWidth: 0.5,
        borderColor: DEFAULT_COLORS.tableBorderStrong,
      });
      
      // Ajouter le texte
      const font = isHeader ? helveticaBold : helveticaFont;
      const textColor = isHeader ? DEFAULT_COLORS.primary : DEFAULT_COLORS.text;
      const padding = 5;
      
      if (alignRight) {
        addRightAlignedText(text, x + width - padding, y - padding - (height / 2) + 4, 11, font, textColor);
      } else {
        currentPage.drawText(text, {
          x: x + padding,
          y: y - padding - (height / 2) + 4, // Centré verticalement
          size: 11,
          font,
          color: textColor
        });
      }
    };

    // Créer l'en-tête avec bande de couleur
    addRect(0, height, width, 120, DEFAULT_COLORS.primary);
    
    // En-tête du document avec couleur différente et plus grand
    currentY = height - 40; // Position Y pour le titre dans l'en-tête
    
    // Titre du devis en blanc sur fond coloré
    currentY = addText(`DEVIS N° ${quote.quoteNumber}`, margin, currentY, 28, timesBold, rgb(1, 1, 1));
    
    // Date et validité en plus petit et en blanc
    currentY = addText(`Date: ${new Date(quote.createdAt).toLocaleDateString('fr-FR')}`, margin, currentY, 12, helveticaFont, rgb(0.95, 0.95, 0.95));
    addText(`Validité: ${quote.expiryDate ? new Date(quote.expiryDate).toLocaleDateString('fr-FR') : '30 jours'}`, margin + 200, currentY, 12, helveticaFont, rgb(0.95, 0.95, 0.95));
    
    // Décalage après l'en-tête
    currentY = height - 140;

    // Section client et entreprise avec une présentation plus visuelle
    const clientInfoX = margin;
    const companyInfoX = width / 2 + 20;

    // Section client avec un fond coloré léger
    addRect(margin - 10, currentY + 10, width / 2 - margin - 10, 120, rgb(0.96, 0.96, 0.98));
    currentY = addText('CLIENT', clientInfoX, currentY, 16, helveticaBold, DEFAULT_COLORS.primary);
    currentY -= 5;
    if (quote.client) {
      currentY = addText(quote.client.name, clientInfoX, currentY, 14, helveticaBold);
      if (quote.client.company) currentY = addText(quote.client.company, clientInfoX, currentY, 12);
      if (quote.client.email) currentY = addText(quote.client.email, clientInfoX, currentY, 11);
      if (quote.client.phone) currentY = addText(quote.client.phone, clientInfoX, currentY, 11);
      if (quote.client.address) {
        const addressLines = quote.client.address.split(',');
        for (const line of addressLines) {
          currentY = addText(line.trim(), clientInfoX, currentY, 11);
        }
      }
    } else {
      currentY = addText(quote.clientName || 'Client non spécifié', clientInfoX, currentY, 14, helveticaBold);
      if (quote.clientEmail) currentY = addText(quote.clientEmail, clientInfoX, currentY, 11);
      if (quote.clientPhone) currentY = addText(quote.clientPhone, clientInfoX, currentY, 11);
    }

    // Section entreprise avec un fond différent
    let tempY = currentY + 100; // Position Y temporaire pour la section entreprise
    addRect(width / 2 + 10, tempY + 30, width / 2 - margin - 10, 120, rgb(0.94, 0.97, 1));
    tempY = addText('ENTREPRISE', companyInfoX, tempY, 16, helveticaBold, DEFAULT_COLORS.primary);
    tempY -= 5;

    // Informations de l'entreprise
    let companyName = userSettings?.companyName || quote.user?.companyName || 'Votre Entreprise';
    tempY = addText(companyName, companyInfoX, tempY, 14, helveticaBold);
    if (userSettings?.firstName && userSettings?.lastName) {
      tempY = addText(`${userSettings.firstName} ${userSettings.lastName}`, companyInfoX, tempY, 12);
    } else if (quote.user?.firstName && quote.user?.lastName) {
      tempY = addText(`${quote.user.firstName} ${quote.user.lastName}`, companyInfoX, tempY, 12);
    }

    // Email de contact
    const contactEmail = userSettings?.email || quote.user?.email || 'contact@example.com';
    tempY = addText(contactEmail, companyInfoX, tempY, 11);

    // On pourrait ajouter ici le logo de l'entreprise si disponible
    /* 
    // Exemple pour ajouter un logo (vous devrez implémenter la partie fetch du logo)
    if (userSettings?.logoUrl) {
      const logoBytes = await fetch(userSettings.logoUrl).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.5); // Ajuster la taille selon vos besoins
      
      currentPage.drawImage(logoImage, {
        x: width - margin - logoDims.width,
        y: height - 40 - logoDims.height / 2,
        width: logoDims.width,
        height: logoDims.height,
      });
    }
    */

    // On prend la position Y la plus basse entre client et entreprise
    currentY = Math.min(currentY, tempY) - 20;

    // Ligne de séparation avec épaisseur et couleur personnalisées
    currentY = addLine(currentY, DEFAULT_COLORS.primary, 2);
    currentY -= 10;

    // Description du projet avec style amélioré
    addRect(margin - 10, currentY + 25, width - 2 * margin + 20, 20, DEFAULT_COLORS.tableHeader);
    currentY = addText('DESCRIPTION DU PROJET', margin, currentY, 16, helveticaBold, DEFAULT_COLORS.primary);
    currentY -= 15;

    // Découper la description en lignes si elle est longue
    const description = quote.notes || 'Aucune description disponible';
    const descriptionLines = [];
    let tempDescription = description;
    const maxLineWidth = width - (margin * 2);

    while (tempDescription.length > 0) {
      // Calculer combien de caractères peuvent tenir dans une ligne
      let lineLength = 0;
      for (let i = 0; i < tempDescription.length; i++) {
        const textWidth = helveticaFont.widthOfTextAtSize(tempDescription.substring(0, i + 1), 11);
        if (textWidth > maxLineWidth) {
          lineLength = i;
          break;
        }
        lineLength = i + 1;
      }

      if (lineLength === 0) lineLength = tempDescription.length;

      // Ajouter la ligne et continuer avec le reste du texte
      descriptionLines.push(tempDescription.substring(0, lineLength));
      tempDescription = tempDescription.substring(lineLength).trim();

      // Sécurité pour éviter une boucle infinie
      if (descriptionLines.length > 100) break;
    }

    // Afficher les lignes de description
    descriptionLines.forEach(line => {
      currentY = addText(line, margin, currentY, 11, timesRoman);
    });

    currentY -= 20;

    // Ligne de séparation simple avant le tableau
    currentY = addLine(currentY);
    currentY -= 5;

    // En-têtes du tableau d'éléments avec un vrai tableau
    let tableTop = currentY;
    const tableLeft = margin;
    const tableWidth = width - (2 * margin);
    
    // Définir les largeurs de colonnes
    const colWidths = {
      description: tableWidth * 0.55,
      quantity: tableWidth * 0.10,
      unitPrice: tableWidth * 0.15,
      total: tableWidth * 0.20
    };
    
    // Coordonnées X pour chaque colonne
    const colX = {
      description: tableLeft,
      quantity: tableLeft + colWidths.description,
      unitPrice: tableLeft + colWidths.description + colWidths.quantity,
      total: tableLeft + colWidths.description + colWidths.quantity + colWidths.unitPrice
    };
    
    // Hauteur des cellules
    const rowHeight = 30;
    const headerHeight = 35;
    
    // Dessiner les en-têtes
    drawTableCell(colX.description, tableTop, colWidths.description, headerHeight, 'DESCRIPTION', true);
    drawTableCell(colX.quantity, tableTop, colWidths.quantity, headerHeight, 'QTÉ', true, true);
    drawTableCell(colX.unitPrice, tableTop, colWidths.unitPrice, headerHeight, 'PRIX UNIT.', true, true);
    drawTableCell(colX.total, tableTop, colWidths.total, headerHeight, 'TOTAL HT', true, true);
    
    currentY = tableTop - headerHeight;
    
    // Fonction pour formater les nombres avec séparateur de milliers sans utiliser toLocaleString
    const formatNumber = (number: number, decimals = 2): string => {
      // Formater avec le nombre de décimales demandé
      const fixed = number.toFixed(decimals);
      
      // Séparer partie entière et décimale
      const parts = fixed.split('.');
      const integerPart = parts[0];
      const decimalPart = parts.length > 1 ? parts[1] : '';
      
      // Ajouter les séparateurs de milliers à la partie entière
      let formattedInteger = '';
      for (let i = 0; i < integerPart.length; i++) {
        if (i > 0 && (integerPart.length - i) % 3 === 0) {
          formattedInteger += ' '; // Espace normal, pas insécable
        }
        formattedInteger += integerPart.charAt(i);
      }
      
      // Reconstituer le nombre formaté
      return `${formattedInteger}${decimalPart ? ',' + decimalPart : ''} €`;
    };

    // Éléments du devis avec alternance de couleurs et alignement correct
    quote.items.forEach((item, index) => {
      // Vérifier s'il faut ajouter une nouvelle page
      if (currentY - rowHeight < 150) {
        // Ajouter une nouvelle page
        currentPage = pdfDoc.addPage([595.28, 841.89]);
        currentY = height - margin;
        tableTop = currentY;
        
        // Ré-ajouter les en-têtes sur la nouvelle page
        drawTableCell(colX.description, tableTop, colWidths.description, headerHeight, 'DESCRIPTION', true);
        drawTableCell(colX.quantity, tableTop, colWidths.quantity, headerHeight, 'QTÉ', true, true);
        drawTableCell(colX.unitPrice, tableTop, colWidths.unitPrice, headerHeight, 'PRIX UNIT.', true, true);
        drawTableCell(colX.total, tableTop, colWidths.total, headerHeight, 'TOTAL HT', true, true);
        
        currentY = tableTop - headerHeight;
      }
      
      // Fond alterné pour certaines lignes
      const isAlternateRow = index % 2 === 1;
      const rowBgColor = isAlternateRow ? rgb(0.97, 0.97, 1) : rgb(1, 1, 1);
      
      // Convertir les valeurs en nombres
      const quantity = item.quantity;
      const unitPrice = Number(item.unitPrice);
      const lineTotal = quantity * unitPrice;
      
      // Formater les valeurs monétaires avec espacement des milliers
      const formattedUnitPrice = formatNumber(unitPrice, 2);
      const formattedLineTotal = formatNumber(lineTotal, 2);
      
      // Dessiner les cellules
      drawTableCell(colX.description, currentY, colWidths.description, rowHeight, item.description, false);
      drawTableCell(colX.quantity, currentY, colWidths.quantity, rowHeight, quantity.toString(), false, true);
      drawTableCell(colX.unitPrice, currentY, colWidths.unitPrice, rowHeight, formattedUnitPrice, false, true);
      drawTableCell(colX.total, currentY, colWidths.total, rowHeight, formattedLineTotal, false, true);
      
      currentY -= rowHeight;
    });
    
    // Section des totaux avec une présentation professionnelle
    const totalSectionTop = currentY;
    
    // Calculer les totaux
    const totalHT = quote.items.reduce((total, item) => {
      return total + (item.quantity * Number(item.unitPrice));
    }, 0);
    
    // Calculer la TVA (20% par défaut)
    const tauxTVA = 0.2; // 20%
    const totalTVA = totalHT * tauxTVA;
    const totalTTC = totalHT + totalTVA;
    
    // Largeur de la zone des totaux
    const totalSectionWidth = colWidths.unitPrice + colWidths.total;
    
    // Fond pour toute la section des totaux
    currentPage.drawRectangle({
      x: colX.unitPrice,
      y: totalSectionTop,
      width: totalSectionWidth,
      height: -90, // Hauteur négative car dessinée vers le bas
      color: rgb(0.97, 0.97, 0.99),
      borderWidth: 0.5,
      borderColor: DEFAULT_COLORS.tableBorderStrong,
    });
    
    // Tailles des cellules de totaux
    const totalRowHeight = 25;
    
    // Formater les valeurs monétaires avec espacement des milliers
    const formattedTotalHT = formatNumber(totalHT, 2);
    const formattedTotalTVA = formatNumber(totalTVA, 2);
    const formattedTotalTTC = formatNumber(totalTTC, 2);
    
    // Dessiner les lignes de totaux
    // Total HT
    currentY -= 5; // Espacement
    currentPage.drawText('Total HT :', {
      x: colX.unitPrice + 10,
      y: currentY - 10,
      size: 12,
      font: helveticaBold,
      color: DEFAULT_COLORS.text
    });
    addRightAlignedText(formattedTotalHT, colX.total + colWidths.total - 10, currentY - 10, 12, helveticaFont);
    currentY -= totalRowHeight;
    
    // TVA
    currentPage.drawText('TVA (20%) :', {
      x: colX.unitPrice + 10,
      y: currentY - 10,
      size: 12,
      font: helveticaBold,
      color: DEFAULT_COLORS.text
    });
    addRightAlignedText(formattedTotalTVA, colX.total + colWidths.total - 10, currentY - 10, 12, helveticaFont);
    currentY -= totalRowHeight;
    
    // Fond pour le Total TTC
    currentPage.drawRectangle({
      x: colX.unitPrice,
      y: currentY,
      width: totalSectionWidth,
      height: totalRowHeight + 5,
      color: DEFAULT_COLORS.primary,
    });
    
    // Total TTC
    currentPage.drawText('TOTAL TTC :', {
      x: colX.unitPrice + 10,
      y: currentY - 15,
      size: 14,
      font: timesBold,
      color: rgb(1, 1, 1) // Blanc
    });
    addRightAlignedText(formattedTotalTTC, colX.total + colWidths.total - 10, currentY - 15, 14, timesBold, rgb(1, 1, 1));

    // Note de bas de page
    const footerY = 70;
    currentY = footerY;

    // Ligne de séparation pour le pied de page
    addRect(0, 50, width, 50, rgb(0.95, 0.95, 0.95));
    addLine(currentY, DEFAULT_COLORS.lightText, 1);
    currentY -= 15;

    // Texte du pied de page
    addText('Conditions de paiement : 30 jours à compter de la date de facturation', margin, currentY, 9, helveticaFont, DEFAULT_COLORS.lightText);
    currentY -= 15;
    addText('Merci de votre confiance !', margin, currentY, 9, helveticaFont, DEFAULT_COLORS.lightText);

    // Numéro de page en bas à droite
    addText('Page 1/1', width - margin - 50, 30, 8, helveticaFont, DEFAULT_COLORS.lightText);

    // Sérialiser le PDF
    const pdfBytes = await pdfDoc.save();

    // Définir les en-têtes pour la réponse
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename=devis-${quote.quoteNumber}.pdf`);

    // Retourner le PDF comme réponse
    return new NextResponse(pdfBytes, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error("Erreur lors de l'exportation du devis en PDF:", error);
    return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 });
  }
}
