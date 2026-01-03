import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Redirect from './RedirectPage';

function App() {
    return (
        <Router>
            <div className="app">
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/redirect-page" />} />
                        <Route path='/redirect-page' element={<Redirect/>} ></Route>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
