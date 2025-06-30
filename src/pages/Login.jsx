import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { loginComGoogle } from '../services/auth';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await loginComGoogle();
      if (user) {
        navigate("/criar-curriculo");
      }
    } catch (error) {
      console.error("Falha no login com o Google:", error);
      alert("Falha no login. Tente novamente.");
    }
  };

  const GoogleLogo = () => (
    <svg className="google-logo" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h13.04c-.58 2.77-2.28 5.12-4.64 6.7l7.98 6.19c4.63-4.28 7.3-10.49 7.3-17.94z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.11 1.45-4.82 2.3-7.91 2.3-6.27 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

  return (
    <div className="login-page">
      <section className="login-content">
        <header className="login-header">

          <div className="login-logo">
            <span>📄</span>
            <h1> <span className="highlight"> Curriculum Generator </span> </h1>
          </div>

          <h2 className="login-title">
            Crie um currículo vencedor em minutos.
          </h2>

          <p className="login-subtitle">
            Transforme suas informações em um currículo ATS-friendly que se destaca para os recrutadores.
          </p>

        </header>

        <ul className="login-features">
          <li className="feature-item"><span>✅</span> Rápido e intuitivo</li>
          <li className="feature-item"><span>📄</span> Modelos prontos para ATS</li>
          <li className="feature-item"><span>☁️</span> Salve na nuvem e acesse de onde estiver</li>
        </ul>
        
        <button onClick={handleLogin} className="google-login-btn">
          <GoogleLogo />
          Entrar com o Google
        </button>

      </section>

      <section className="login-visual">
        <div className="visual-card">
          <img 
            src="https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg" 
            alt="Preview de um currículo gerado pelo aplicativo" 
          />
        </div>
      </section>
    </div>
  );
}

export default Login;