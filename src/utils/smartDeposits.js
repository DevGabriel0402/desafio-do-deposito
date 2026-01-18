// Retorna os índices dos depósitos (no array) que maximizam a soma <= amount
export function pickBestDeposits(deposits, amount) {
    const available = deposits
        .map((d, idx) => ({ ...d, idx }))
        .filter((d) => !d.done);

    const max = Math.floor(Number(amount || 0));
    if (max <= 0 || available.length === 0) return [];

    // dp[s] = array de indices escolhidos pra somar s, ou null se impossível
    const dp = Array(max + 1).fill(null);
    dp[0] = [];

    for (const item of available) {
        const v = Math.floor(item.value);
        for (let s = max; s >= v; s--) {
            if (dp[s - v] !== null && dp[s] === null) {
                dp[s] = [...dp[s - v], item.idx];
            }
        }
    }

    // melhor soma possível
    for (let s = max; s >= 0; s--) {
        if (dp[s] !== null) return dp[s];
    }
    return [];
}
