import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInAnonymously,
    sendPasswordResetEmail,
    updatePassword
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { toast } from "react-toastify";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { PiggyBank } from "lucide-react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);

    // Helper styled components for loading
    // Since we are inside a function, we'll define them outside or use inline styles for simplicity within this context file 
    // to avoid massive refactoring of the file structure. I will use a simple inline-style approach for the container.


    // User Profile State
    const [userName, setUserName] = useState("");
    const [isWelcomePending, setIsWelcomePending] = useState(false);

    // Session duration for anonymous users: 5 minutes (in ms)
    const ANON_SESSION_DURATION = 5 * 60 * 1000;

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function register(email, password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create public user doc for Admin listing
        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "", // Initially empty
                role: "client",
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error creating user doc:", e);
        }

        return userCredential;
    }

    function loginAnonymous() {
        return signInAnonymously(auth);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    // Wipe data for anonymous user
    async function wipeAnonymousData(uid) {
        try {
            // 1. Delete Firestore Data
            // Note: Client-side deletion of subcollections requires iterating
            const investmentsRef = collection(db, "users", uid, "investments");
            const snapshot = await getDocs(investmentsRef);

            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // 2. Clear LocalStorage Cache
            localStorage.removeItem("@cofrinho/investments");

            console.log("Dados do usuário anônimo apagados com sucesso.");
        } catch (error) {
            console.error("Erro ao apagar dados anônimos:", error);
        }
    }

    // Expose function to update name
    function updateUserName(newName) {
        setUserName(newName);
        if (currentUser) {
            localStorage.setItem(`user_name_${currentUser.uid}`, newName);
        }
    }

    function markWelcomeAsShown() {
        if (currentUser) {
            localStorage.setItem(`welcome_shown_${currentUser.uid}`, "true");
            setIsWelcomePending(false);
        }
    }

    useEffect(() => {
        // Safety backup: Se o Firebase demorar muito, libera o app

        const safetyTimer = setTimeout(() => {
            console.warn("⚠️ Firebase auth check timed out. Force releasing app.");
            setLoading(false);
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            clearTimeout(safetyTimer); // Cancel safety timer
            console.log("🔐 Auth State Changed / User:", user?.uid || "Anonymous/None");

            setCurrentUser(user);
            setLoading(false);

            if (user) {
                // Load User Name preference
                const storedName = localStorage.getItem(`user_name_${user.uid}`);
                if (storedName) {
                    setUserName(storedName);
                } else {
                    // Default to Email if no name set
                    setUserName(user.email || "Visitante");
                }

                // Check for First Login (Welcome Modal)
                const welcomeShown = localStorage.getItem(`welcome_shown_${user.uid}`);
                if (!welcomeShown && !storedName) {
                    // If never shown AND no name set (implies new user or first run with this feature)
                    setIsWelcomePending(true);
                }
            } else {
                setUserName("");
            }

            if (user && user.isAnonymous) {
                // Handle Anonymous Timer
                const storedExpiration = localStorage.getItem("@cofrinho/anon_expiration");
                let expirationTime;

                if (storedExpiration) {
                    expirationTime = parseInt(storedExpiration, 10);
                } else {
                    expirationTime = Date.now() + ANON_SESSION_DURATION;
                    localStorage.setItem("@cofrinho/anon_expiration", expirationTime.toString());
                }

                // Check interval
                const interval = setInterval(() => {
                    const now = Date.now();
                    const remaining = expirationTime - now;

                    if (remaining <= 0) {
                        clearInterval(interval);
                        setTimeLeft(0);

                        // Time's up!
                        toast.info("Seu tempo de teste acabou! 🕒");
                        localStorage.setItem("feedback_pending", "true"); // Flag for Login page
                        wipeAnonymousData(user.uid).then(() => {
                            logout();
                            localStorage.removeItem("@cofrinho/anon_expiration");
                        });
                    } else {
                        setTimeLeft(remaining);
                    }
                }, 1000);

                return () => clearInterval(interval);
            } else {
                // If standard user or logged out, clear expiration
                localStorage.removeItem("@cofrinho/anon_expiration");
                setTimeLeft(null);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        timeLeft,
        login,
        register,
        loginAnonymous,
        logout,
        resetPassword,
        userName,
        updateUserName,
        isWelcomePending,
        markWelcomeAsShown
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    height: "100vh",
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "#ffffff",
                    color: "#0f172a",
                    fontFamily: "sans-serif"
                }}>
                    <LoadingContainer>
                        <div style={{ position: "relative", width: 64, height: 64 }}>
                            {/* Outline */}
                            <PiggyBank size={64} color="#E2E8F0" strokeWidth={1.5} absoluteStrokeWidth />

                            {/* Filling Animation */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                animation: "fillUp 2s ease-in-out infinite"
                            }}>
                                <PiggyBank size={64} color="#2563EB" fill="#2563EB" strokeWidth={1.5} absoluteStrokeWidth />
                            </div>
                        </div>
                        <style>{`
                        @keyframes fillUp {
                            0% { clip-path: inset(100% 0 0 0); }
                            50% { clip-path: inset(0 0 0 0); }
                            100% { clip-path: inset(0 0 0 0); }
                        }
                    `}</style>
                    </LoadingContainer>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
}

const LoadingContainer = ({ children }) => (
    <div style={{
        height: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        background: "#ffffff",
        color: "#0f172a",
        fontFamily: "sans-serif"
    }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            {children}
        </div>
    </div>
);

const LoadingText = ({ children }) => (
    <div style={{ fontWeight: 600, marginTop: 10 }}>{children}</div>
);
