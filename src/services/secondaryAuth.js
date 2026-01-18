import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Reutilizamos a config do firebase.js (assumindo que as variáveis de ambiente estão lá)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Nome único para a app secundária
const SECONDARY_APP_NAME = "SecondaryAppForUserCreation";

function getSecondaryApp() {
    // Verifica se já existe para não criar múltiplas vezes
    const existingApps = getApps();
    const found = existingApps.find(app => app.name === SECONDARY_APP_NAME);
    if (found) return found;

    return initializeApp(firebaseConfig, SECONDARY_APP_NAME);
}

/**
 * Cria um usuário usando uma instância secundária do Firebase Auth.
 * Isso evita que o admin atual seja deslogado.
 * Também cria o documento inicial na coleção 'users'.
 */
export async function createClientUser(name, email, password, expirationDays) {
    const secondaryApp = getSecondaryApp();
    const secondaryAuth = getAuth(secondaryApp);
    const secondaryDb = getFirestore(secondaryApp);

    try {
        // 1. Criar Usuário no Auth
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const user = userCredential.user;

        // Calc expiration if provided
        let expiresAt = null;
        if (expirationDays) {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(expirationDays));
            expiresAt = date.toISOString();
        }

        // 2. Criar Documento na Coleção PUBLIC 'users'
        await setDoc(doc(secondaryDb, "users", user.uid), {
            uid: user.uid,
            displayName: name,
            email: email,
            role: "client",
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt
        });

        // 3. Deslogar da instância secundária para limpar estado
        await signOut(secondaryAuth);

        return user;
    } catch (error) {
        console.error("Erro ao criar usuário cliente:", error);
        throw error;
    }
}
