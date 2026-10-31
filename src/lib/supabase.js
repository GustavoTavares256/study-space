import { createClient } from "@supabase/supabase-js";

// Cliente Supabase preparado para a integração futura.
// As credenciais reais serão configuradas via variáveis de ambiente (Vite).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : {};

// Stub que expõe a API esperada pelo restante da aplicação,
// permitindo a troca gradual de persistência sem reescrever componentes.
export const supabaseService = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => {
    throw new Error("Conexão com Supabase ainda não configurada.");
  },
};
