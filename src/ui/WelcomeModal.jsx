import React from "react";
import styled from "styled-components";
import Modal from "./Modal"; // Assuming Modal is in the same UI folder or adjusted import
import { Button } from "./Button";
import { Settings, User } from "lucide-react";

export default function WelcomeModal({ open, onClose }) {
    return (
        <Modal title="Bem vindo ao Cofrinho! 👋" open={open} onClose={onClose} maxWidth="450px">
            <Content>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <IconWrap>
                        <User size={32} />
                    </IconWrap>
                </div>

                <Text>
                    Estamos felizes em ter você aqui!
                    Por padrão, estamos te chamando pelo seu e-mail, mas você pode deixar tudo com a sua cara.
                </Text>

                <TipBox>
                    <Settings size={18} />
                    <div>
                        Para alterar seu nome, vá em <strong>Configurações</strong> no menu lateral.
                        <SmallText>
                            Em dispositivos móveis, o menu fica no topo do site. 📱
                        </SmallText>
                    </div>
                </TipBox>

                <Footer>
                    <Button onClick={onClose} style={{ width: "100%" }}>
                        Entendi, obrigado!
                    </Button>
                </Footer>
            </Content>
        </Modal>
    );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const IconWrap = styled.div`
    width: 60px; 
    height: 60px;
    background: ${({ theme }) => theme.colors.surface2};
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.brand};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  text-align: center;
  margin: 0;
`;

const TipBox = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  
  strong {
      color: ${({ theme }) => theme.colors.brand};
  }
`;

const SmallText = styled.div`
    font-size: 12px;
    margin-top: 4px;
    opacity: 0.8;
`;

const Footer = styled.div`
  margin-top: 8px;
`;
