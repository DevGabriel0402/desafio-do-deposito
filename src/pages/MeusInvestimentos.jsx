import React, { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useData } from "../context/DataContext.jsx";
import { Card } from "../ui/Card.jsx";
import BankIcon from "../components/BankIcon.jsx";
import { BANKS } from "../components/BankPicker.jsx";
import { hexToRgba } from "../utils/colors.js";
import { formatDateBR } from "../utils/dateFormat.js";
import { Button } from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import InvestmentForm from "../components/InvestmentForm.jsx";
import { toast } from "react-toastify";
import { APP_ICONS } from "../utils/appIcons.js";

import { ListChecks } from "lucide-react";

export default function MeusInvestimentos() {
    const { investments, updateInvestment, deleteInvestment } = useData();
    const theme = useTheme();
    const [filter, setFilter] = useState("andamento");
    const [editOpen, setEditOpen] = useState(false);
    const [editInv, setEditInv] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function handleUpdate(payload) {
        // Form sends full object with ID
        const { id, ...rest } = payload;
        updateInvestment(id, rest); // Call context
        setEditOpen(false); // Close modal
    }

    function confirmDelete(id) {
        setDeleteId(id);
    }

    function handleDelete() {
        if (!deleteId) return;
        deleteInvestment(deleteId); // Call context
        setDeleteId(null);
    }

    const list = useMemo(() => {
        const withProgress = investments.map((inv) => {
            const doneCount = inv.deposits.filter((d) => d.done).length;
            const totalCount = inv.deposits.length;
            const completed = totalCount > 0 && doneCount === totalCount;
            return { ...inv, doneCount, totalCount, completed };
        });

        if (filter === "andamento") return withProgress.filter((i) => !i.completed);
        if (filter === "concluidos") return withProgress.filter((i) => i.completed);
        return withProgress;
    }, [investments, filter]);

    return (
        <Wrap>
            <h2 style={{ margin: 0 }}>Meus Desafios</h2>

            <Filters>
                <Chip $on={filter === "andamento"} onClick={() => setFilter("andamento")}>
                    Em andamento
                </Chip>
                <Chip $on={filter === "concluidos"} onClick={() => setFilter("concluidos")}>
                    Concluídos
                </Chip>
                <Chip $on={filter === "todos"} onClick={() => setFilter("todos")}>
                    Todos
                </Chip>
            </Filters>

            <Grid>
                {list.length === 0 ? (
                    <Card style={{ color: theme.name === "dark" ? theme.colors.text : "rgba(15,23,42,0.65)" }}>
                        Nada por aqui ainda 🙂
                    </Card>
                ) : (
                    list.map((inv) => {
                        const InvIcon = APP_ICONS[inv.icon] || APP_ICONS.Target;
                        const bankInfo = BANKS.find(b => b.value === inv.bank);
                        return (
                            <GlassCard key={inv.id}>
                                <Top>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <IconBox>
                                            <InvIcon size={18} />
                                        </IconBox>
                                        <b style={{ color: theme.name === "dark" ? theme.colors.text : theme.colors.brand }}>{inv.name}</b>
                                    </div>
                                    <StatusBadge $done={inv.completed}>
                                        {inv.completed ? "Concluído" : "Em andamento"}
                                    </StatusBadge>
                                </Top>
                                <BankRow style={{ color: bankInfo ? bankInfo.color : (theme.name === "dark" ? "#FFFFFF" : theme.colors.text) }}>
                                    <BankIcon bankValue={inv.bank} size={20} />
                                    <span>{bankInfo ? bankInfo.label : inv.bank}</span>
                                </BankRow>
                                <small style={{ color: theme.name === "dark" ? theme.colors.text : theme.colors.brand, opacity: 1, fontWeight: 700 }}>
                                    Depósitos: {inv.doneCount}/{inv.totalCount} • Início: {formatDateBR(inv.startDate)}
                                </small>
                                <Actions>
                                    <Button size="sm" variant="outline" onClick={() => { setEditInv(inv); setEditOpen(true); }}>
                                        Editar
                                    </Button>
                                    <Button size="sm" variant="danger" onClick={() => confirmDelete(inv.id)}>
                                        Excluir
                                    </Button>
                                </Actions>
                            </GlassCard>
                        );
                    })
                )}
            </Grid>


            <Modal title="Editar investimento" open={editOpen} onClose={() => setEditOpen(false)}>
                <InvestmentForm
                    initialData={editInv}
                    onSave={handleUpdate}
                    onCancel={() => setEditOpen(false)}
                />
            </Modal>

            <Modal title="Excluir investimento?" open={!!deleteId} onClose={() => setDeleteId(null)}>
                <ConfirmContent>
                    <p>Tem certeza que deseja excluir este investimento? Essa ação não pode ser desfeita.</p>
                    <Actions>
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={handleDelete}>Excluir</Button>
                    </Actions>
                </ConfirmContent>
            </Modal>
        </Wrap >
    );
}

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => (theme.name === "dark" ? theme.colors.text : theme.colors.brand)};
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  
  /* Glassmorphism */
  background: ${({ $on, theme }) => ($on ? hexToRgba(theme.colors.brand, 0.25) : hexToRgba(theme.colors.brand, 0.05))};
  border: 1px solid ${({ $on, theme }) => ($on ? hexToRgba(theme.colors.brand, 0.3) : hexToRgba(theme.colors.brand, 0.1))};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  color: ${({ $on, theme }) => ($on ? theme.colors.brand : theme.colors.muted)};
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ $on, theme }) => ($on ? hexToRgba(theme.colors.brand, 0.3) : hexToRgba(theme.colors.brand, 0.12))};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  
  background: ${({ $done, theme }) => ($done ? "rgba(16, 185, 129, 0.1)" : hexToRgba(theme.colors.brand, 0.1))};
  color: ${({ $done, theme }) => {
        if (theme.name === "dark") return "#FFFFFF";
        return $done ? "#10b981" : theme.colors.brand;
    }};
  border: 1px solid ${({ $done, theme }) => ($done ? "rgba(16, 185, 129, 0.2)" : hexToRgba(theme.colors.brand, 0.2))};
  backdrop-filter: blur(4px);
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  small { 
    color: ${({ theme }) => (theme.name === "dark" ? "#FFFFFF" : "rgba(15,23,42,0.65)")}; 
    font-weight: 700; 
  }
`;

const BankRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

const ConfirmContent = styled.div`
  display: grid;
  gap: 16px;
  p { margin: 0; line-height: 1.5; color: ${({ theme }) => theme.colors.text}; }
`;

const GlassCard = styled(Card)`
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.12)};
  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.brand, 0.15)};
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06);
  backdrop-filter: blur(12px) saturate(220%);
  -webkit-backdrop-filter: blur(12px) saturate(220%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
      135deg, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.1)};
  color: ${({ theme }) => theme.colors.brand};
  display: grid;
  place-items: center;
  flex-shrink: 0;
`;
