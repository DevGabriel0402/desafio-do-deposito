import React, { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { formatBRL } from "../utils/format.js";
import { hexToRgba } from "../utils/colors.js";
import { Card } from "../ui/Card.jsx";
import { Grid } from "../ui/Layout.jsx";
import { TrendingUp, PiggyBank, CheckCheck } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { useAuth } from "../context/AuthContext.jsx";
import WelcomeModal from "../ui/WelcomeModal.jsx";

export default function Dashboard() {
    const { investments } = useData();
    const { currentUser, userName, isWelcomePending, markWelcomeAsShown } = useAuth();
    const theme = useTheme();

    // Use name from AuthContext (which handles Admin/Socia logic via default or user pref)
    const displayGreeting = useMemo(() => {
        // If user manually set a name, use it.
        // If not, check env vars.

        // Priority: 
        // 1. Manual User Setting (already in userName from AuthContext context logic? 
        //    Wait, logic in AuthContext defaults to email. We need to respect ENV vars too.

        // Let's refine: If AuthContext has a name specifically set by user, use it.
        // But the current AuthContext logic defaults to "email" if not set.
        // We should probably check the Env Vars here as an override for the "Default" 
        // if the user hasn't customized it yet.

        // Actually, simplest way: Check if custom name is stored.
        // If stored, use it.
        // If NOT stored, check ENV vars.

        if (!currentUser) return "Visitante";

        const storedName = localStorage.getItem(`user_name_${currentUser.uid}`);
        if (storedName) return storedName;

        // If no custom name, check Env Vars
        const adminEmail = import.meta.env.VITE_EMAIL_ADMIN;
        const sociaEmail = import.meta.env.VITE_EMAIL_SOCIO;

        if (currentUser.email === adminEmail) {
            return import.meta.env.VITE_NOME_ADMIN || "Admin";
        }
        if (currentUser.email === sociaEmail) {
            return import.meta.env.VITE_NOME_SOCIO || "Sócia";
        }

        return userName || currentUser.email;
    }, [currentUser, userName]);

    const info = useMemo(() => {
        const byInvestment = investments.map((inv) => {
            const juntado = inv.deposits.filter((d) => d.done).reduce((s, d) => s + d.value, 0);
            const total = inv.deposits.reduce((s, d) => s + d.value, 0);
            return { name: inv.name, juntado, total };
        });

        const totalJuntado = byInvestment.reduce((s, x) => s + x.juntado, 0);
        const totalMeta = byInvestment.reduce((s, x) => s + x.total, 0);

        const depositosFeitos = investments.reduce(
            (s, inv) => s + inv.deposits.filter((d) => d.done).length,
            0
        );

        // --- Lógica Timeline (Evolução) ---
        let timeline = [];
        const allDeposits = [];

        investments.forEach((inv) => {
            inv.deposits.forEach((d) => {
                if (d.done && d.doneAt) {
                    allDeposits.push({ date: d.doneAt.split("T")[0], value: d.value });
                }
            });
        });

        // Ordena por data
        allDeposits.sort((a, b) => a.date.localeCompare(b.date));

        // Agrupa por dia
        const grouped = {};
        allDeposits.forEach((d) => {
            if (!grouped[d.date]) grouped[d.date] = 0;
            grouped[d.date] += d.value;
        });

        // Acumula
        const dates = Object.keys(grouped).sort();
        let runningTotal = 0;

        timeline = dates.map(date => {
            runningTotal += grouped[date];
            // Formatar data DD/MM (simples)
            const [y, m, d] = date.split('-');
            return {
                name: `${d}/${m}`,
                fullDate: date,
                total: runningTotal
            };
        });

        // Fallback pra não quebrar gráfico vazio
        if (timeline.length === 0) {
            timeline = [{ name: 'Início', total: 0 }];
        }

        return { byInvestment, totalJuntado, totalMeta, depositosFeitos, timeline };
    }, [investments]);

    return (
        <Grid>
            <WelcomeModal open={isWelcomePending} onClose={markWelcomeAsShown} />

            <HeaderSection>
                <h2 style={{ margin: 0 }}>Olá, {displayGreeting}! 👋</h2>
                <SubText>Aqui está o resumo dos seus investimentos.</SubText>
            </HeaderSection>

            <Cards>
                <Stat
                    $glass
                    icon={<PiggyBank size={16} />}
                    title="Total juntado"
                    value={formatBRL(info.totalJuntado)}
                />
                <Stat
                    $glass
                    icon={<TrendingUp size={16} />}
                    title="Meta total"
                    value={formatBRL(info.totalMeta)}
                />
                <Stat
                    $glass
                    icon={<CheckCheck size={16} />}
                    title="Depósitos feitos"
                    value={info.depositosFeitos}
                />
            </Cards>

            <Card>
                <H3 style={{ color: theme.name === "dark" ? theme.colors.text : theme.colors.text }}>Evolução do Patrimônio</H3>
                <ChartBox>
                    <ResponsiveContainer>
                        <LineChart data={info.timeline}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.name === "dark" ? "rgba(255,255,255,0.1)" : "#e5e7eb"} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: theme.name === "dark" ? "rgba(255,255,255,0.6)" : '#6b7280' }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                formatter={(value) => [formatBRL(value), "Total"]}
                                labelStyle={{ color: theme.name === "dark" ? "#fff" : "#374151", fontWeight: "bold" }}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    backgroundColor: theme.name === "dark" ? "#1f2937" : "#fff",
                                    color: theme.name === "dark" ? "#fff" : "#000"
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke={theme.colors.brand}
                                strokeWidth={3}
                                dot={{ r: 4, fill: theme.colors.brand, strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartBox>

                {info.timeline.length <= 1 && info.totalJuntado === 0 && (
                    <Muted style={{ color: theme.name === "dark" ? "rgba(255,255,255,0.6)" : theme.colors.muted }}>
                        Faça depósitos para ver sua evolução no tempo!
                    </Muted>
                )}
            </Card>
        </Grid>
    );
}

function Stat({ icon, title, value, $glass }) {
    const CardComp = $glass ? GlassCard : Card;
    return (
        <CardComp>
            <StatTop>
                <Badge $glass={$glass}>{icon}</Badge>
                <StatTitle $glass={$glass}>{title}</StatTitle>
            </StatTop>
            <StatValue $glass={$glass}>{value}</StatValue>
        </CardComp>
    );
}

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space(2)};
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatTitle = styled.div`
  color: ${({ $glass, theme }) => {
        if (theme.name === "dark") return theme.colors.text;
        return $glass ? hexToRgba(theme.colors.brand, 0.8) : theme.colors.muted;
    }};
  font-size: 17px;
  font-weight: 950;
  line-height: 1;
`;

const Badge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  flex-shrink: 0;
`;

const StatValue = styled.div`
  margin-top: 14px;
  font-weight: 950;
  font-size: 32px;
  letter-spacing: -0.5px;
  color: ${({ $glass, theme }) => {
        if (theme.name === "dark") return theme.colors.text;
        return $glass ? theme.colors.brand : theme.colors.text;
    }};

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const GlassCard = styled(Card)`
  background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.12)};
  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.brand, 0.15)};
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06);
  backdrop-filter: blur(12px) saturate(220%);
  -webkit-backdrop-filter: blur(12px) saturate(220%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
      135deg, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }
`;

const H3 = styled.h3`
  margin: 0 0 10px 0;
`;

const ChartBox = styled.div`
  width: 100%;
  height: 320px;
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 15px;
  margin-top: 10px;
`;

const HeaderSection = styled.div`
  margin-bottom: 10px;
`;

const SubText = styled.p`
  margin: 4px 0 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 15px;
`;
