import React from "react";
import styled from "styled-components";
import { ICONES } from "../utils/bankIcons.js";

export default function BankIcon({ bankValue, size = 24 }) {
  const key = bankValue?.replace(/-/g, '').toLowerCase();
  const IconData = ICONES[key];

  if (!IconData) return null;

  if (typeof IconData === 'string') {
    return (
      <IconWrap
        $size={size}
        dangerouslySetInnerHTML={{ __html: IconData }}
      />
    );
  }

  // Assume it's a React Component
  const Icon = IconData;
  return (
    <IconWrap $size={size}>
      <Icon size={size} />
    </IconWrap>
  );
}

const IconWrap = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
