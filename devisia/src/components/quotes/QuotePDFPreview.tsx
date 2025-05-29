import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuotePreview from './QuotePreview';
import { Spinner } from '@/components/ui/spinner';

interface QuotePDFPreviewProps {
  quote: any;
  client: any;
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    siret?: string;
    logo?: string;
  };
}

const QuotePDFPreview = ({ quote, client, companyInfo }: QuotePDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generatePDF();
  }, [quote, client, companyInfo]);

  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    setLoading(true);
    
    try {
      // Rendre le conteneur visible pendant la génération mais hors écran
      const container = contentRef.current.parentElement;
      if (container) {
        container.style.position = 'absolute';
        container.style.width = '210mm'; // Largeur A4
        container.style.height = 'auto';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.overflow = 'visible';
        container.style.display = 'block';
      }
      
      // Masquer les éléments qui ne doivent pas être imprimés
      const printElements = contentRef.current.querySelectorAll('.print\\:hidden');
      printElements.forEach(el => (el as HTMLElement).style.display = 'none');
      
      // Attendre que les images soient chargées
      const images = Array.from(contentRef.current.querySelectorAll('img'));
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      
      // Générer le PDF à partir du contenu HTML
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: true, // Activer les logs pour déboguer
        useCORS: true,
        allowTaint: true, // Permettre les images potentiellement taintées
        backgroundColor: '#ffffff', // Fond blanc explicite
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
      });
      
      // Restaurer l'affichage
      if (container) {
        container.style.position = '';
        container.style.width = '';
        container.style.height = '';
        container.style.left = '';
        container.style.top = '';
        container.style.display = 'none';
      }
      printElements.forEach(el => (el as HTMLElement).style.display = '');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      
      // Convertir le PDF en blob URL pour l'affichage
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour télécharger directement le PDF
  const printPDF = () => {
    if (pdfUrl) {
      // Créer un lien de téléchargement
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `Devis_${quote.number || 'sans-numero'}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Prévisualisation PDF</h2>
        <Button
          onClick={printPDF}
          disabled={loading || !pdfUrl}
          className="print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Télécharger PDF
        </Button>
      </div>

      {/* Contenu du devis à convertir en PDF */}
      <div className="hidden">
        <div ref={contentRef} className="bg-white w-full max-w-[210mm] mx-auto p-4">
          <QuotePreview quote={quote} client={client} companyInfo={companyInfo} />
        </div>
      </div>

      {/* Affichage du PDF */}
      <Card className="w-full flex-1 overflow-hidden bg-secondary-100 rounded-lg shadow-md">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center p-10">
            <Spinner className="w-8 h-8" />
            <span className="ml-2">Génération du PDF en cours...</span>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[70vh] border-none"
            title="PDF Preview"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-10 text-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Impossible de générer le PDF
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuotePDFPreview;