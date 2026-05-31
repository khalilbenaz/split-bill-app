import { Participant, Expense, Balance, Transfer, AppState } from "./types";

export const DEFAULT_STATE: AppState = {
  participants: [
    { id: "p1", name: "Alice" },
    { id: "p2", name: "Bob" },
    { id: "p3", name: "Clara" },
  ],
  expenses: [
    {
      id: "e1",
      label: "Restaurant Le Gaulois",
      amount: 75.0,
      paidBy: "p1",
      sharedWith: ["p1", "p2", "p3"],
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "e2",
      label: "Supermarché courses",
      amount: 42.5,
      paidBy: "p2",
      sharedWith: ["p1", "p2", "p3"],
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "e3",
      label: "Location voiture",
      amount: 120.0,
      paidBy: "p3",
      sharedWith: ["p2", "p3"],
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "e4",
      label: "Cinema billets",
      amount: 33.0,
      paidBy: "p1",
      sharedWith: ["p1", "p2"],
      date: new Date().toISOString(),
    },
  ],
};

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function computeBalances(
  participants: Participant[],
  expenses: Expense[]
): Balance[] {
  const paid: Record<string, number> = {};
  const owes: Record<string, number> = {};

  participants.forEach((p) => {
    paid[p.id] = 0;
    owes[p.id] = 0;
  });

  expenses.forEach((exp) => {
    if (paid[exp.paidBy] !== undefined) {
      paid[exp.paidBy] += exp.amount;
    }
    const share = exp.amount / exp.sharedWith.length;
    exp.sharedWith.forEach((pid) => {
      if (owes[pid] !== undefined) {
        owes[pid] += share;
      }
    });
  });

  return participants.map((p) => ({
    participantId: p.id,
    name: p.name,
    paid: paid[p.id] ?? 0,
    owes: owes[p.id] ?? 0,
    net: (paid[p.id] ?? 0) - (owes[p.id] ?? 0),
  }));
}

export function computeTransfers(balances: Balance[]): Transfer[] {
  // Minimise transfers using greedy algorithm
  const creditors: { name: string; amount: number }[] = [];
  const debtors: { name: string; amount: number }[] = [];

  balances.forEach((b) => {
    const rounded = Math.round(b.net * 100) / 100;
    if (rounded > 0.005) creditors.push({ name: b.name, amount: rounded });
    else if (rounded < -0.005) debtors.push({ name: b.name, amount: -rounded });
  });

  const transfers: Transfer[] = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci];
    const debt = debtors[di];
    const amount = Math.min(credit.amount, debt.amount);
    const rounded = Math.round(amount * 100) / 100;

    if (rounded > 0.005) {
      transfers.push({ from: debt.name, to: credit.name, amount: rounded });
    }

    credit.amount = Math.round((credit.amount - amount) * 100) / 100;
    debt.amount = Math.round((debt.amount - amount) * 100) / 100;

    if (credit.amount < 0.005) ci++;
    if (debt.amount < 0.005) di++;
  }

  return transfers;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem("split-bill-state");
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed.participants && parsed.expenses) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATE;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem("split-bill-state", JSON.stringify(state));
  } catch {
    // ignore
  }
}
