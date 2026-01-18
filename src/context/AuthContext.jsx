import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInAnonymously,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile // [NEW]
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { toast } from "react-toastify";
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // [NEW] imports
import { PiggyBank } from "lucide-react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);

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
                displayName: user.displayName || "",
                role: "client",
                welcomeShown: false, // [NEW]
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
            const investmentsRef = collection(db, "users", uid, "investments");
            const snapshot = await getDocs(investmentsRef);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            localStorage.removeItem("@cofrinho/investments");
            console.log("Dados do usuário anônimo apagados com sucesso.");
        } catch (error) {
            console.error("Erro ao apagar dados anônimos:", error);
        }
    }

    // Sync Name to Firestore & Auth Profile
    async function updateUserName(newName) {
        setUserName(newName);
        if (currentUser) {
            try {
                // 1. Auth Profile
                await updateProfile(currentUser, { displayName: newName });

                // 2. Firestore Doc
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, { displayName: newName });

                // 3. Local Storage (Backup)
                localStorage.setItem(`user_name_${currentUser.uid}`, newName);
            } catch (error) {
                console.error("Error updating user name:", error);
            }
        }
    }

    async function markWelcomeAsShown() {
        setIsWelcomePending(false);
        if (currentUser) {
            try {
                // Firestore
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, { welcomeShown: true });

                // Local Backup
                localStorage.setItem(`welcome_shown_${currentUser.uid}`, "true");
            } catch (error) {
                console.error("Error updating welcome status:", error);
            }
        }
    }

    useEffect(() => {
        const safetyTimer = setTimeout(() => {
            console.warn("⚠️ Firebase auth check timed out. Force releasing app.");
            setLoading(false);
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            clearTimeout(safetyTimer);
            console.log("🔐 Auth State Changed / User:", user?.uid || "Anonymous/None");

            setCurrentUser(user);

            if (user) {
                // Fetch User Data from Firestore
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const data = userSnap.data();

                        // Set Name from Firestore (or Auth, or Local)
                        const remoteName = data.displayName || user.displayName;
                        setUserName(remoteName || localStorage.getItem(`user_name_${user.uid}`) || user.email);

                        // Set Welcome Logic
                        if (!data.welcomeShown) {
                            setIsWelcomePending(true);
                        } else {
                            setIsWelcomePending(false);
                        }
                    } else {
                        // Doc doesn't exist (legacy user or error), fallback to local
                        const storedName = localStorage.getItem(`user_name_${user.uid}`);
                        setUserName(storedName || user.displayName || user.email);

                        const welcomeShown = localStorage.getItem(`welcome_shown_${user.uid}`);
                        if (!welcomeShown && !storedName) setIsWelcomePending(true);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Fallback
                    setUserName(user.displayName || user.email);
                }
            } else {
                setUserName("");
            }

            setLoading(false);

            if (user && user.isAnonymous) {
                const storedExpiration = localStorage.getItem("@cofrinho/anon_expiration");
                let expirationTime;

                if (storedExpiration) {
                    expirationTime = parseInt(storedExpiration, 10);
                } else {
                    expirationTime = Date.now() + ANON_SESSION_DURATION;
                    localStorage.setItem("@cofrinho/anon_expiration", expirationTime.toString());
                }

                const interval = setInterval(() => {
                    const now = Date.now();
                    const remaining = expirationTime - now;

                    if (remaining <= 0) {
                        clearInterval(interval);
                        setTimeLeft(0);
                        toast.info("Seu tempo de teste acabou! 🕒");
                        localStorage.setItem("feedback_pending", "true");
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
