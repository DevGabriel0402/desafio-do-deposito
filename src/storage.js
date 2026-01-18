const KEY = "mvp_cofrinho_v2";

export function loadData() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return { investments: [], appName: "Cofrinho" };
        const data = JSON.parse(raw);
        if (!data.appName) data.appName = "Cofrinho";
        return data;
    } catch {
        return { investments: [] };
    }
}

export function saveData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}
