import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Pencil, Target, CalendarDays, ChevronDown } from "lucide-react";
import BankPicker from "./BankPicker.jsx";
import { Button } from "../ui/Button.jsx";
import { ICON_OPTIONS } from "../utils/appIcons.js";
import Modal from "../ui/Modal.jsx";

export default function InvestmentForm({ onCreate, onSave, onCancel, initialData }) {
    const [name, setName] = useState(initialData?.name || "");
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [depositCount, setDepositCount] = useState(initialData?.deposits?.length || 50);
    const [bank, setBank] = useState(initialData?.bank || "");
    const [icon, setIcon] = useState(initialData?.icon || "Target");

    // Dropdown state
    const [iconOpen, setIconOpen] = useState(false);

    // Confirmation Modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");

    const isEditing = !!initialData;

    const lastId = React.useRef(initialData?.id);

    useEffect(() => {
        const currentId = initialData?.id;
        // Only update if ID changes (switching investments or switching to New)
        // We use a loose check or strict? Strict.
        // If switching New -> Edit (undefined -> 123), match fails -> update.
        // If Edit -> New (123 -> undefined), match fails -> update.
        // If Edit -> Edit Same (123 -> 123), match succeeds -> NO update.

        if (currentId !== lastId.current) {
            lastId.current = currentId;

            if (initialData) {
                setName(initialData.name || "");
                setStartDate(initialData.startDate || "");
                setDepositCount(initialData.deposits?.length || 50);
                setBank(initialData.bank || "");
                setIcon(initialData.icon || "Target");
            } else {
                // Reset if switching to "New" mode
                setName("");
                setStartDate("");
                setDepositCount(50);
                setBank("");
                setIcon("Target");
            }
        }
    }, [initialData]);

    const deposits = useMemo(() => {
        const targetCount = Number(depositCount) || 50;
        let base = [];

        if (isEditing && initialData?.deposits) {
            base = initialData.deposits;
        }

        if (!isEditing) {
            return Array.from({ length: targetCount }, (_, i) => ({
                value: i + 1,
                done: false,
                doneAt: null
            }));
        }

        // Logic for editing:
        // Use mapped array to avoid reference issues if feasible, but keeping base references is good for React keys (if used as such).
        // Here we just return a new array structure.

        let newDeposits = [...base];

        if (newDeposits.length > targetCount) {
            newDeposits = newDeposits.slice(0, targetCount);
        } else if (newDeposits.length < targetCount) {
            const needed = targetCount - newDeposits.length;
            const startVal = newDeposits.length + 1;
            for (let i = 0; i < needed; i++) {
                newDeposits.push({
                    value: startVal + i,
                    done: false,
                    doneAt: null
                });
            }
        }

        return newDeposits;
    }, [depositCount, initialData, isEditing]);

    function handleSaveConfirm() {
        const payload = {
            name: name.trim(),
            startDate,
            bank,
            icon,
            deposits,
        };

        onSave({ ...initialData, ...payload });
        toast.success("Alterações salvas! ✨");
        onCancel();
    }

    function submit(e) {
        e.preventDefault();

        if (!name.trim()) return toast.error("Digite um nome pro investimento.");
        if (!startDate) return toast.error("Selecione a data de início.");
        if (!bank) return toast.error("Selecione o banco.");

        const payload = {
            name: name.trim(),
            startDate,
            bank,
            icon,
            deposits,
        };

        if (isEditing) {
            const currentLen = initialData.deposits?.length || 0;
            const newLen = deposits.length;

            if (newLen !== currentLen) {
                if (newLen > currentLen) {
                    setConfirmMessage(`Uau! 🚀\nVocê aumentou sua meta de ${currentLen} para ${newLen} depósitos.\n\nFocado em juntar dinheiro! Continue assim!`);
                } else {
                    setConfirmMessage(`Cuidado! ⚠️\nVocê diminuiu sua meta de ${currentLen} para ${newLen} depósitos.\n\nLembre-se do seu objetivo e seja fiel ao seu propósito!`);
                }
                setConfirmOpen(true);
                return;
            }

            onSave({ ...initialData, ...payload });
            toast.success("Alterações salvas! ✨");
        } else {
            onCreate(payload);
            toast.success("Investimento criado! ✅");
        }

        onCancel();
    }

    return (
        <form onSubmit={submit}>
            <FormGrid>
                <Field>
                    <Label><Pencil size={14} /> Nome</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Reserva, Viagem..."
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </Field>

                <Field>
                    <Label><Target size={14} /> Ícone</Label>
                    <SelectWrapper>
                        <SelectHead onClick={() => setIconOpen(!iconOpen)}>
                            {(() => {
                                const Opt = ICON_OPTIONS.find(o => o.value === icon) || ICON_OPTIONS[0];
                                const Ico = Opt.icon;
                                return (
                                    <IconRow>
                                        <Ico size={18} />
                                        <span>{Opt.label}</span>
                                    </IconRow>
                                );
                            })()}
                            <ChevronDown size={16} />
                        </SelectHead>

                        {iconOpen && (
                            <SelectDropdown>
                                {ICON_OPTIONS.map((opt) => (
                                    <Option
                                        key={opt.value}
                                        onClick={() => { setIcon(opt.value); setIconOpen(false); }}
                                        $selected={icon === opt.value}
                                    >
                                        <opt.icon size={18} />
                                        <span>{opt.label}</span>
                                    </Option>
                                ))}
                            </SelectDropdown>
                        )}
                    </SelectWrapper>
                </Field>

                <Field>
                    <BankPicker
                        value={bank}
                        onChange={setBank}
                        formato="circulo"
                        tamanho={44}
                    />
                </Field>

                <Field>
                    <Label><CalendarDays size={14} /> Data de início</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </Field>

                <Field>
                    <Label><Target size={14} /> Depósitos (Meta)</Label>
                    <Input
                        type="number"
                        min="1"
                        value={depositCount}
                        onChange={(e) => setDepositCount(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </Field>
            </FormGrid>

            <Actions>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit">{isEditing ? "Salvar" : "Criar"}</Button>
            </Actions>

            <Modal title="Atenção" open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <ConfirmContent>
                    <Message>{confirmMessage}</Message>
                    <Actions>
                        <Button variant="ghost" type="button" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                        <Button type="button" onClick={handleSaveConfirm}>Confirmar Atualização</Button>
                    </Actions>
                </ConfirmContent>
            </Modal>
        </form>
    );
}

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(2)};
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 850;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 15px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Hint = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  margin-top: -2px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const SelectHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  height: 48px;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  
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
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  color: ${({ theme, $selected }) => $selected ? theme.colors.brand : theme.colors.text};
  background: ${({ theme, $selected }) => $selected ? "rgba(0,0,0,0.04)" : "transparent"};
  font-weight: ${({ $selected }) => $selected ? "700" : "500"};

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div`
  white-space: pre-wrap;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  background: ${({ theme }) => theme.colors.surface2};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
