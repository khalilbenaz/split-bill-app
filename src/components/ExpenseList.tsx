import { Expense, Participant } from "../types";
import { formatEuro, formatDate } from "../utils";

interface Props {
  expenses: Expense[];
  participants: Participant[];
  onDelete: (id: string) => void;
}

function findName(participants: Participant[], id: string): string {
  return participants.find((p) => p.id === id)?.name ?? "Inconnu";
}

export default function ExpenseList({ expenses, participants, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧾</span> Dépenses
        </h2>
        <p className="text-slate-400 text-sm text-center py-6">Aucune dépense enregistrée.</p>
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🧾</span> Dépenses
        <span className="ml-auto text-xs font-normal text-slate-400">{expenses.length} entrée{expenses.length > 1 ? "s" : ""}</span>
      </h2>

      <ul className="space-y-3">
        {sorted.map((exp) => {
          const sharedNames = exp.sharedWith
            .map((id) => findName(participants, id))
            .join(", ");
          return (
            <li
              key={exp.id}
              className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-slate-800 text-sm truncate min-w-0">{exp.label}</span>
                  <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{formatDate(exp.date)}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500 break-words">
                  Payé par{" "}
                  <span className="font-semibold text-indigo-600">
                    {findName(participants, exp.paidBy)}
                  </span>
                  {" · "}Réparti entre{" "}
                  <span className="text-slate-600">{sharedNames}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                  {formatEuro(exp.amount)}
                </span>
                <button
                  onClick={() => onDelete(exp.id)}
                  aria-label={`Supprimer la dépense ${exp.label}`}
                  className="flex items-center justify-center w-7 h-7 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all text-lg leading-none sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
