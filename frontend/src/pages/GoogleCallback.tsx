import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
  
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
  
    localStorage.setItem("accessToken", token);
  
    // 🔥 prévenir AuthProvider qu’il doit recharger /auth/me
    window.dispatchEvent(new Event("auth-changed"));
  
    navigate("/", { replace: true });
  }, []);
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Connexion avec Google en cours…</p>
    </div>
  );
}
