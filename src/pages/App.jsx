import Login from './Login';
import Home from './Home';
import MeusCurriculos from './MeusCurriculos';
import Navigation from '../components/Navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="app">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path='/home' element={<Home/>}/>
                        <Route path='/meus-curriculos' element={<MeusCurriculos/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
