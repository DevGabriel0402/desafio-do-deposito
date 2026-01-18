import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Target, Sun, Moon, Settings, LogOut, MessageSquare } from "lucide-react";
import { useThemeTransition } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import FeedbackListModal from "../components/FeedbackListModal.jsx";
import { hexToRgba } from "../utils/colors.js";

import { APP_ICONS } from "../utils/appIcons.js";

const ICONS = APP_ICONS;

export default function MobileHeader() {
  const { isDark, toggleTheme, brandColor, appIcon, appName } = useThemeTransition();
  const { logout, currentUser } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const isAdmin = currentUser?.email === import.meta.env.VITE_EMAIL_ADMIN;

  const BrandIconComponent = ICONS[appIcon] || Target;

  /* Removed inline editing logic */

  return (
    <>
      <Wrap>
        <Brand>
          <IconBox>
            <BrandIconComponent size={20} color={brandColor} />
          </IconBox>
          <TitleSection>
            <Title>{appName}</Title>
          </TitleSection>
        </Brand>

        <Right>
          {isAdmin && (
            <SettingsBtn onClick={() => setShowFeedback(true)} title="Ver Avaliações">
              <MessageSquare size={20} />
            </SettingsBtn>
          )}

          <SettingsBtn onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </SettingsBtn>
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggle>

          <LogoutBtn onClick={logout}>
            <LogOut size={20} />
          </LogoutBtn>
        </Right>
      </Wrap>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <FeedbackListModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}

const Wrap = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: ${({ theme }) => (theme.colors.bg === "#0B1222" ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.7)")};
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;

  @media (min-width: 900px) {
    display: none;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
  display: grid;
  place-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 950;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

/* Removed EditBtn & TitleInput styled components */

const LogoutBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.danger};
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:hover {
      background: ${({ theme }) => theme.colors.danger}15;
  }
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.brand};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.9);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingsBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  display: grid;
  place-items: center;
  cursor: pointer;
  
  &:active {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;
