import axios from "axios";
import { LogIn, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { server } from "../main";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { code?: string; error?: string }) => void;
          }) => { requestCode: () => void };
        };
      };
    };
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function Login() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuth, setUser } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? "/account";

  useEffect(() => {
    if (!googleClientId) return;
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    const script = existing ?? document.createElement("script");
    const onLoad = () => setReady(true);

    script.addEventListener("load", onLoad);
    if (!existing) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google) {
      setReady(true);
    }
    return () => script.removeEventListener("load", onLoad);
  }, []);

  const signIn = () => {
    if (!googleClientId) {
      setError("Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to app/.env.local.");
      return;
    }
    if (!window.google) {
      setError("Google sign-in is still loading. Please try again in a moment.");
      return;
    }

    setError("");
    setLoading(true);
    window.google.accounts.oauth2
      .initCodeClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: async ({ code, error: googleError }) => {
          if (googleError || !code) {
            setError(googleError ?? "Google did not return an authorization code.");
            setLoading(false);
            return;
          }
          try {
            const { data } = await axios.post(`${server}/api/user/login`, { code });
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setIsAuth(true);
            navigate(destination, { replace: true });
          } catch (requestError: any) {
            setError(requestError?.response?.data?.message ?? "Unable to sign in with Google.");
          } finally {
            setLoading(false);
          }
        },
      })
      .requestCode();
  };

  return (
    <main className="bg-page flex min-h-screen items-center justify-center px-4 pt-16">
      <section className="glass-card w-full max-w-md p-7 text-center">
        <LogIn className="mx-auto text-emerald-400" size={30} />
        <h1 className="mt-4 text-2xl font-bold">Sign in to CareerAI</h1>
        <p className="mt-2 text-sm text-white/50">Continue securely with your Google account.</p>
        <button
          type="button"
          onClick={signIn}
          disabled={!ready || loading || !googleClientId}
          className="btn-google mt-7 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <img src="/google.svg" alt="" className="h-5 w-5" />}
          {loading ? "Signing in…" : ready ? "Continue with Google" : "Loading Google sign-in…"}
        </button>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {!googleClientId && <p className="mt-4 text-xs text-amber-300/80">Missing VITE_GOOGLE_CLIENT_ID in app/.env.local.</p>}
      </section>
    </main>
  );
}
