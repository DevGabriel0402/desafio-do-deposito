import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from "firebase/firestore";
import { hexToRgba } from "../utils/colors";

export default function AdminChatWidget() {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const adminEmail = import.meta.env.VITE_EMAIL_ADMIN;
    const sociaEmail = import.meta.env.VITE_EMAIL_SOCIO;
    const adminName = import.meta.env.VITE_NOME_ADMIN || "Admin";
    const sociaName = import.meta.env.VITE_NOME_SOCIO || "Sócia";

    // Check permission
    const isAllowed = currentUser?.email === adminEmail || currentUser?.email === sociaEmail;

    useEffect(() => {
        if (!isAllowed) return;

        const q = query(
            collection(db, "admin_chat"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse(); // Revert to show oldest first at top
            setMessages(data);
        });

        return () => unsubscribe();
    }, [isAllowed]);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    async function handleSend(e) {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Determine sender name
        let senderName = "Desconhecido";
        if (currentUser.email === adminEmail) senderName = adminName;
        if (currentUser.email === sociaEmail) senderName = sociaName;

        try {
            await addDoc(collection(db, "admin_chat"), {
                text: newMessage,
                senderEmail: currentUser.email,
                senderName: senderName,
                createdAt: serverTimestamp()
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    if (!isAllowed) return null;

    return (
        <Wrapper>
            {/* Chat Window */}
            <ChatWindow $open={open}>
                <Header>
                    <HeaderTitle>
                        Chat dos Sócios 🔒
                    </HeaderTitle>
                    <CloseBtn onClick={() => setOpen(false)}>
                        <X size={16} />
                    </CloseBtn>
                </Header>

                <MessagesArea>
                    {messages.map((msg) => {
                        const isMe = msg.senderEmail === currentUser.email;
                        return (
                            <MessageBubble key={msg.id} $isMe={isMe}>
                                <BubbleContent $isMe={isMe}>
                                    <SenderName>{msg.senderName}</SenderName>
                                    <Text>{msg.text}</Text>
                                </BubbleContent>
                            </MessageBubble>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </MessagesArea>

                <InputArea onSubmit={handleSend}>
                    <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Digite algo..."
                    />
                    <SendBtn type="submit" disabled={!newMessage.trim()}>
                        <Send size={16} />
                    </SendBtn>
                </InputArea>
            </ChatWindow>

            {/* Floating Toggle Button */}
            <ToggleBtn onClick={() => setOpen(!open)} $open={open}>
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </ToggleBtn>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 90px; /* Left of the Feedback button on sidebar desktop, or standard position */
  z-index: 1000;

  @media (max-width: 900px) {
    bottom: 90px;
    right: 24px;
  }
`;

const ToggleBtn = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: ${({ theme }) => theme.colors.brand};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  height: 400px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  transform-origin: bottom right;
  transition: all 0.2s ease-in-out;
  opacity: ${({ $open }) => $open ? 1 : 0};
  transform: ${({ $open }) => $open ? 'scale(1)' : 'scale(0.9) translateY(20px)'};
  pointer-events: ${({ $open }) => $open ? 'auto' : 'none'};

  @media (max-width: 480px) {
    width: calc(100vw - 48px);
    right: -20px; /* Adjust for wrapper position */
  }
`;

const Header = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface2};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  &:hover { color: ${({ theme }) => theme.colors.danger}; }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bg};

  /* Scrollbar */
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 4px; }
`;

const MessageBubble = styled.div`
  display: flex;
  justify-content: ${({ $isMe }) => $isMe ? "flex-end" : "flex-start"};
`;

const BubbleContent = styled.div`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${({ $isMe, theme }) => $isMe ? theme.colors.brand : theme.colors.surface};
  color: ${({ $isMe, theme }) => $isMe ? "#fff" : theme.colors.text};
  border: 1px solid ${({ $isMe, theme }) => $isMe ? "transparent" : theme.colors.border};
  
  ${({ $isMe }) => $isMe ? "border-bottom-right-radius: 2px;" : "border-bottom-left-radius: 2px;"}
`;

const SenderName = styled.div`
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 2px;
  font-weight: 700;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 1.4;
`;

const InputArea = styled.form`
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.colors.surface};
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme, disabled }) => disabled ? theme.colors.surface2 : theme.colors.brand};
  color: ${({ theme, disabled }) => disabled ? theme.colors.muted : "#fff"};
  border: none;
  display: grid;
  place-items: center;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  transition: all 0.2s;
`;
