import { useState, useEffect, useMemo } from "react";
import { AppState, Expense, Participant } from "./types";
import { loadState, saveState, computeBalances, computeTransfers } from "./utils";
import ParticipantsPanel from "./components/ParticipantsPanel";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import BalanceSummary from "./components/BalanceSummary";

type Tab = "depenses" | "soldes";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<Tab>("depenses");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const balances = useMemo(
    () => computeBalances(state.participants, state.expenses),
    [state.participants, state.expenses]
  );

  const transfers = useMemo(
    () => computeTransfers(balances),
    [balances]
  );

  const expenseParticipantIds = useMemo(() => {
    const ids = new Set<string>();
    state.expenses.forEach((e) => {
      ids.add(e.paidBy);
      e.sharedWith.forEach((id) => ids.add(id));
    });
    return ids;
  }, [state.expenses]);

  function handleParticipantsChange(participants: Participant[]) {
    setState((prev) => ({ ...prev, participants }));
  }

  function handleAddExpense(expense: Expense) {
    setState((prev) => ({ ...prev, expenses: [...prev.expenses, expense] }));
  }

  function handleDeleteExpense(id: string) {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }

  function handleReset() {
    if (confirmReset) {
      setState({ participants: [], expenses: [] });
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">💰</span>
            <span className="font-bold text-slate-800 text-lg tracking-tight shrink-0">Split Bill</span>
            <span className="hidden sm:inline text-slate-400 text-sm ml-1 truncate">— partage de dépenses</span>
          </div>
          <button
            onClick={handleReset}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all shrink-0 whitespace-nowrap ${
              confirmReset
                ? "bg-red-600 text-white border-red-600 font-semibold"
                : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500"
            }`}
          >
            <span className="sm:hidden">{confirmReset ? "Confirmer ?" : "Réinit."}</span>
            <span className="hidden sm:inline">{confirmReset ? "Confirmer la réinitialisation" : "Réinitialiser"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Colonne gauche : participants + ajout */}
          <div className="space-y-4 mb-6 lg:mb-0 lg:col-span-1">
            <ParticipantsPanel
              participants={state.participants}
              onChange={handleParticipantsChange}
              expenseParticipantIds={expenseParticipantIds}
            />
            <ExpenseForm
              participants={state.participants}
              onAdd={handleAddExpense}
            />
          </div>

          {/* Colonne droite : onglets dépenses / soldes */}
          <div className="lg:col-span-2 space-y-4">
            {/* Onglets mobiles */}
            <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1 gap-1 lg:hidden">
              <button
                onClick={() => setTab("depenses")}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  tab === "depenses"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Dépenses
              </button>
              <button
                onClick={() => setTab("soldes")}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                  tab === "soldes"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Soldes &amp; Règlement
              </button>
            </div>

            {/* Sur desktop : affichage en colonne */}
            <div className="hidden lg:block space-y-4">
              <ExpenseList
                expenses={state.expenses}
                participants={state.participants}
                onDelete={handleDeleteExpense}
              />
              <BalanceSummary
                balances={balances}
                transfers={transfers}
                expenses={state.expenses}
              />
            </div>

            {/* Sur mobile : onglets */}
            <div className="lg:hidden">
              {tab === "depenses" ? (
                <ExpenseList
                  expenses={state.expenses}
                  participants={state.participants}
                  onDelete={handleDeleteExpense}
                />
              ) : (
                <BalanceSummary
                  balances={balances}
                  transfers={transfers}
                  expenses={state.expenses}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-6 mt-4 border-t border-slate-100">
        Split Bill — données stockées localement dans votre navigateur
      </footer>
    </div>
  );
}
