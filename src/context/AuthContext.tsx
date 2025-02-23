import { createContext, useContext, useState } from "react";
import { loginUser } from "@/lib/api"; // Import login function from api.ts

interface AuthContextType {
    user: string | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(
        () => localStorage.getItem("user_email") || null
    );
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("access_token") || null
    );

    const login = async (email: string, password: string) => {
        const loginData = await loginUser(email, password);
        if (loginData) {
            setUser(loginData.user);
            setToken(loginData.token);
        }
    };

    const logout = () => {
        localStorage.removeItem("user_email");
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
