import React, { useMemo } from "react";
import styled from "styled-components";
import { Landmark } from "lucide-react";
import BankIcon from "./BankIcon.jsx";

// ✅ MVP: lista mínima
export const BANKS = [
  { label: "Cofre", value: "cofre", color: "#607d8b" },
  { label: "Nubank", value: "nubank", color: "#820ad1" },
  { label: "Itaú", value: "itau", color: "#ec7000" },
  { label: "Bradesco", value: "bradesco", color: "#cc092f" },
  { label: "Santander", value: "santander", color: "#e30613" },
  { label: "Banco do Brasil", value: "bancodobrasil", color: "#fbf600", text: "#0038a8" },
  { label: "Caixa", value: "caixa", color: "#0066b3" },
  { label: "Inter", value: "inter", color: "#ff7a00" },
  { label: "C6 Bank", value: "c6", color: "#242424" },
  { label: "PicPay", value: "picpay", color: "#11c76f" },
  { label: "Cora", value: "cora", color: "#fe3e6d" },
];

export default function BankPicker({
  value,
  onChange,
}) {
  const selected = useMemo(
    () => BANKS.find((b) => b.value === value),
    [value]
  );

  return (
    <Wrap>
      <Label><Landmark size={14} /> Onde guardará o dinheiro?</Label>
      <Row>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione...</option>
          {BANKS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </Select>

        <Preview aria-label="Preview do banco" $color={selected?.color} $text={selected?.text}>
          {selected ? (
            <BankIcon bankValue={selected.value} size={28} />
          ) : (
            <Placeholder><Landmark size={20} /></Placeholder>
          )}
        </Preview>
      </Row>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 850;
  font-size: 14px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Select = styled.select`
  flex: 1;
  height: 48px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 15px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`;

const Preview = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $color }) => $color || "rgba(255, 255, 255, 0.06)"};
  color: ${({ $text }) => $text || "#fff"};
  display: grid;
  place-items: center;
  overflow: hidden;
  transition: all 0.2s;
`;

const Placeholder = styled.div`
  opacity: 0.65;
`;
