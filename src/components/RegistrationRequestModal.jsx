import React, { useState } from "react";
import styled from "styled-components";
import { X, UserPlus, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

export default function RegistrationRequestModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("mensal");

  const PLANS = {
    mensal: { label: "Mensal", price: "R$ 10,90" },
    trimestral: { label: "Trimestral", price: "R$ 24,90" },
    semestral: { label: "Semestral", price: "R$ 49,90" },
    anual: { label: "Anual", price: "R$ 89,90" }
  };

  const handleSend = () => {
    if (!name || !email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    const selectedPlan = PLANS[plan];
    const message = `Olá! Gostaria de solicitar um cadastro no sistema.\n\nNome: ${name}\nEmail: ${email}\nSenha Sugerida: ${password}\nPlano Escolhido: ${selectedPlan.label} (${selectedPlan.price})`;
    const PHONE_NUMBER = "5531991660594";

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Solicitar Cadastro" maxWidth="380px">
      <Section>
        <p style={{ marginBottom: 10, color: '#666', fontSize: '13px' }}>Preencha seus dados para solicitar o acesso via WhatsApp.</p>

        <Field>
          <Label>Nome Completo</Label>
          <Input
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Plano de Acesso</Label>
          <Select
            value={plan}
            onChange={e => setPlan(e.target.value)}
          >
            <option value="mensal">Mensal (R$ 10,90)</option>
            <option value="trimestral">Trimestral (R$ 24,90)</option>
            <option value="semestral">Semestral (R$ 49,90)</option>
            <option value="anual">Anual (R$ 89,90)</option>
          </Select>
        </Field>

        <Field>
          <Label>Senha Desejada</Label>
          <Input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <PasswordStrengthMeter password={password} />
        </Field>

        <Button onClick={handleSend} style={{ width: '100%', marginTop: 6 }}>
          <UserPlus size={18} style={{ marginRight: 8 }} />
          Enviar Solicitação
        </Button>
      </Section>
    </Modal>
  );
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #0F172A;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #2563EB;
    background: #fff;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #0F172A;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #2563EB;
    background: #fff;
  }
`;
