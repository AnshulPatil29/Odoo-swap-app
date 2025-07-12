import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      <Navbar /> 
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<h1 className="text-center">Welcome to the Skill Swap Platform!</h1>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App