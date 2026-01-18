import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "../ui/Modal";
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Star, Trash2, CalendarDays, MessageSquare } from "lucide-react";
import { formatDateBR } from "../utils/dateFormat";

export default function FeedbackListModal({ open, onClose }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [open]);

  async function handleDelete(id) {
    if (confirm("Tem certeza que deseja apagar este feedback?")) {
      await deleteDoc(doc(db, "feedback", id));
    }
  }

  return (
    <Modal title="Avaliações dos Usuários ⭐" open={open} onClose={onClose} fullScreen>
      <Container>
        {loading ? (
          <EmptyState>Carregando avaliações...</EmptyState>
        ) : feedbacks.length === 0 ? (
          <EmptyState>
            <MessageSquare size={48} opacity={0.3} />
            <p>Nenhuma avaliação recebida ainda.</p>
          </EmptyState>
        ) : (
          <List>
            {feedbacks.map((fb) => (
              <Card key={fb.id}>
                <Header>
                  <User>
                    <Avatar>{fb.name ? fb.name[0].toUpperCase() : "?"}</Avatar>
                    <div>
                      <Name>{fb.name || "Anônimo"}</Name>
                      <DateRow>
                        <CalendarDays size={12} />
                        {fb.createdAt ? formatDateBR(fb.createdAt.toDate().toISOString()) : "Data desconhecida"}
                      </DateRow>
                    </div>
                  </User>
                  <Rating>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < fb.rating ? "#F59E0B" : "none"}
                        color={i < fb.rating ? "#F59E0B" : "#CBD5E1"}
                      />
                    ))}
                  </Rating>
                </Header>

                {fb.comment && <Comment>"{fb.comment}"</Comment>}

                <Footer>
                  <DeleteBtn onClick={() => handleDelete(fb.id)} title="Excluir Avaliação">
                    <Trash2 size={14} /> Excluir
                  </DeleteBtn>
                </Footer>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const User = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand};
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`;

const DateRow = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const Rating = styled.div`
  display: flex;
  gap: 2px;
`;

const Comment = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  font-style: italic;
  background: ${({ theme }) => theme.colors.bg};
  padding: 10px;
  border-radius: 8px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
`;
