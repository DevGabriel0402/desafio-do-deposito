import React, { useState } from "react";
import styled from "styled-components";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { Star } from "lucide-react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function FeedbackModal({ open, onClose }) {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    async function handleSubmit(e) {
        e.preventDefault();
        if (rating === 0) {
            toast.warn("Por favor, selecione uma nota de 1 a 5 estrelas. ⭐");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "feedback"), {
                name: name || "Anônimo",
                rating,
                comment,
                createdAt: serverTimestamp(),
                source: "anonymous_session_end" // To track origin
            });

            toast.success("Obrigado pelo seu feedback! 🚀");
            setName("");
            setRating(0);
            setComment("");
            onClose();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("Erro ao enviar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal title="Avalie sua Experiência ⭐" open={open} onClose={onClose} maxWidth="500px">
            <Form onSubmit={handleSubmit}>
                <Description>
                    Seu tempo de teste acabou ou você decidiu sair. O que achou do Cofrinho MVP?
                </Description>

                <Field>
                    <Label>Seu Nome (Opcional)</Label>
                    <Input
                        placeholder="Ex: Gabriel"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Field>

                <Field>
                    <Label>Classificação</Label>
                    <StarsContainer>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarBtn
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                active={star <= (hoverRating || rating)}
                            >
                                <Star
                                    size={32}
                                    fill={star <= (hoverRating || rating) ? "#F59E0B" : "none"}
                                    color={star <= (hoverRating || rating) ? "#F59E0B" : "#CBD5E1"}
                                    strokeWidth={1.5}
                                />
                            </StarBtn>
                        ))}
                    </StarsContainer>
                </Field>

                <Field>
                    <Label>Comentário</Label>
                    <TextArea
                        placeholder="Conte-nos o que gostou ou o que podemos melhorar..."
                        rows={4}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </Field>

                <Button type="submit" disabled={loading} style={{ marginTop: 8 }}>
                    {loading ? "Enviando..." : "Enviar Avaliação"}
                </Button>
            </Form>
        </Modal>
    );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 8px 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
  }
`;
