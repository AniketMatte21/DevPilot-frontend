import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Authcallback() {
  const navigate = useNavigate();

  ;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URI}/auth/me`, {
          credentials: "include",
        });

       

        if (response.ok) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        navigate("/login", { replace: true });
      }
    };

    checkLogin();
  }, [navigate]);

  return <div>Checking authentication...</div>;
}

export default Authcallback;