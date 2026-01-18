import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PiggyBank, Settings } from "lucide-react";
import SettingsModal from "../components/SettingsModal.jsx";
import { useState } from "react";
import { useThemeTransition } from "../context/ThemeContext.jsx";

export default function TopBar() {
    const [showSettings, setShowSettings] = useState(false);
    const { appName } = useThemeTransition();

    return (
        <>
            <Bar>
                <Brand>
                    <Dot />
                    <span>{appName}</span>
                </Brand>

                <Actions>
                    <Nav>
                        <Tab to="/">
                            <LayoutDashboard size={18} />
                            <span className="label">Dashboard</span>
                        </Tab>
                        <Tab to="/investimentos">
                            <PiggyBank size={18} />
                            <span className="label">Investimentos</span>
                        </Tab>
                    </Nav>
                    <IconButton onClick={() => setShowSettings(true)}>
                        <Settings size={20} />
                    </IconButton>
                </Actions>
            </Bar>
            <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(2)};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: 0.2px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.brand}, ${({ theme }) => theme.colors.brand2});
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Nav = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px solid transparent;

  &.active{
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface2};
    border-color: ${({ theme }) => theme.colors.border};
  }

  /* Hide label on very small screens */
  @media (max-width: 480px) {
    .label {
        display: none;
    }
    padding: 10px;
  }
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px; 
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface2};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.bg};
        border-color: ${({ theme }) => theme.colors.brand};
        color: ${({ theme }) => theme.colors.brand};
    }
`;
