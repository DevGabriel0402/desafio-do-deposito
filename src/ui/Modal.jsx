import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { X } from "lucide-react";
import { Card } from "./Card.jsx";
import { Button } from "./Button.jsx";

export default function Modal({ title, open, onClose, children, maxWidth = "600px" }) {
    if (!open) return null;

    return createPortal(
        <Overlay onClick={onClose}>
            <Wrap onClick={(e) => e.stopPropagation()} $maxWidth={maxWidth}>
                <Header>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <Button variant="ghost" onClick={onClose} style={{ padding: "10px 12px" }}>
                        <X size={18} />
                    </Button>
                </Header>
                <Body>{children}</Body>
            </Wrap>
        </Overlay>,
        document.body
    );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.62);
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.space(2)};
`;

const Wrap = styled(Card)`
  width: min(${({ $maxWidth }) => $maxWidth}, 100%);
  padding: ${({ theme }) => theme.space(2)};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(1)};
  margin-bottom: ${({ theme }) => theme.space(1.5)};
`;

const Body = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(1.5)};
`;
