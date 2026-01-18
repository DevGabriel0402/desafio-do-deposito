import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import styled from "styled-components";

import BottomBar from "./ui/BottomBar.jsx";
import Sidebar from "./ui/Sidebar.jsx";
import MobileHeader from "./ui/MobileHeader.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Investimentos from "./pages/Investimentos.jsx";
import MeusInvestimentos from "./pages/MeusInvestimentos.jsx";
import Login from "./pages/Login.jsx";

import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
export default function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { currentUser, timeLeft } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  // Simple time formatter
  const formatTime = (ms) => {
    if (ms === null || ms < 0) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* If user goes to login but is logged in, maybe redirect? */}
      </Routes>
    );
  }

  return (
    <>
      <Frame $collapsed={collapsed}>
        <MobileHeader />
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Main>
          {currentUser && currentUser.isAnonymous && timeLeft !== null && (
            <TimerBanner>
              <span>⚠️ Modo Teste:</span>
              <b>{formatTime(timeLeft)}</b> restantess
            </TimerBanner>
          )}

          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/investimentos" element={<ProtectedRoute><Investimentos /></ProtectedRoute>} />
            <Route path="/meus" element={<ProtectedRoute><MeusInvestimentos /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Main>
      </Frame>

      <BottomBar />
    </>
  );
}

const Frame = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: ${({ $collapsed }) => ($collapsed ? "80px" : "280px")} 1fr;
    transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 0;
  }
`;

const Main = styled.main`
  padding: ${({ theme }) => theme.space(3)};
  padding-bottom: calc(${({ theme }) => theme.space(9)} + env(safe-area-inset-bottom));

  @media (min-width: 900px) {
    padding-bottom: ${({ theme }) => theme.space(3)};
  }
`;

const TimerBanner = styled.div`
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.85; }
    100% { opacity: 1; }
  }
`;
