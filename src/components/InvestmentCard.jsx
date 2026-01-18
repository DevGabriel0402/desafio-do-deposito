import React, { useMemo } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { CheckCircle2, Landmark, Trash2, Pencil } from "lucide-react";
import { BANKS } from "./BankPicker.jsx";
import { Card } from "../ui/Card.jsx";
import { formatBRL } from "../utils/format.js";
import BankIcon from "./BankIcon.jsx";
import { formatDateBR } from "../utils/dateFormat.js";
import { hexToRgba } from "../utils/colors.js";
import { APP_ICONS } from "../utils/appIcons.js";


export default function InvestmentCard({ inv, onToggleDeposit, onOpenSmart, onEdit, onDelete }) {
    const totalDone = useMemo(
        () => inv.deposits.filter((d) => d.done).reduce((s, d) => s + d.value, 0),
        [inv.deposits]
    );
    const totalAll = useMemo(
        () => inv.deposits.reduce((s, d) => s + d.value, 0),
        [inv.deposits]
    );

    const bankInfo = useMemo(
        () => BANKS.find(b => b.value === inv.bank),
        [inv.bank]
    );

    const doneCount = inv.deposits.filter((d) => d.done).length;
    const progress = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;

    const InvIcon = APP_ICONS[inv.icon] || APP_ICONS.Target;

    return (
        <Wrap>
            <Top>
                <div>
                    <TitleRow>
                        <IconBox>
                            <InvIcon size={20} />
                        </IconBox>
                        <Title>{inv.name}</Title>
                        {onOpenSmart && (
                            <SmartBtn onClick={() => onOpenSmart(inv)}>
                                <APP_ICONS.GiPayMoney size={15} /> Depósito Inteligente
                            </SmartBtn>
                        )}
                    </TitleRow>
                    <Meta>
                        <BankTag $color={bankInfo?.color} $text={bankInfo?.text}>
                            <BankIcon bankValue={inv.bank} size={16} />
                            {bankInfo?.label || inv.bank}
                        </BankTag>
                        <span>• Início: <b>{formatDateBR(inv.startDate)}</b></span>
                    </Meta>
                </div>

                <Right>
                    {(onEdit || onDelete) && (
                        <Actions>
                            {onEdit && (
                                <ActionBtn onClick={() => onEdit(inv)} title="Editar">
                                    <Pencil size={16} />
                                </ActionBtn>
                            )}
                            {onDelete && (
                                <ActionBtn $danger onClick={() => onDelete(inv.id)} title="Excluir">
                                    <Trash2 size={16} />
                                </ActionBtn>
                            )}
                        </Actions>
                    )}
                    <Big>{formatBRL(totalDone)} <span>/ {formatBRL(totalAll)}</span></Big>
                    <Small>{doneCount} de {inv.deposits.length} depósitos • {progress}%</Small>
                </Right>
            </Top>

            <Bar>
                <Fill $p={progress} />
            </Bar>

            <Buttons>
                {inv.deposits.map((d, idx) => (
                    <Chip
                        key={idx}
                        disabled={d.done}
                        $done={d.done}
                        onClick={() => {
                            if (d.done) return;
                            onToggleDeposit(inv.id, idx);
                        }}
                        title={d.done ? `Feito em ${d.doneAt}` : "Clique para depositar"}
                    >
                        {d.done ? <CheckCircle2 size={16} /> : null}
                        {d.value}
                    </Chip>
                ))}
            </Buttons>
        </Wrap>
    );
}

const Wrap = styled(Card)`
  display: grid;
  gap: ${({ theme }) => theme.space(1.5)};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
  
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  
   @media (max-width: 760px) {
    justify-content: space-between;
    
    /* Make title wrapper take available space if needed, 
       but justified space-between handles the button pushing right */
  }
`;

const IconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
  color: ${({ theme }) => theme.colors.brand};
  display: grid;
  place-items: center;

  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
    svg { width: 18px; height: 18px; }
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  letter-spacing: 0.2px;
`;

const SmartBtn = styled.button`
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(17,24,39,0.10);
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
  font-weight: 800;
  font-size: 11px;
  color: ${({ theme }) => (theme.name === "dark" ? theme.colors.text : theme.colors.brand2)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.2)};
  }
`;

const Meta = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: ${({ theme }) => (theme.name === "dark" ? "#FFFFFF" : theme.colors.muted)};

  span{
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

const BankTag = styled.span`
  color: ${({ theme, $color }) => {
        if (theme.name === "dark") return "#FFFFFF";
        return $color === "#fbf600" ? "#0038a8" : $color || "inherit";
    }};
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  
  @media (max-width: 760px) {
    align-items: flex-start;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  padding: 6px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ $danger, theme }) => {
        if ($danger) return "#ef4444";
        return theme.name === "dark" ? "#FFFFFF" : theme.colors.muted;
    }};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $danger }) => ($danger ? "rgba(239, 68, 68, 0.1)" : "rgba(0,0,0,0.05)")};
    border-color: ${({ $danger }) => ($danger ? "#ef4444" : "rgba(0,0,0,0.1)")};
  }
`;

const Big = styled.div`
  font-size: 22px;
  font-weight: 950;
`;
const Small = styled.div`
  margin-top: 0px;
  color: ${({ theme }) => (theme.name === "dark" ? theme.colors.text : hexToRgba(theme.colors.brand, 0.8))};
  font-weight: 500;
  font-size: 13px;
`;

const Bar = styled.div`
  height: 12px;
  width: 100%;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surface2};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $p }) => $p}%;
  border-radius: 6px;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Gradiente azul de identidade */
  background: linear-gradient(90deg, ${({ theme }) => hexToRgba(theme.colors.brand, 0.6)}, ${({ theme }) => theme.colors.brand});
  box-shadow: 0 0 10px ${({ theme }) => hexToRgba(theme.colors.brand, 0.2)};

  /* Efeito de brilho/gloss */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.05) 100%
    );
  }
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 10px;
`;

const Chip = styled.button`
  height: 44px;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $done, theme }) => ($done ? theme.colors.surface2 : theme.colors.surface)};
  color: ${({ theme }) => theme.colors.text};

  font-weight: 950;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.2px;

  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    border-color: ${({ theme }) => hexToRgba(theme.colors.brand, 0.35)};
  }
`;
