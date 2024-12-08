import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { jwtDecode } from "jwt-decode";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavigateBar from "./components/NavigateBar";
import Footer from "./components/Footer";
import MainPage from "./views/MainPage";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import userDataContext from "./context/userData";
import { User } from "./schemas/user";

function Logout(): ReactElement {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return <Navigate to="/" />;
}

export default function App(): ReactElement {
    const [refreshToken, setRefreshToken] = useState<string>(
        localStorage.getItem("refresh_token") || ""
    );
    const location = useLocation();

    const userData = useMemo(() => {
        const token = localStorage.getItem("access_token");
        try {
            return token === null ? null : (jwtDecode(token) as User);
        } catch {}
        return null;
    }, [location.pathname, refreshToken]);

    return (
        <userDataContext.Provider value={userData}>
            <div id="app">
                <NavigateBar />
                <Routes>
                    <Route
                        path="/login"
                        element={
                            userData === null ? (
                                <LoginPage setRefreshToken={setRefreshToken} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            userData === null ? (
                                <SignUpPage setRefreshToken={setRefreshToken} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            userData === null ? (
                                <Navigate to="/login" />
                            ) : (
                                <MainPage />
                            )
                        }
                    />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
            </div>
        </userDataContext.Provider>
    );
}
