import { supabase } from './supabaseClient';

export const DatabaseAdapter = {
  // Authentification
  auth: {
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    },
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
    getSession: async () => {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    },
    getUser: async () => {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    },
    updateUser: async (userData: { full_name?: string; company_name?: string }) => {
      const { data, error } = await supabase.auth.updateUser({
        data: userData,
      });
      return { data, error };
    },
  },

  // Gestion des devis
  quotes: {
    createQuote: async (quoteData: any) => {
      const { data, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select('*')
        .single();
      return { data, error };
    },
    getQuotes: async (userId: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    getQuoteById: async (quoteId: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, quote_items(*)')
        .eq('id', quoteId)
        .single();
      return { data, error };
    },
    updateQuote: async (quoteId: string, updates: any) => {
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', quoteId)
        .select('*')
        .single();
      return { data, error };
    },
    deleteQuote: async (quoteId: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);
      return { error };
    },
  },

  // Gestion des éléments de devis
  quoteItems: {
    addQuoteItem: async (quoteItemData: any) => {
      const { data, error } = await supabase
        .from('quote_items')
        .insert(quoteItemData)
        .select('*')
        .single();
      return { data, error };
    },
    updateQuoteItem: async (itemId: string, updates: any) => {
      const { data, error } = await supabase
        .from('quote_items')
        .update(updates)
        .eq('id', itemId)
        .select('*')
        .single();
      return { data, error };
    },
    deleteQuoteItem: async (itemId: string) => {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('id', itemId);
      return { error };
    },
  },

  // Profil utilisateur
  users: {
    getUserProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    },
    updateUserProfile: async (userId: string, updates: any) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('*')
        .single();
      return { data, error };
    },
  },
};
