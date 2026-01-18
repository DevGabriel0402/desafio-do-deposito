import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { GiTakeMyMoney } from "react-icons/gi";
import { useThemeTransition } from "../context/ThemeContext.jsx";
import { hexToRgba } from "../utils/colors.js";

export default function BottomBar() {
  return (
    <Wrap>
      <Inner>
        <Tab to="/">
          <LayoutDashboard size={28} />
        </Tab>

        <CenterContainer>
          <NotchLeft />
          <CenterTab to="/investimentos">
            <GiTakeMyMoney size={48} color="#ffffff" />
          </CenterTab>
          <NotchRight />
        </CenterContainer>

        <Tab to="/meus">
          <ListChecks size={28} />
        </Tab>
      </Inner>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  padding: 0 16px calc(14px + env(safe-area-inset-bottom));
  pointer-events: none;

  @media (min-width: 900px) {
    display: none;
  }
`;

const Inner = styled.nav`
  pointer-events: auto;
  max-width: 400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 110px 1fr;
  align-items: center;
  height: 80px;
  background: ${({ theme }) => (theme.colors.bg === "#0B1222" ? "#1F2937" : "#FFFFFF")};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const CenterContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const NotchSide = styled.div`
  position: absolute;
  top: -1px; 
  width: 35px;
  height: 35px;
  background: transparent;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    /* This creates the concave shape */
    box-shadow: 0 0 0 100px ${({ theme }) => (theme.colors.bg === "#0B1222" ? "#1F2937" : "#FFFFFF")};
  }
`;

const NotchLeft = styled(NotchSide)`
  right: 100%;
  &::before {
    top: -35px;
    right: -35px;
  }
`;

const NotchRight = styled(NotchSide)`
  left: 100%;
  &::before {
    top: -35px;
    left: -35px;
  }
`;

const Tab = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.muted};
  transition: all 0.3s ease;

  &.active {
    color: ${({ theme }) => theme.colors.brand};
    
    svg {
      fill: currentColor;
    }
  }
`;

const CenterTab = styled(NavLink)`
  position: absolute;
  top: -45px;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.brand}, ${({ theme }) => theme.colors.brand2});
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 12px solid ${({ theme }) => (theme.colors.bg === "#0B1222" ? "#1F2937" : "#FFFFFF")};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto;

  &.active {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.92);
  }
`;
