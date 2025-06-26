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
        <>
            <main className='login-container'>
                <img src="https://cdn.imagine.art/processed/c9a6ead5-b318-4f6d-9c36-da8e5a7add4a" alt="" className='rigth-side-image' />
                
                <section className='login-section'>
                    <h1>Curriculum Generator</h1>

                    <h2>Crie o seu currículo vencedor aqui na <label className='app-name'>Curriculum Generator</label>!</h2>

                    <button onClick={handleLogin}>
                        Fazer Login
                    </button>
                </section>
            </main>
        </>
        
  );
}

export default Login;