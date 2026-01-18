export const formatBRL = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(n);
};
