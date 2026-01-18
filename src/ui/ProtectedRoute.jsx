import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
        // Or a nice Spinner component
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
}
