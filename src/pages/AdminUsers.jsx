import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { createClientUser } from "../services/secondaryAuth";
import { toast } from "react-toastify";
import { Plus, X, User, Mail, Calendar, Loader2, Trash2, Clock } from "lucide-react";
import { Card } from "../ui/Card";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter"; // [NEW]

// ... existing Input styled component (assumed defined below)

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", days: "" });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(docs);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar lista de usuários");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.warn("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsCreating(true);
    try {
      await createClientUser(newUser.name, newUser.email, newUser.password, newUser.days);
      toast.success("Usuário criado com sucesso!");
      setShowModal(false);
      setNewUser({ name: "", email: "", password: "", days: "" });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Este email já está em uso.");
      } else {
        toast.error("Erro ao criar usuário: " + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm("Tem certeza que deseja remover este usuário da lista? (A conta de login pode permanecer ativa se não for desativada manualmente)")) return;

    try {
      await deleteDoc(doc(db, "users", uid));
      toast.info("Usuário removido da lista.");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao remover usuário.");
    }
  };

  return (
    <Container>
      <Header>
        <h2>Gerenciar Usuários</h2>
        <p>{users.length} usuários cadastrados</p>
      </Header>

      {loading ? (
        <LoadingArea><Loader2 className="spin" /> Carregando...</LoadingArea>
      ) : (
        <Grid>
          {users.map(user => (
            <UserCard key={user.id}>
              <Avatar>
                <User size={20} />
              </Avatar>
              <Info>
                <Name>{user.displayName || "Sem nome"}</Name>
                <Email><Mail size={12} /> {user.email}</Email>
                <DateInfo>
                  <Calendar size={12} />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                    : "Data desconhecida"}
                </DateInfo>
                {user.expiresAt && (
                  <ExpirationInfo>
                    <Clock size={12} />
                    Expira em: {new Date(user.expiresAt).toLocaleDateString()}
                  </ExpirationInfo>
                )}
              </Info>
              <DeleteBtn onClick={() => handleDeleteUser(user.id)} title="Remover Usuário">
                <Trash2 size={18} />
              </DeleteBtn>
            </UserCard>
          ))}
        </Grid>
      )}

      <Fab onClick={() => setShowModal(true)} title="Adicionar Usuário">
        <Plus size={24} />
      </Fab>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>Novo Usuário</h3>
              <CloseBtn onClick={() => setShowModal(false)}><X size={20} /></CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleCreateUser}>
              <Field>
                <Label>Nome Completo *</Label>
                <Input
                  placeholder="Ex: Gabriel Silva"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                />
              </Field>
              <Field>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="cliente@email.com"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
              </Field>
              <Field>
                <Label>Senha Provisória *</Label>
                <Input
                  type="text"
                  placeholder="Mínimo 6 caracteres"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                />
                <PasswordStrengthMeter password={newUser.password} />
              </Field>
              <Field>
                <Label>Expiração (Dias)</Label>
                <Input
                  type="number"
                  placeholder="Opcional: Ex: 30"
                  value={newUser.days}
                  onChange={e => setNewUser({ ...newUser, days: e.target.value })}
                />
              </Field>

              <Actions>
                <Button type="button" onClick={() => setShowModal(false)} $secondary>Cancelar</Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <Loader2 size={18} className="spin" /> : "Cadastrar"}
                </Button>
              </Actions>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

// --- Styles ---

const Container = styled.div`
  padding-bottom: 80px;

  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const Header = styled.div`
  margin-bottom: 20px;
  h2 { font-size: 24px; margin-bottom: 4px; }
  p { color: ${({ theme }) => theme.colors.muted}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const UserCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.brand};
  display: grid;
  place-items: center;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
`;

const Email = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
`;

const DateInfo = styled(Email)`
  font-size: 12px;
  opacity: 0.8;
`;

const ExpirationInfo = styled(DateInfo)`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  opacity: 1;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.colors?.muted || '#aaa'};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.danger}20;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const LoadingArea = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

// FAB
const Fab = styled.button`
  position: fixed;
  bottom: 120px; /* Mobile: Above BottomBar */
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media(min-width: 900px) {
    bottom: 40px;
    right: 40px;
  }
`;

// Modal Styles (Inline for simplicity or could be imported)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 { margin: 0; font-size: 20px; }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  opacity: 0.6;
  &:hover { opacity: 1; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;
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

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${({ theme, $secondary }) => $secondary ? theme.colors.surface2 : theme.colors.brand};
  color: ${({ theme, $secondary }) => $secondary ? theme.colors.text : "#fff"};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
