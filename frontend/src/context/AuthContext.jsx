import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Check if user already logged in
    useEffect(() => {
        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    function logout() {
        api.post("/auth/logout")
            .finally(() => {
                setUser(null)
                navigate("/login") // Not needed as Routes defined so that when user null itll go to login
            })
    }

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    setUser(null)
                    navigate("/") // Not needed as Routes defined so that when user null itll go to login
                }
                return Promise.reject(error)
            }
        )
        return () => api.interceptors.response.eject(interceptor)
    }, [navigate])

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}



export function useAuth() {
    return useContext(AuthContext)
}
