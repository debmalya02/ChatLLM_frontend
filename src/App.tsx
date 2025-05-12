import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import useStore from "./store/useStore";
import supabase from "./supabase";

function App() {
  const { userPreferences, setUser, user } = useStore();

  // Handle theme changes including system preference
  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        userPreferences.theme === "dark" ||
        (userPreferences.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      document.documentElement.classList.toggle("dark", isDark);
      userPreferences.theme = isDark ? "dark" : "light";
    };
    
    // Update theme initially
    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (userPreferences.theme === "system") {
        updateTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [userPreferences.theme]);

  // Handle auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="transition-colors duration-200">
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
      <Toaster richColors position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
