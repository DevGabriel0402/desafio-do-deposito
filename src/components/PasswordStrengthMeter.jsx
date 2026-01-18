import React from "react";
import styled from "styled-components";

export default function PasswordStrengthMeter({ password }) {
  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "#e2e8f0" };

    let score = 0;
    let hasNum = /[0-9]/.test(pass);
    let hasLetter = /[a-zA-Z]/.test(pass);
    let hasSymbol = /[^A-Za-z0-9]/.test(pass);
    let isLong = pass.length >= 8;

    if (pass.length < 6) return { score: 10, label: "Muito Curta", color: "#ef4444" }; // Red

    // Only numbers or only letters
    if ((hasNum && !hasLetter && !hasSymbol) || (!hasNum && hasLetter && !hasSymbol)) {
      return { score: 30, label: "Fraca", color: "#ef4444" }; // Red
    }

    // Numbers + Letters (no symbols)
    if (hasNum && hasLetter && !hasSymbol) {
      return { score: 60, label: "Média", color: "#eab308" }; // Yellow
    }

    // Strong (Numbers + Letters + Symbols) OR (Letters + Numbers + Mixed Case)
    // Check for symbol OR pure complexity if no symbol but strict mix
    if (hasNum && hasLetter && (hasSymbol || (pass !== pass.toLowerCase() && pass !== pass.toUpperCase() && isLong))) {
      return { score: 100, label: "Forte", color: "#22c55e" }; // Green
    }

    return { score: 50, label: "Média", color: "#eab308" };
  };

  const { score, label, color } = getStrength(password);

  return (
    <Container>
      <Track>
        <Fill $width={score} $color={color} />
      </Track>
      {label && <Label $color={color}>{label}</Label>}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Track = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`;

const Fill = styled.div`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background-color: ${({ $color }) => $color};
  transition: all 0.3s ease;
`;

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-align: right;
`;
