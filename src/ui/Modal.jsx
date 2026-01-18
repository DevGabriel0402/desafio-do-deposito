import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { X } from "lucide-react";
import { Card } from "./Card.jsx";
import { Button } from "./Button.jsx";

export default function Modal({ title, open, onClose, children, maxWidth = "600px", fullScreen = false }) {
    if (!open) return null;

    return createPortal(
        <Overlay onClick={onClose} $fullScreen={fullScreen}>
            <Wrap onClick={(e) => e.stopPropagation()} $maxWidth={maxWidth} $fullScreen={fullScreen}>
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
  padding: ${({ theme, $fullScreen }) => $fullScreen ? 0 : theme.space(2)};
`;

const Wrap = styled(Card)`
  width: ${({ $fullScreen, $maxWidth }) => $fullScreen ? "100%" : `min(${$maxWidth}, 100%)`};
  height: ${({ $fullScreen }) => $fullScreen ? "100%" : "auto"};
  border-radius: ${({ $fullScreen, theme }) => $fullScreen ? 0 : theme.radius.lg}; // Assuming theme.radius.lg is default relative to Card
  padding: ${({ theme }) => theme.space(2)};
  display: flex;
  flex-direction: column;
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
