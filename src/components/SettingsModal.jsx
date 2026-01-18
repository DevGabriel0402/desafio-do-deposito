import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components"; // [RESTORED]
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useThemeTransition } from "../context/ThemeContext.jsx";
import { ChevronDown, Palette, Type, LayoutGrid, User, Lock } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { HexColorPicker } from "react-colorful";
import { hexToRgba } from "../utils/colors.js";
import { ICON_OPTIONS } from "../utils/appIcons.js";
import { useAuth } from "../context/AuthContext.jsx";

const ICONS_OPTIONS = ICON_OPTIONS;

export default function SettingsModal({ open, onClose }) {
  const {
    brandColor, setBrandColor,
    appIcon, setAppIcon,
    appName, setAppName,
  } = useThemeTransition();

  const { userName, updateUserName, updateUserPassword } = useAuth();

  // Local draft state
  const [draftColor, setDraftColor] = useState(brandColor);
  const [draftIcon, setDraftIcon] = useState(appIcon);
  const [draftName, setDraftName] = useState(appName);
  const [draftUserName, setDraftUserName] = useState(userName);
  const [draftPassword, setDraftPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [iconOpen, setIconOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const dropdownRef = useRef(null);

  // Sync draft with global state when modal opens
  useEffect(() => {
    if (open) {
      setDraftColor(brandColor);
      setDraftIcon(appIcon);
      setDraftName(appName);
      setDraftUserName(userName);
      setDraftPassword("");
      setConfirmPassword("");
    }
  }, [open, brandColor, appIcon, appName, userName]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIconOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSave() {
    if (draftPassword) {
      if (draftPassword !== confirmPassword) {
        toast.warn("As senhas não coincidem!");
        return;
      }
      if (draftPassword.length < 6) {
        toast.warn("Senha deve ter no mínimo 6 caracteres.");
        return;
      }
      try {
        await updateUserPassword(draftPassword);
        toast.success("Senha atualizada!");
      } catch (error) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
          toast.error("Por segurança, faça login novamente para trocar a senha.");
          // Optional: force logout functionality could be added here
        } else {
          toast.error("Erro ao atualizar senha (" + error.code + ")");
        }
        return;
      }
    }

    setBrandColor(draftColor);
    setAppIcon(draftIcon);
    setAppName(draftName);
    updateUserName(draftUserName);
    onClose();
  }

  const selectedIconOption = ICONS_OPTIONS.find(opt => opt.value === draftIcon) || ICONS_OPTIONS[0];
  const SelectedIconComp = selectedIconOption.icon;

  return (
    <Modal title="Aparência e Estilo" open={open} onClose={onClose} maxWidth="480px">

      <GridContainer>
        {/* Coluna Esquerda: Dados Principais */}
        <LeftCol>

          {/* User Name Preference */}
          <Section>
            <Label><User size={14} /> Como quer ser chamado?</Label>
            <Input
              type="text"
              value={draftUserName}
              onChange={(e) => setDraftUserName(e.target.value)}
              placeholder="Seu nome"
            />
          </Section>

          <Section>
            <Label><Type size={14} /> Nome do Painel</Label>
            <Input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Ex: Minha Carteira"
            />
          </Section>

          <Section>
            <Label><LayoutGrid size={14} /> Ícone</Label>
            <SelectWrapper ref={dropdownRef}>
              <SelectHead onClick={() => setIconOpen(!iconOpen)}>
                <IconRow>
                  <SelectedIconComp size={18} />
                  <span>{selectedIconOption.label}</span>
                </IconRow>
                <ChevronDown size={14} />
              </SelectHead>

              {iconOpen && (
                <SelectDropdown>
                  {ICONS_OPTIONS.map((opt) => (
                    <Option
                      key={opt.value}
                      onClick={() => {
                        setDraftIcon(opt.value);
                        setIconOpen(false);
                      }}
                      $selected={draftIcon === opt.value}
                    >
                      <opt.icon size={16} />
                      <span>{opt.label}</span>
                    </Option>
                  ))}
                </SelectDropdown>
              )}
            </SelectWrapper>
          </Section>
        </LeftCol>

        {/* Coluna Direita: Cor e Segurança */}
        <RightCol>
          <Section>
            <Label><Palette size={14} /> Cor de Destaque</Label>
            <ColorCard onClick={() => setShowColorPicker(!showColorPicker)}>
              <div style={{ background: draftColor, width: 24, height: 24, borderRadius: 6, border: '1px solid rgba(0,0,0,0.1)' }} />
              <span>{draftColor.toUpperCase()}</span>
              <ChevronDown size={14} style={{ marginLeft: 'auto', transform: showColorPicker ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </ColorCard>

            {showColorPicker && (
              <PickerWrap>
                <HexColorPicker color={draftColor} onChange={setDraftColor} />
              </PickerWrap>
            )}
          </Section>

          <Section>
            <Label><Lock size={14} /> Segurança (Opcional)</Label>
            <Input
              type="password"
              value={draftPassword}
              onChange={(e) => setDraftPassword(e.target.value)}
              placeholder="Nova Senha"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar Nova Senha"
            />
            <PasswordStrengthMeter password={draftPassword} />
          </Section>
        </RightCol>
      </GridContainer>

      <Footer>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar alterações</Button>
      </Footer>
    </Modal>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  font-weight: 600;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
    background: ${({ theme }) => theme.colors.bg};
  }
`;

const ColorCard = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: ${({ theme }) => theme.colors.surface2};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s;

    &:hover{
        border-color: ${({ theme }) => theme.colors.brand};
    }
`;

const PickerWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
  animation: fadeIn 0.2s ease;
  background: ${({ theme }) => theme.colors.surface};
  padding: 10px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  .react-colorful {
    width: 100%;
    height: 140px;
    border-radius: 8px;
  }
  
  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const SelectHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const SelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 50;
  overflow: hidden;
  max-height: 220px;
  overflow-y: auto;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  color: ${({ theme, $selected }) => $selected ? theme.colors.brand : theme.colors.text};
  background: ${({ theme, $selected }) => $selected ? hexToRgba(theme.colors.brand, 0.08) : "transparent"};
  font-weight: ${({ $selected }) => $selected ? "700" : "500"};
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
