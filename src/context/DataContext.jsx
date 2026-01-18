import React, { createContext, useContext, useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";
import { db } from "../services/firebase";
import { toast } from "react-toastify";

// --- CONFIGURAÇÃO DE ACESSO COMPARTILHADO ---
// Substitua pelos emails reais que devem compartilhar a mesma carteira
const SHARED_EMAILS = [
    import.meta.env.VITE_EMAIL_ADMIN,
    import.meta.env.VITE_EMAIL_SOCIO
];
const SHARED_ACCOUNT_UID = "SHARED_WALLET_v1";

function getStorageUid(user) {
    if (!user) return null;

    console.log("[DEBUG] Checking Shared Access for:", user.email);
    console.log("[DEBUG] Allowed Shared Emails:", SHARED_EMAILS);

    if (user.email && SHARED_EMAILS.includes(user.email)) {
        console.log("[DEBUG] -> Accessing SHARED wallet ✅");
        return SHARED_ACCOUNT_UID;
    }
    console.log("[DEBUG] -> Accessing INDIVIDUAL wallet 👤");
    return user.uid;
}
// ---------------------------------------------

const DataContext = createContext();

export const useData = () => useContext(DataContext);

import { useAuth } from "./AuthContext";

export function DataProvider({ children }) {
    const { currentUser } = useAuth();
    const [investments, setInvestments] = useState(() => {
        const saved = localStorage.getItem("@cofrinho/investments");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setInvestments([]);
            setLoading(false);
            return;
        }

        const uid = getStorageUid(currentUser);
        if (!uid) return;

        console.log(`📂 Carregando dados para UID: ${uid} (Usuario: ${currentUser.email})`);

        const colRef = collection(db, "users", uid, "investments");
        const q = query(colRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setInvestments(docs);
            setLoading(false);
            localStorage.setItem("@cofrinho/investments", JSON.stringify(docs));

        }, (error) => {
            console.error("Erro ao carregar dados:", error);
            toast.error("Erro ao sincronizar dados ☁️");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    async function addInvestment(data) {
        if (!currentUser) return;
        try {
            const uid = getStorageUid(currentUser);
            const colRef = collection(db, "users", uid, "investments");
            await addDoc(colRef, {
                ...data,
                createdAt: new Date().toISOString()
            });
            toast.success("Investimento criado! 🚀");
        } catch (error) {
            console.error("Erro ao criar:", error);
            toast.error("Erro ao salvar no banco");
        }
    }

    async function updateInvestment(id, data) {
        if (!currentUser) return;
        try {
            const uid = getStorageUid(currentUser);
            const docRef = doc(db, "users", uid, "investments", id);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            toast.error("Erro ao atualizar");
        }
    }

    async function deleteInvestment(id) {
        if (!currentUser) return;
        try {
            const uid = getStorageUid(currentUser);
            const docRef = doc(db, "users", uid, "investments", id);
            await deleteDoc(docRef);
            toast.info("Investimento removido");
        } catch (error) {
            console.error("Erro ao deletar:", error);
            toast.error("Erro ao remover");
        }
    }

    return (
        <DataContext.Provider value={{
            investments,
            loading,
            addInvestment,
            updateInvestment,
            deleteInvestment
        }}>
            {children}
        </DataContext.Provider>
    );
}
