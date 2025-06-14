"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [mounted, setMounted] = useState(false);
  
  // Paramètres généraux
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyVAT, setCompanyVAT] = useState("");
  
  // Paramètres des devis
  const [quotePrefix, setQuotePrefix] = useState("DEV");
  const [defaultVAT, setDefaultVAT] = useState(20);
  const [defaultCurrency, setDefaultCurrency] = useState("EUR");
  const [defaultDueDays, setDefaultDueDays] = useState(30);
  const [defaultNotes, setDefaultNotes] = useState("");
  
  // Paramètres de notification
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quoteReminders, setQuoteReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Paramètres d'apparence
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  
  // Éviter un problème d'hydratation avec next-themes
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implémenter la sauvegarde des paramètres généraux
    toast.success("Paramètres généraux sauvegardés");
  };
  
  const handleQuoteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implémenter la sauvegarde des paramètres de devis
    toast.success("Paramètres de devis sauvegardés");
  };
  
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implémenter la sauvegarde des paramètres de notification
    toast.success("Paramètres de notification sauvegardés");
  };
  
  const handleAppearanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Paramètres d'apparence sauvegardés");
  };
  
  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-3 bg-card shadow-sm border border-border rounded-lg overflow-hidden">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full" />
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="p-6">
              <Skeleton className="h-7 w-40 mb-6" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32 mt-4" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center text-primary mb-8">Paramètres du compte</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-3 bg-card shadow-sm border border-border rounded-lg overflow-hidden">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                  activeTab === "general" 
                    ? "bg-primary-100 text-primary-600 font-medium" 
                    : "text-foreground hover:bg-background-100"
                }`}
              >
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Général
              </button>
              <button
                onClick={() => setActiveTab("quotes")}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                  activeTab === "quotes" 
                    ? "bg-primary-100 text-primary-600 font-medium" 
                    : "text-foreground hover:bg-background-100"
                }`}
              >
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Devis
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                  activeTab === "notifications" 
                    ? "bg-primary-100 text-primary-600 font-medium" 
                    : "text-foreground hover:bg-background-100"
                }`}
              >
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center ${
                  activeTab === "appearance" 
                    ? "bg-primary-100 text-primary-600 font-medium" 
                    : "text-foreground hover:bg-background-100"
                }`}
              >
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Apparence
              </button>
            </nav>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <Card className="p-6 bg-card border border-border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres généraux
              </h2>
              
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full py-2 px-3 border border-input rounded-md shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 placeholder-muted-foreground"
                    placeholder="Entrez le nom de votre entreprise"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Adresse de l'entreprise</label>
                  <textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full py-2 px-3 border border-input rounded-md shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 placeholder-muted-foreground"
                    rows={3}
                    placeholder="Entrez l'adresse de votre entreprise"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Site web</label>
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="w-full py-2 px-3 border border-input rounded-md shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 placeholder-muted-foreground"
                      placeholder="Entrez l'URL de votre site web"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Numéro de TVA</label>
                    <input
                      type="text"
                      value={companyVAT}
                      onChange={(e) => setCompanyVAT(e.target.value)}
                      className="w-full py-2 px-3 border border-input rounded-md shadow-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors duration-200 placeholder-muted-foreground"
                      placeholder="Entrez votre numéro de TVA"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          {activeTab === "quotes" && (
            <Card className="p-6 bg-card border border-border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Paramètres des devis
              </h2>
              
              <form onSubmit={handleQuoteSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Préfixe du numéro de devis</label>
                    <input
                      type="text"
                      value={quotePrefix}
                      onChange={(e) => setQuotePrefix(e.target.value)}
                      className="w-full py-2.5 px-4 border border-input rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="DEV"
                    />
                    <p className="text-sm text-muted-foreground mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Exemple: "DEV" donnera des numéros comme DEV-0001
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Taux de TVA par défaut (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={defaultVAT}
                      onChange={(e) => setDefaultVAT(parseFloat(e.target.value))}
                      className="w-full py-2.5 px-4 border border-input rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                      placeholder="20.0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Devise</label>
                    <select
                      value={defaultCurrency}
                      onChange={(e) => setDefaultCurrency(e.target.value)}
                      className="w-full p-2 border border-input rounded focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar américain ($)</option>
                      <option value="GBP">Livre sterling (£)</option>
                      <option value="CAD">Dollar canadien ($)</option>
                      <option value="CHF">Franc suisse (Fr)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Délai de paiement par défaut (jours)</label>
                    <input
                      type="number"
                      min="0"
                      value={defaultDueDays}
                      onChange={(e) => setDefaultDueDays(parseInt(e.target.value))}
                      className="w-full p-2 border border-input rounded focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes par défaut pour les devis</label>
                  <textarea
                    value={defaultNotes}
                    onChange={(e) => setDefaultNotes(e.target.value)}
                    className="w-full p-2 border border-input rounded focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    rows={4}
                    placeholder="Ces notes apparaîtront sur tous vos devis par défaut."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          {activeTab === "notifications" && (
            <Card className="p-6 bg-card border border-border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Paramètres de notification
              </h2>
              
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded mb-2">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email sur l'activité de votre compte
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${emailNotifications ? 'bg-primary' : 'bg-muted'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring transition-colors`}>
                      <div className={`h-5 w-5 rounded-full bg-white absolute left-0.5 top-0.5 transition-transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded mb-2">
                  <div>
                    <p className="font-medium">Rappels de devis</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels pour les devis en attente ou à échéance
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quoteReminders}
                      onChange={() => setQuoteReminders(!quoteReminders)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${quoteReminders ? 'bg-primary' : 'bg-muted'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring transition-colors`}>
                      <div className={`h-5 w-5 rounded-full bg-white absolute left-0.5 top-0.5 transition-transform ${quoteReminders ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded mb-2">
                  <div>
                    <p className="font-medium">Emails marketing</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des mises à jour sur les nouvelles fonctionnalités et offres
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={() => setMarketingEmails(!marketingEmails)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer ${marketingEmails ? 'bg-primary' : 'bg-muted'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring transition-colors`}>
                      <div className={`h-5 w-5 rounded-full bg-white absolute left-0.5 top-0.5 transition-transform ${marketingEmails ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          {activeTab === "appearance" && (
            <Card className="p-6 bg-card border border-border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Paramètres d'apparence
              </h2>
              
              <form onSubmit={handleAppearanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Couleur principale</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-10 rounded cursor-pointer input-visible"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full p-2 border border-input rounded focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-1">Thème</label>
                  
                  {mounted && (
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                          theme === "light" ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <svg className="w-6 h-6 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                        <span className="text-sm font-medium">Clair</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                          theme === "dark" ? "border-primary bg-primary/10" : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <svg className="w-6 h-6 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                        <span className="text-sm font-medium">Sombre</span>
                      </button>
                      
                 
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Enregistrer les paramètres
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
