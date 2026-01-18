import React, { useState } from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { formatBRL } from "../utils/format.js";

import { useData } from "../context/DataContext.jsx";
import { Grid } from "../ui/Layout.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import Modal from "../ui/Modal.jsx";
import SmartDepositModal from "../components/SmartDepositModal.jsx";
import InvestmentForm from "../components/InvestmentForm.jsx";
import InvestmentCard from "../components/InvestmentCard.jsx";

export default function Investimentos() {
    const { investments, addInvestment, updateInvestment } = useData();
    const [open, setOpen] = useState(false);

    // Smart Deposit State
    const [smartOpen, setSmartOpen] = useState(false);
    const [smartInv, setSmartInv] = useState(null);

    function createInvestment(payload) {
        addInvestment(payload);
    }

    function toggleDeposit(investmentId, depositIndex) {
        const inv = investments.find(i => i.id === investmentId);
        if (!inv) return;

        let depositValue = 0;
        let isMarkingDone = false;

        const newDeposits = inv.deposits.map((d, idx) => {
            if (idx !== depositIndex) return d;

            // Se já estava feito, não faz nada (ou desmarca? O código original verificava if d.done return d, ou seja, só permitia MARCAR).
            // O código original: if (d.done) return d; -> Só permite marcar como feito.
            if (d.done) return d;

            isMarkingDone = true;
            depositValue = d.value;
            return { ...d, done: true, doneAt: new Date().toISOString() };
        });

        if (isMarkingDone) {
            toast.success(`Você depositou mais ${formatBRL(depositValue)} reais 💰`);
            updateInvestment(investmentId, { deposits: newDeposits });
        }
    }

    function applySmartDeposits(investmentId, depositIndexes) {
        const inv = investments.find(i => i.id === investmentId);
        if (!inv) return;

        const now = new Date().toISOString();
        const newDeposits = inv.deposits.map((d, idx) => {
            if (!depositIndexes.includes(idx)) return d;
            if (d.done) return d;
            return { ...d, done: true, doneAt: now };
        });

        updateInvestment(investmentId, { deposits: newDeposits });
    }

    return (
        <Grid>
            <Header>
                <h2 style={{ margin: 0 }}>Desafios</h2>
                <Button onClick={() => setOpen(true)}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Plus size={18} /> Novo desafio
                    </span>
                </Button>
            </Header>

            <Card>
                <p style={{ margin: 0 }}>
                    Clique nos depósitos para marcar como feito ou use a opção inteligente para aproveitar seu saldo atual.
                </p>
            </Card>

            <Grid>
                {investments.length === 0 ? (
                    <Card>
                        Nenhum investimento ainda. Crie o primeiro 🙂
                    </Card>
                ) : (
                    investments.map((inv) => (
                        <InvestmentCard
                            key={inv.id}
                            inv={inv}
                            onToggleDeposit={toggleDeposit}
                            onOpenSmart={(chosen) => { setSmartInv(chosen); setSmartOpen(true); }}
                        />
                    ))
                )}
            </Grid>

            <Modal title="Novo investimento" open={open} onClose={() => setOpen(false)}>
                <InvestmentForm onCreate={createInvestment} onCancel={() => setOpen(false)} />
            </Modal>

            <SmartDepositModal
                open={smartOpen}
                onClose={() => setSmartOpen(false)}
                inv={smartInv}
                onApply={applySmartDeposits}
            />
        </Grid>
    );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
