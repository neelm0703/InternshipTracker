import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import LoadingScreen from './components/LoadingScreen'


export default function App() {
    const { user, loading } = useAuth()

    if (loading) return <LoadingScreen />

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
    )
}