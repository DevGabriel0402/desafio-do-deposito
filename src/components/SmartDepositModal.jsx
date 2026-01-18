import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Modal from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { formatBRL } from "../utils/format.js";
import { pickBestDeposits } from "../utils/smartDeposits.js";

export default function SmartDepositModal({ open, onClose, inv, onApply }) {
    const [amount, setAmount] = useState("");

    const picked = useMemo(() => {
        // suporte basico pra virgula
        const val = Number(String(amount).replace(",", "."));
        if (!inv || isNaN(val)) return [];
        return pickBestDeposits(inv.deposits, val);
    }, [inv, amount]);

    const pickedSum = useMemo(() => {
        if (!inv) return 0;
        return picked.reduce((s, idx) => s + inv.deposits[idx].value, 0);
    }, [picked, inv]);

    function apply() {
        if (!inv) return;
        if (picked.length === 0) return toast.info("Não encontrei combinação para esse valor.");

        onApply(inv.id, picked);
        toast.success(`Marcado: ${picked.length} depósitos • Total: ${formatBRL(pickedSum)}`);
        setAmount("");
        onClose();
    }

    return (
        <Modal title="Opção inteligente" open={open} onClose={onClose}>
            {!inv ? (
                <div>Selecione um investimento.</div>
            ) : (
                <Wrap>
                    <Title>
                        Investimento: <b>{inv.name}</b>
                    </Title>

                    <Field>
                        <label>Quanto você tem disponível?</label>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ex: 37"
                            inputMode="decimal"
                            autoFocus
                        />
                        <small>Dica: Digite o valor que você tem em mãos</small>
                    </Field>

                    <Preview>
                        <span>Melhor combinação:</span>
                        <b>{formatBRL(pickedSum)}</b>
                        <small style={{ lineHeight: 1.4 }}>
                            {picked.length
                                ? `Depósitos: ${picked.map((i) => inv.deposits[i].value).join(", ")}`
                                : "Nenhum depósito selecionado"}
                        </small>
                    </Preview>

                    <Actions>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button onClick={apply} disabled={!picked.length || pickedSum === 0}>Marcar agora</Button>
                    </Actions>
                </Wrap>
            )}
        </Modal>
    );
}

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.muted};
`;

const Field = styled.div`
  display: grid;
  gap: 6px;

  label { font-weight: 850; font-size: 14px; }

  input{
    width: 100%;
    padding: 12px 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.text};
    outline: none;
    font-size: 16px;
    
    &:focus{
        border-color: ${({ theme }) => theme.colors.brand};
    }
  }

  small{ color: ${({ theme }) => theme.colors.muted}; font-size: 12px; }
`;

const Preview = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  display: grid;
  gap: 4px;

  span{ color: ${({ theme }) => theme.colors.muted}; font-weight: 700; font-size: 13px; }
  b{ font-size: 20px; color: ${({ theme }) => theme.colors.brand2}; }
  small{ color: ${({ theme }) => theme.colors.muted}; font-size: 13px; }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;
