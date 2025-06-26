import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { loginComGoogle } from '../services/auth';


function Login () {
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        const user = await loginComGoogle();
        if (user) {
            navigate("/home");
        }
        else {
            alert("Falha no login com o Google. Tente novamente.");
        }
    };
    
    return (
        <div>
            <h2>Login</h2>

            <button onClick={handleLogin}>
                Entrar com Google
            </button>
        </div>
  );
}

export default Login;