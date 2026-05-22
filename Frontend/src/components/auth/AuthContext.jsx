import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { supabase } from '../../supabaseClient';
import { AuthContext } from './authContextDefinition.js';
import logo from '../../assets/images/logo_teresAI.png';

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setSession(data.session);
      } catch (error) {
        console.error("Error al obtener la sesión inicial:", error);
        if (!active) return;
        setSession(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        if (_event === "SIGNED_IN") setLoading(true);
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    accessToken: session?.access_token ?? null,
    loading,
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "var(--app-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box component="img" src={logo} alt="TeresAI" sx={{ width: 120, height: "auto" }} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

