import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Target, ChevronLeft, ChevronRight, Sun, Moon, Settings, LogOut, User } from "lucide-react";
import { GiTakeMyMoney } from "react-icons/gi";
import { loadData, saveData } from "../storage.js";
import { useThemeTransition } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import FeedbackListModal from "../components/FeedbackListModal.jsx";
import { hexToRgba } from "../utils/colors.js";
import { MessageSquare } from "lucide-react";

import { APP_ICONS } from "../utils/appIcons.js";

const ICONS = APP_ICONS;

export default function Sidebar({ collapsed, onToggle }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const { isDark, toggleTheme, appIcon, brandColor, appName } = useThemeTransition();
  const { logout, currentUser } = useAuth();

  const isAdmin = currentUser?.email === import.meta.env.VITE_EMAIL_ADMIN;

  const BrandIconComponent = ICONS[appIcon] || Target;

  return (
    <>
      <Wrap $collapsed={collapsed}>
        <Toggle onClick={onToggle}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Toggle>

        <Brand $collapsed={collapsed}>
          <BrandIcon>
            <BrandIconComponent size={24} color={brandColor} />
          </BrandIcon>

          <TitleSection $collapsed={collapsed}>
            <Title>{appName}</Title>
          </TitleSection>
        </Brand>

        <Nav>
          <Item to="/" title={collapsed ? "Dashboard" : ""}>
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </Item>

          <Item to="/investimentos" title={collapsed ? "Desafios" : ""}>
            <GiTakeMyMoney size={18} />
            {!collapsed && <span>Desafios</span>}
          </Item>

          <Item to="/meus" title={collapsed ? "Meus Desafios" : ""}>
            <ListChecks size={18} />
            {!collapsed && <span>Meus Desafios</span>}
          </Item>

          {isAdmin && (
            <Item to="/admin/users" title={collapsed ? "Usuários" : ""}>
              <User size={18} />
              {!collapsed && <span>Usuários</span>}
            </Item>
          )}
        </Nav>

        <Footer>
          {isAdmin && (
            <ThemeBtn onClick={() => setShowFeedback(true)} title={collapsed ? "Avaliações" : ""}>
              <MessageSquare size={18} />
              {!collapsed && <span>Avaliações</span>}
            </ThemeBtn>
          )}

          <ThemeBtn onClick={() => setShowSettings(true)} title={collapsed ? "Configurações" : ""}>
            <Settings size={18} />
            {!collapsed && <span>Configurações</span>}
          </ThemeBtn>

          <ThemeBtn onClick={toggleTheme} title={collapsed ? (isDark ? "Light Mode" : "Dark Mode") : ""}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{isDark ? "Claro" : "Escuro"}</span>}
          </ThemeBtn>

          <LogoutBtn onClick={logout} title={collapsed ? "Sair" : ""}>
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </LogoutBtn>
        </Footer>
      </Wrap>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <FeedbackListModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}

const Wrap = styled.aside`
  display: none;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: ${({ $collapsed }) => ($collapsed ? "18px 12px" : "18px")};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    position: sticky;
    top: 0;
    height: 100vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: ${({ $collapsed }) => ($collapsed ? "80px" : "280px")};
    overflow: visible;
  }
`;

const Toggle = styled.button`
  position: absolute;
  right: -14px;
  top: 32px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.brand};
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  z-index: 10;
  transition: all 0.2s;

  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.82);

  &:hover {
    transform: scale(1.1);
    background: #fff;
    box-shadow: 0 6px 14px ${({ theme }) => hexToRgba(theme.colors.brand, 0.12)};
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $collapsed }) => ($collapsed ? "0" : "12px")};
  padding: 4px 0;
  transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-start")};
`;

const BrandIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.brand};
  
  svg {
    color: ${({ theme }) => theme.colors.brand} !important;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: space-between;
  
  /* Animation */
  max-width: ${({ $collapsed }) => ($collapsed ? "0px" : "200px")};
  opacity: ${({ $collapsed }) => ($collapsed ? "0" : "1")};
  transform: translateX(${({ $collapsed }) => ($collapsed ? "-10px" : "0")});
  pointer-events: ${({ $collapsed }) => ($collapsed ? "none" : "auto")};
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Title = styled.div`
  font-weight: 950;
  font-size: 16px;
  letter-spacing: 0.2px;
  line-height: 0.95;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;



const Nav = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.brand};
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.2s;

  span {
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.2s;
  }

  &.active {
    color: ${({ theme }) => theme.name === "dark" ? theme.colors.text : theme.colors.brand};
    background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.12)};
    border: 1px solid ${({ theme }) => hexToRgba(theme.colors.brand, 0.2)};
    backdrop-filter: blur(10px) saturate(200%);
    -webkit-backdrop-filter: blur(10px) saturate(200%);
    box-shadow: 0 4px 12px ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
    font-weight: 900;

    svg {
      fill: currentColor;
    }
  }

  /* Center icon if collapsed */
  ${({ title }) => title && `
    justify-content: center;
    padding: 12px 0;
  `}
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ThemeBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: ${({ title }) => (title ? "center" : "flex-start")};
  gap: 10px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brand};
  }

  span {
    white-space: nowrap;
  }
`;

const LogoutBtn = styled(ThemeBtn)`
  color: ${({ theme }) => theme.colors.danger};
  border-color: ${({ theme }) => theme.colors.danger}20; // low opacity border
  
  &:hover {
     background: ${({ theme }) => theme.colors.danger}10;
     color: ${({ theme }) => theme.colors.danger};
     border-color: ${({ theme }) => theme.colors.danger};
  }
`;


