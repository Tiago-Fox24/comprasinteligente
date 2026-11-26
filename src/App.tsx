import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Login from "./components/Login";
// mantenha seus imports atuais aqui

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <>
      {/* Barra discreta de usuário logado */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <span>Olá, {session.user.user_metadata?.full_name || session.user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-red-600 hover:underline font-medium cursor-pointer"
        >
          Sair
        </button>
      </div>

      {/* Cole aqui o JSX da sua tela principal atual */}
    </>
  );
}
