import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importando os ícones
import "../styles/Login.css"; // Arquivo de estilo específico (opcional)
import logo from "../media/Logo-sem-fundo.png"
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Custom English"
  }, []); // O título será alterado apenas uma vez quando o componente for montado.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // const response = await fetch("https://customenglish.up.railway.app/api/login/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({ email, senha:password }),
      // });
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha:password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        const { categoria, access_token, user_id } = data;

        // Salvando o token
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("user_id", user_id)

        // Redirecionando com base na categoria
        if (categoria === "ALUNO") {
          navigate("/aluno-dashboard");
        } else if (categoria === "PROFESSOR") {
          navigate("/professor-dashboard");
        }
      } else {
        setError(data.detail || "Erro ao fazer login. Tente Novamente.")
      }
    } catch (err) {
      setError("Erro de conexão.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        
        <div className="form-group">
          <label htmlFor="email"></label>
          <div className="input-with-icon">
            <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <FaEnvelope className="input-icon" /> {/* Ícone de e-mail */}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password"></label>
          <div className="input-with-icon">
            <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <FaLock className="input-icon" /> {/* Ícone de senha */}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Carregando..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
