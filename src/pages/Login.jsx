import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { useAuth } from "../context/AuthContext";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import piggyHero from "../assets/piggy_login.png";
import { PiggyBank, MessageSquarePlus } from "lucide-react";
import FeedbackModal from "../components/FeedbackModal";

export default function Login() {
  const { login, loginAnonymous, resetPassword } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("feedback_pending")) {
      setShowFeedback(true);
      localStorage.removeItem("feedback_pending");
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRecovering) {
        await resetPassword(email);
        toast.success("Email de recuperação enviado! 📧");
        setIsRecovering(false);
      } else {
        await login(email, password);
        toast.success("Bem-vindo(a)! 👋");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (isRecovering) {
        if (error.code === 'auth/user-not-found') {
          toast.error("Email não cadastrado.");
        } else {
          toast.error("Erro ao enviar email.");
        }
      } else {
        toast.error("Erro ao entrar. Verifique seus dados.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAnonymous() {
    setLoading(true);
    try {
      await loginAnonymous();
      toast.info("Modo teste iniciado! Você tem 5 minutos. ⏱️");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao iniciar modo teste.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <FormSection>
        <ContentWrapper>
          <Brand>
            <PiggyBank size={32} color={theme.colors.brand} weight="fill" />
            Cofrinho
          </Brand>

          <Header>
            <Title>{isRecovering ? "Recuperar Senha" : "Bem-vindo(a)!"}</Title>
            <Subtitle>
              {isRecovering
                ? "Informe seu email para definir uma nova senha."
                : "Escolha uma opção para entrar."}
            </Subtitle>
          </Header>

          <Form onSubmit={handleLogin}>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            {!isRecovering && (
              <Field>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Label>Senha</Label>

                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <ForgotBtn type="button" onClick={() => setIsRecovering(true)}>
                  Esqueceu a senha?
                </ForgotBtn>
              </Field>
            )}

            <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: 10 }}>
              {loading
                ? "Processando..."
                : (isRecovering ? "Enviar Email de Recuperação" : "Entrar")}
            </Button>

            {isRecovering && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsRecovering(false)}
                style={{ width: "100%", marginTop: -10 }}
              >
                Voltar para Login
              </Button>
            )}
          </Form>

          <DividerRow>
            <Line />
            <span>ou continue com</span>
            <Line />
          </DividerRow>

          <Button
            variant="ghost"
            onClick={handleAnonymous}
            disabled={loading}
            style={{ width: "100%", border: "1px solid #E2E8F0" }}
          >
            Testar sem cadastro (Anônimo)
          </Button>
        </ContentWrapper>
      </FormSection>

      <ImageSection>
        <Overlay>
          <HeroTitle>Poupar é o começo.</HeroTitle>
          <HeroSubtitle>Transforme pequenos depósitos em grandes sonhos.</HeroSubtitle>
        </Overlay>
      </ImageSection>
      <FeedbackButton onClick={() => setShowFeedback(true)} title="Avaliar Experiência">
        <MessageSquarePlus size={24} />
      </FeedbackButton>

      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  background: #fff;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1.2fr;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #fff;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Brand = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #0B1220;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #0B1220;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #64748B;
  font-size: 16px;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  color: #0F172A;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563EB;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94A3B8;
  font-size: 14px;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: #E2E8F0;
`;

const ImageSection = styled.div`
  display: none;
  background-image: url(${piggyHero});
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 60px;
  }
`;

const Overlay = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const HeroTitle = styled.h2`
  color: #fff;
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
  letter-spacing: -0.5px;
`;

const HeroSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
`;

const ForgotBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.brand};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: right;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FeedbackButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #2563EB;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 50;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;
