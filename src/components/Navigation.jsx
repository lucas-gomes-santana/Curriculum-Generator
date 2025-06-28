import { Link, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { sair } from '../services/auth';
import '../styles/Navigation.css';

function Navigation() {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await sair();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Não mostrar navegação na página de login
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>📄 Gerador de Currículo</h2>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/home" 
            className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
          >
            🏠 Criar Currículo
          </Link>
          <Link 
            to="/meus-curriculos" 
            className={`nav-link ${location.pathname === '/meus-curriculos' ? 'active' : ''}`}
          >
            📚 Meus Currículos
          </Link>
        </div>
        
        <div className="nav-user">
          {auth.currentUser && (
            <div className="user-info">
              <span className="user-email">{auth.currentUser.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 